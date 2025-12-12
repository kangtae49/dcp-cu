from pathlib import Path
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import webview

from apps.models import PyWatchEvent, PyAction, WatchFile, WatchStatus
import time

from apps.utils.path_util import get_data_path


class MyHandler(FileSystemEventHandler):
    def __init__(self, watch_dir, event_api):
        # self.last_mtime = {}
        # self.window = window
        self.exts = ['.xlsx', '.xls']
        self.watch_dir = watch_dir
        self.event_api = event_api

    def dispatch(self, event):
        if event.is_directory:
            return
        file_path = Path(event.src_path)

        ext = file_path.suffix.lower()
        if ext not in self.exts:
            return

        if file_path.name.startswith("~"):
            return

        # try:
        #     mtime = file_path.stat().st_mtime
        # except FileNotFoundError:
        #     return

        # if self.last_mtime.get(file_path) == mtime:
        #     return

        # self.last_mtime[file_path] = mtime

        super().dispatch(event)


    def on_modified(self, event):
        self.event_api.dispatch_watch_event(PyWatchEvent(
            action=PyAction.PY_WATCH_FILE,
            data=WatchFile(
                status=WatchStatus.MODIFIED,
                path=event.src_path,
                key=str(Path(event.src_path).relative_to(self.watch_dir)),
                mtime=int(Path(event.src_path).stat().st_mtime * 1000)
            )
        ))

    def on_created(self, event):
        self.event_api.dispatch_watch_event(PyWatchEvent(
            action=PyAction.PY_WATCH_FILE,
            data=WatchFile(
                status=WatchStatus.CREATED,
                path=event.src_path,
                key=str(Path(event.src_path).relative_to(self.watch_dir)),
                mtime=int(Path(event.src_path).stat().st_mtime * 1000)
            )
        ))

    def on_deleted(self, event):
        self.event_api.dispatch_watch_event(PyWatchEvent(
            action=PyAction.PY_WATCH_FILE,
            data=WatchFile(
                status=WatchStatus.DELETED,
                path=event.src_path,
                key=str(Path(event.src_path).relative_to(self.watch_dir)),
                mtime=int(time.time()*1000)
            )
        ))


def start_watchdog_data(event_api):
    print("start watchdog")
    watch_dir = get_data_path()
    event_handler = MyHandler(watch_dir, event_api)
    observer = Observer()
    observer.schedule(event_handler, path=watch_dir, recursive=True)
    observer.start()

