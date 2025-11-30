import webview
from webview.window import Window
from apps.models import PyJobEvent, PyWatchEvent


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
    # window = webview.active_window()
    if window:
        window.evaluate_js(f"""
                window.dispatchEvent(
                    new CustomEvent("py-watch-event", {{detail: {event.model_dump_json()}}} )
                );
            """)
    print(f"dispatch_event: {event}")