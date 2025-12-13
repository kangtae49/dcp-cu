import locale
import os
import threading
import subprocess
import time
import glob
import fnmatch
import ctypes
from pathlib import Path
from typing import List, Any
from typing import Optional
import webview
import pysubs2
from charset_normalizer import from_path
import simplejson as json
import zipfile
from pandas._typing import IntStrT

from apps.constants import APP_NAME
from apps.models import DialogType, DialogOptions, Sub, PyJobEvent, PyAction, StreamType, JobData, \
    JobDataStatus, JobStatus, JobDataError, JobDataStream
import pandas as pd

from apps.utils.path_util import get_scripts_path, get_data_path, get_python_path

# MUSIC_PLAYER_SETTING = 'music-player.setting.json'
# MOVIE_PLAYER_SETTING = 'movie-player.setting.json'
# MOSAIC_LAYOUT_SETTING = 'mosaic-layout.setting.json'


processes = {}  # job_id -> Popen
process_lock = threading.Lock()

class ApiException(Exception):
    def __init__(self, message: str):
        self.message = message
        super().__init__(f"{message}")

class ApiError(Exception):
    def __init__(self, message: str):
        self.message = message
        super().__init__(f"{message}")

class JsApi:
    def __init__(self, event_api):
        self.setting = {}
        self.fullscreen = False
        self.event_api = event_api

    def dialog_open(self, options: Optional[dict] = None) -> List[str] | None:
        try:
            # window.pywebview.api.dialog_open().then()
            print(f"options!: {options}")
            if options is None:
                options = DialogOptions()
            else:
                options = DialogOptions(**options)
            if options.dialog_type == DialogType.OPEN:
                dialog_type = webview.FileDialog.OPEN
            elif options.dialog_type == DialogType.FOLDER:
                dialog_type = webview.FileDialog.FOLDER
            else:
                dialog_type = webview.FileDialog.SAVE

            window = webview.active_window()
            print(f"window: {window}")
            print(f"dialog_type: {dialog_type}")
            print(f"options: {options}")
            result = window.create_file_dialog(
                dialog_type=dialog_type,
                directory=options.directory,
                allow_multiple=options.allow_multiple,
                save_filename=options.save_filename,
                file_types=options.file_types,
            )
            return result
        except Exception as e:
            raise ApiException(f"{e}")

    def read_file(self, fullpath: str):
        try:
            if not os.path.exists(fullpath):
                raise ApiError(f"file not found: {fullpath}")
            with open(fullpath, "r", encoding="utf-8") as f:
                content = f.read()
                return content
        except ApiError as e:
            raise e
        except Exception as e:
            raise ApiException(f"{e}")

    def write_file(self, fullpath: str, content: str):
        try:
            directory = os.path.dirname(fullpath)
            if directory:
                os.makedirs(directory, exist_ok=True)

            with open(fullpath, "w", encoding="utf-8") as f:
                f.write(content)
                f.flush()
        except ApiError as e:
            raise e
        except Exception as e:
            raise ApiException(f"{e}")


    def app_read_file(self, subpath: str):
        try:
            # appdata_local = os.getenv("LOCALAPPDATA")
            # fullpath = os.path.join(appdata_local, APP_NAME, subpath)
            file_path = get_scripts_path().joinpath(subpath).absolute()
            content = self.read_file(str(file_path))
            print(f"app_read_file !{subpath}!{content}!")
            return content
        except ApiError as e:
            raise e
        except Exception as e:
            raise ApiException(f"{e}")

    # def app_write_file(self, subpath: str, default: str):
    #     try:
    #         appdata_local = os.getenv("LOCALAPPDATA")
    #         fullpath = os.path.join(appdata_local, APP_NAME, subpath)
    #         # self.setting.update({subpath: content})
    #         content = self.setting.get(subpath, default)
    #         self.write_file(fullpath, content)
    #     except ApiError as e:
    #         raise e
    #     except Exception as e:
    #         raise ApiException(f"{e}")

    def app_read(self, subpath: str):
        if subpath not in self.setting :
            raise ApiError(f"[app_read] not found key  {subpath}")
        return self.setting.get(subpath)

    def app_write(self, subpath: str, content: str):
        self.setting.update({subpath: content})

    def unload(self):
        print(f"unload! all save setting")
        for k, v in self.setting.items():
            self.app_write_file(k, v)
            print(f'save {k}: {v}')

    def toggle_fullscreen(self):
        window = webview.active_window()
        window.toggle_fullscreen()
        self.fullscreen = not self.fullscreen
    def change_fullscreen(self, is_fullscreen: bool):
        if self.fullscreen != is_fullscreen:
            self.toggle_fullscreen()

    def is_fullscreen(self):
        return self.fullscreen

    def get_subs(self, fullpath: str) -> List[Sub]:
        lang_id = ctypes.windll.kernel32.GetUserDefaultUILanguage()
        locale_str = locale.windows_locale.get(lang_id, 'ko_KR')
        os_lang = locale_str.split("_")[0]
        print(f"os_lang: {os_lang}")

        sub_exts = [
            "ass",
            "mpl",
            "json",
            "smi", "sami",
            "srt",
            "ssa",
            "sub",
            "tmp",
            "ttml",
            "vtt",
        ]

        p = Path(fullpath)
        base_dir = p.parent
        stem = p.stem
        subs = []
        fullpath_stem = str(p.with_suffix("").absolute())
        for f in base_dir.glob(f"{glob.escape(stem)}.*"):
            for ext in sub_exts:
                ret = fnmatch.fnmatchcase(f.name, f"*.{ext}")
                if ret:
                    sub_fullpath = str(f.absolute())
                    sp_sub = sub_fullpath[len(fullpath_stem):].rsplit('.', 2)[1:]
                    subtype = '.'.join(sp_sub)
                    if len(sp_sub) == 1:
                        lang = ''
                        priority = 0
                    elif len(sp_sub) == 2 and sp_sub[0].lower() == os_lang.lower():
                        lang = sp_sub[0]
                        priority = 1
                    else:
                        lang = sp_sub[0]
                        priority = 2

                    sub = Sub(fullpath = str(f.absolute()), subtype=subtype, lang=lang, priority=priority, src='')
                    subs.append(sub)
                    break
        sorted_subs = sorted(subs, key=lambda x: x.priority)
        print(f"sorted_subs: {sorted_subs}")
        return [s.model_dump() for s in sorted_subs]

    def read_sub(self, fullpath: str):
        p = Path(fullpath)
        encoding = "utf-8"
        try:
            subs = pysubs2.load(str(p), encoding=encoding)
        except UnicodeDecodeError as e:
            print(f"UnicodeDecodeError: {e}")
            results = from_path(str(p))
            best_guess = results.best()
            encoding = best_guess.encoding if best_guess else "utf-8"
            subs = pysubs2.load(str(p), encoding=encoding)
        except pysubs2.exceptions.FormatAutodetectionError as e:
            raise ApiException(f"not format: {p}")
        return subs.to_string(encoding='utf-8', format_="vtt")

    def dispatch_job_stream(self, stream: str, job_id: str, stream_type: StreamType):
        for line in stream:
            msg = line.rstrip()
            self.event_api.dispatch_job_event(
                PyJobEvent(
                    action=PyAction.PY_JOB_STREAM,
                    job_id=job_id,
                    data=JobDataStream(message=msg, message_type=stream_type)
                ))

    def start_script(self, job_id: str, subpath: str, args: list[str] = []):
        scripts_root = get_scripts_path()
        print(f"start_script: ", job_id, subpath, args)
        print(f"script root: ", scripts_root)
        script_path_abs = scripts_root.joinpath(subpath).absolute()
        interpreter_abs = get_python_path().absolute()
        print(script_path_abs, interpreter_abs)
        print(f"start_script: ", interpreter_abs, script_path_abs, args)
        self.event_api.dispatch_job_event(
            PyJobEvent(
                action=PyAction.PY_JOB_STATUS,
                job_id=job_id,
                data=JobDataStatus(
                    status=JobStatus.RUNNING
                )
            )
        )

        def runner():
            try:
                CREATE_NO_WINDOW = 0x08000000
                p = subprocess.Popen(
                    [interpreter_abs, script_path_abs] + args,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    # stderr=subprocess.STDOUT,
                    text=True,
                    bufsize=1,
                    shell=False,
                    creationflags=CREATE_NO_WINDOW,
                    cwd=scripts_root
                )
                with process_lock:
                    processes[job_id] = p

                # for line in p.stdout:
                #     print(line, end='', flush=True)
                threading.Thread(target=self.dispatch_job_stream, args=(p.stdout, job_id, StreamType.STDOUT), daemon=True).start()
                threading.Thread(target=self.dispatch_job_stream, args=(p.stderr, job_id, StreamType.STDERR), daemon=True).start()

                rc = p.wait()
            finally:
                with process_lock:
                    processes.pop(job_id, None)
                print("finally")
                self.event_api.dispatch_job_event(
                    PyJobEvent(
                        action=PyAction.PY_JOB_STATUS,
                        job_id=job_id,
                        data=JobDataStatus(
                            status=JobStatus.DONE
                        )
                    )
                )

        t = threading.Thread(target=runner, daemon=True)
        t.start()


    def stop_script(self, job_id: str):
        print(f"stop_script: ", job_id)
        with process_lock:
            p = processes.get(job_id)

        if not p:
            self.event_api.dispatch_job_event(
                PyJobEvent(
                    action=PyAction.PY_JOB_ERROR,
                    job_id=job_id,
                    data=JobDataError(
                        message="not found process"
                    )
                )
            )
            return

        try:
            p.terminate()

            def killer(proc):
                time.sleep(1)
                if proc.poll() is None:
                    proc.kill()

            threading.Thread(target=killer, args=(p,), daemon=True).start()

            self.event_api.dispatch_job_event(
                PyJobEvent(
                    action=PyAction.PY_JOB_STATUS,
                    job_id=job_id,
                    data=JobDataStatus(
                        status=JobStatus.STOPPED
                    )
                )
            )
        except Exception as e:
            self.event_api.dispatch_job_event(
                PyJobEvent(
                    action=PyAction.PY_JOB_ERROR,
                    job_id=job_id,
                    data=JobDataError(
                        message=str(e)
                    )
                )
            )
    def start_data_file(self, subpath: str):
        file_path = get_scripts_path().joinpath(subpath)
        os.startfile(file_path)

    def start_file(self, filepath: str):
        os.startfile(filepath)

    # def read_data_excel(self, subpath: str, sheet_name: str | int | list[IntStrT] | None = 0) -> dict[str, list[dict[str, Any]]]:
    #     appdata = Path(os.getenv("APPDATA"))
    #     file_path = appdata.joinpath(APP_NAME).joinpath("data").joinpath(subpath)
    #     result = {}
    #     with pd.ExcelFile(file_path, engine="openpyxl") as xlsx:
    #         sheet_names = xlsx.sheet_names
    #         dfs = pd.read_excel(xlsx, sheet_name=sheet_name, dtype=str, engine="openpyxl")
    #
    #         if isinstance(dfs, pd.DataFrame):
    #             if isinstance(sheet_name, int):
    #                 name = sheet_names[sheet_name]
    #             else:
    #                 name = str(sheet_name)
    #             result = {name: dfs.to_dict(orient="records")}
    #         else:
    #             for k, v in dfs.items():
    #                 if isinstance(k, int):
    #                     name = sheet_names[k]
    #                 else:
    #                     name = str(k)
    #                 result[name] = v.to_dict(orient="records")
    #     return result


    # def read_config(self, key: str) -> dict[str, list[dict[str, Any]]]:
    # def read_config(self, key: str) -> str:
    #     file_path = get_data_path().joinpath(key)
    #     result = {}
    #     with pd.ExcelFile(file_path) as xlsx:
    #         dfs = pd.read_excel(xlsx, sheet_name=0)
    #         # dfs = pd.read_excel(xlsx, sheet_name=0, engine="openpyxl")
    #         # dfs = pd.read_excel(xlsx, sheet_name=0, engine="openpyxl")
    #         if isinstance(dfs, pd.Series):
    #             dfs = dfs.to_frame()
    #         # dfs = dfs.fillna("")
    #         # dfs = dfs.astype(object).where(pd.notnull(dfs), None)
    #         result = {
    #             'key': key,
    #             'header': dfs.columns.to_list(),
    #             'data': dfs.to_dict(orient="records"),
    #         }
    #         # if isinstance(dfs, pd.DataFrame):
    #         #     result = {key: dfs.to_dict(orient="records")}
    #         # else:
    #         #     for k, v in dfs.items():
    #         #         result = {key: v.to_dict(orient="records")}
    #         #         break
    #     return json.dumps(result, ignore_nan=True)


    def read_data_excel(self, key: str) -> str:
        print(f"read_data_excel: {key}")
        file_path = get_scripts_path().joinpath(key)
        result = {}
        # dfs = pd.read_excel(file_path, sheet_name=0, engine="openpyxl")
        try:
            with pd.ExcelFile(file_path, engine="openpyxl") as xlsx:
                dfs = pd.read_excel(xlsx, sheet_name=0)
                # dfs = pd.read_excel(xlsx, sheet_name=0, engine="openpyxl")
                # dfs = pd.read_excel(xlsx, sheet_name=0, engine="openpyxl")
                if isinstance(dfs, pd.Series):
                    dfs = dfs.to_frame()
                # dfs = dfs.fillna("")
                # dfs = dfs.astype(object).where(pd.notnull(dfs), None)
                result = {
                    'key': key,
                    'header': dfs.columns.to_list(),
                    'data': dfs.to_dict(orient="records"),
                }
                # if isinstance(dfs, pd.DataFrame):
                #     result = {key: dfs.to_dict(orient="records")}
                # else:
                #     for k, v in dfs.items():
                #         result = {key: v.to_dict(orient="records")}
                #         break
                return json.dumps(result, ignore_nan=True)
        except zipfile.BadZipFile:
            raise

    def re_send_events(self):
        print("JsApi.re_send_events")
        self.event_api.re_send_events()