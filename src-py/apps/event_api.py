import webview
from webview.window import Window
from apps.models import PyJobEvent, PyWatchEvent
import threading
from collections import deque

class EventApi:
    def __init__(self):
        self.events = deque()

    def dispatch_job_event(self, event: PyJobEvent):
        window = webview.active_window()
        if window:
            window.evaluate_js(f"""
                    window.dispatchEvent(
                        new CustomEvent("py-job-event", {{detail: {event.model_dump_json()}}} )
                    );
                """)
            return True
        else:
            self.events.append(event)
            return False



    def dispatch_watch_event(self, event: PyWatchEvent):
        window = webview.active_window()
        if window:
            window.evaluate_js(f"""
                    window.dispatchEvent(
                        new CustomEvent("py-watch-event", {{detail: {event.model_dump_json()}}} )
                    );
                """)
            return True
        else:
            self.events.append(event)
            return False

    def re_send_events(self):
        while self.events:
            event = self.events.popleft()
            if isinstance(event, PyJobEvent):
                self.dispatch_job_event(event)
            elif isinstance(event, PyWatchEvent):
                self.dispatch_watch_event(event)

#
#
# class WatchEventApi:
#     def __init__(self):
#         self.events = deque()
#
#     def dispatch_watch_event(self, window: Window, event: PyWatchEvent):
#         if window:
#             window.evaluate_js(f"""
#                     window.dispatchEvent(
#                         new CustomEvent("py-watch-event", {{detail: {event.model_dump_json()}}} )
#                     );
#                 """)
#             return True
#         else:
#             self.events.append(event)
#             return False
#
#     def re_send_events(self):
#         while self.events:
#             event = self.events.popleft()
#             self.dispatch_watch_event(event.window, event)
#
#
