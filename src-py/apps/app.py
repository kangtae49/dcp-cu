import os
import sys
import argparse
import threading

import webview

from apps import js_api
from apps.event_api import EventApi
from apps.listeners.window_event_listener import WindowEventListener
from apps.watch_dir import start_watchdog_data
# from webview.platforms.cef import browser_settings, settings

# settings.update({'persist_session_cookies': True})
# browser_settings.update({'dom_paste_disabled': False})
# window_listener = None
event_api = EventApi()
api = js_api.JsApi(event_api)

def get_index_url():
    if hasattr(sys, "_MEIPASS"):
        # dcp-cu.exe
        base_path = sys._MEIPASS
        index_path = os.path.join(base_path, "gui/index.html")
        server_url = f"file://{index_path}"
    else:
        # pnpm dev
        # uv run main.py
        server_url = "http://localhost:5173"
        # server_url = "http://localhost:8097"
        # base_path = os.path.dirname(os.path.abspath(__file__))
        # index_path = os.path.join(base_path, "../dist/index.html")
        # server_url = f"file://{index_path}"
    return server_url

def run():
    # webview.settings = {
    #     'ALLOW_DOWNLOADS': False,
    #     'ALLOW_FILE_URLS': True,
    #     'DRAG_REGION_SELECTOR': 'pywebview-drag-region',
    #     'OPEN_EXTERNAL_LINKS_IN_BROWSER': True,
    #     'OPEN_DEVTOOLS_IN_DEBUG': True,
    #     'IGNORE_SSL_ERRORS': False,
    #     'REMOTE_DEBUGGING_PORT': None,
    #     'SHOW_DEFAULT_MENUS': True
    # }
    print(webview.settings, flush=True)



    parser = argparse.ArgumentParser()
    parser.add_argument("--verbose", action="store_true", help="verbose")
    args = parser.parse_args()
    debug = args.verbose
    print(f'verbose: {args.verbose}')

    window = webview.create_window(
        title='DcpCu',
        url=get_index_url(),
        js_api=api,
        text_select=True,
        draggable=True,
        zoomable=False,
        confirm_close=False,
        width=840, height=600,
        # on_top=True,
        # frameless=True,
        # easy_drag=False,
        # resizable=True,
    )

    # event_api.set_window(window)

    # events
    WindowEventListener(window, api)

    threading.Thread(
        target=start_watchdog_data,
        args=(event_api, ),
        daemon=True
    ).start()

    # webview.start(gui="cef", debug=debug)
    webview.start(debug=debug)
    # webview.start(debug=False)
