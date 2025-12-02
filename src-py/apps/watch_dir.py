from pathlib import Path
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

from apps.utils.event_util import dispatch_watch_event
from apps.models import PyWatchEvent, PyAction, WatchFile, WatchStatus
import time

from apps.utils.path_util import get_data_path


class MyHandler(FileSystemEventHandler):
    def __init__(self, window, watch_dir):
        # self.last_mtime = {}
        self.window = window
        self.exts = ['.xlsx', '.xls']
        self.watch_dir = watch_dir

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
        dispatch_watch_event(self.window, PyWatchEvent(
            action=PyAction.PY_WATCH_FILE,
            data=WatchFile(
                status=WatchStatus.MODIFIED,
                path=event.src_path,
                key=str(Path(event.src_path).relative_to(self.watch_dir)),
                mtime=int(Path(event.src_path).stat().st_mtime * 1000)
            )
        ))

    def on_created(self, event):
        dispatch_watch_event(self.window, PyWatchEvent(
            action=PyAction.PY_WATCH_FILE,
            data=WatchFile(
                status=WatchStatus.CREATED,
                path=event.src_path,
                key=str(Path(event.src_path).relative_to(self.watch_dir)),
                mtime=int(Path(event.src_path).stat().st_mtime * 1000)
            )
        ))

    def on_deleted(self, event):
        dispatch_watch_event(self.window, PyWatchEvent(
            action=PyAction.PY_WATCH_FILE,
            data=WatchFile(
                status=WatchStatus.DELETED,
                path=event.src_path,
                key=str(Path(event.src_path).relative_to(self.watch_dir)),
                mtime=int(time.time()*1000)
            )
        ))


def start_watchdog_data(window):
    print("start watchdog")
    watch_dir = get_data_path()
    event_handler = MyHandler(window, watch_dir)
    observer = Observer()
    observer.schedule(event_handler, path=watch_dir, recursive=True)
    observer.start()

