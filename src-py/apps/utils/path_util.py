import os
import sys
from pathlib import Path

from apps.constants import APP_NAME


def get_data_path() -> Path:
    if hasattr(sys, "_MEIPASS"):
        appdata = Path(os.getenv("APPDATA"))
        return appdata.joinpath(APP_NAME).joinpath("data")
    else:
        return Path(os.curdir).joinpath("scripts").joinpath("data")

def get_scripts_path() -> Path:
    if hasattr(sys, "_MEIPASS"):
        appdata = Path(os.getenv("APPDATA"))
        return appdata.joinpath(APP_NAME)
    else:
        return Path(os.curdir).joinpath("scripts")


def get_python_path() -> Path:
    if hasattr(sys, "_MEIPASS"):
        return get_scripts_path().joinpath(".venv/Scripts/python.exe")
    else:
        return Path(os.curdir).joinpath(".venv/Scripts/python.exe")