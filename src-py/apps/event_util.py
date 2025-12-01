import webview
from webview.window import Window
from apps.models import PyJobEvent, PyWatchEvent
import threading


def dispatch_job_event(event: PyJobEvent):
    window = webview.active_window()
    if window:
        window.evaluate_js(f"""
                window.dispatchEvent(
                    new CustomEvent("py-job-event", {{detail: {event.model_dump_json()}}} )
                );
            """)
    print(f"dispatch_event: {event}")


def dispatch_watch_event(window: Window, event: PyWatchEvent):
    if window:
        window.evaluate_js(f"""
                window.dispatchEvent(
                    new CustomEvent("py-watch-event", {{detail: {event.model_dump_json()}}} )
                );
            """)
    print(f"dispatch_event: {event}")


def dispatch_watch_event_delay(window: Window, event: PyWatchEvent, delay=0.3):
    threading.Timer(delay, dispatch_watch_event, args=(window, event)).start()
