from pathlib import Path
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

from apps.event_util import dispatch_watch_event
from apps.js_api import APP_NAME
from apps.models import PyWatchEvent, PyAction, WatchFile, WatchStatus
import os
import time

class MyHandler(FileSystemEventHandler):
    def __init__(self, window):
        self.last_mtime = {}
        self.window = window
        self.exts = ['.xlsx', '.xls']
        appdata = Path(os.getenv("APPDATA"))
        self.data_path = appdata.joinpath(APP_NAME).joinpath("data")

    def dispatch(self, event):
        if event.is_directory:
            return
        file_path = Path(event.src_path)

        ext = file_path.suffix.lower()
        if ext not in self.exts:
            return

        if file_path.name.startswith("~"):
            return

        try:
            mtime = file_path.stat().st_mtime
        except FileNotFoundError:
            return

        if self.last_mtime.get(file_path) == mtime:
            return

        self.last_mtime[file_path] = mtime

        super().dispatch(event)


    def on_modified(self, event):
        dispatch_watch_event(self.window, PyWatchEvent(
            action=PyAction.PY_WATCH_FILE,
            data=WatchFile(
                status=WatchStatus.MODIFIED,
                path=event.src_path,
                key=str(Path(event.src_path).relative_to(self.data_path)),
                mtime=int(Path(event.src_path).stat().st_mtime * 1000)
            )
        ))

    def on_created(self, event):
        dispatch_watch_event(self.window, PyWatchEvent(
            action=PyAction.PY_WATCH_FILE,
            data=WatchFile(
                status=WatchStatus.CREATED,
                path=event.src_path,
                key=str(Path(event.src_path).relative_to(self.data_path)),
                mtime=int(Path(event.src_path).stat().st_mtime * 1000)
            )
        ))

    def on_deleted(self, event):
        dispatch_watch_event(self.window, PyWatchEvent(
            action=PyAction.PY_WATCH_FILE,
            data=WatchFile(
                status=WatchStatus.DELETED,
                path=event.src_path,
                key=str(Path(event.src_path).relative_to(self.data_path)),
                mtime=int(time.time()*1000)
            )
        ))


def start_watchdog_data(window):
    print("start watchdog")
    appdata = Path(os.getenv("APPDATA"))
    path = appdata.joinpath(APP_NAME).joinpath("data")
    event_handler = MyHandler(window)
    observer = Observer()
    observer.schedule(event_handler, path=path, recursive=True)
    observer.start()

