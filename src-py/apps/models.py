import time
from typing import List
from enum import Enum
from pydantic import BaseModel, Field


class DialogType(str, Enum):
    OPEN = "OPEN"
    FOLDER = "FOLDER"
    SAVE = "SAVE"

class DialogOptions(BaseModel):
    dialog_type: DialogType = DialogType.OPEN
    directory: str = ''
    allow_multiple: bool = False
    save_filename: str = ''
    file_types: List[str] = []

class DropFile(BaseModel):
    name: str
    last_modified: int
    last_modified_date: dict
    webkit_relative_path: str
    size: int
    type: str
    pywebview_full_path: str


class Sub(BaseModel):
    fullpath: str
    subtype: str
    lang: str
    priority: int
    src: str


class JobStatus(str, Enum):
    RUNNING = "RUNNING"
    STOPPED = "STOPPED"
    DONE = "DONE"

class WatchStatus(str, Enum):
    CREATED = "CREATED"
    MODIFIED = "MODIFIED"
    DELETED = "DELETED"

class PyAction(str, Enum):
    PY_JOB_STREAM = "PY_JOB_STREAM"
    PY_JOB_STATUS = "PY_JOB_STATUS"
    PY_JOB_ERROR = "PY_JOB_ERROR"
    PY_WATCH_FILE = "PY_WATCH_FILE"

class StreamType(str, Enum):
    STDOUT = "STDOUT"
    STDERR = "STDERR"

class JobDataStream(BaseModel):
    message: str = ""
    message_type: StreamType

class JobDataStatus(BaseModel):
    status: JobStatus

class JobDataError(BaseModel):
    message: str = ""

class WatchFile(BaseModel):
    status: WatchStatus
    path: str
    mtime: int

JobData = JobDataStream | JobDataStatus | JobDataError

class PyJobEvent(BaseModel):
    job_id: str = ""
    action: PyAction
    data: JobData
    timestamp: int = Field(default_factory=lambda: int(time.time()*1000))

class PyWatchEvent(BaseModel):
    action: PyAction
    data: WatchFile
