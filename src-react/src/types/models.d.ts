/* tslint:disable */
/* eslint-disable */
/**
/* This file was automatically generated from pydantic models by running pydantic2ts.
/* Do not modify it by hand - just update the pydantic models and then re-run the script
*/

export type DialogType = "OPEN" | "FOLDER" | "SAVE";
export type PyAction = "PY_SHELL_STDOUT" | "PY_SHELL_STATUS";
export type StreamType = "STDOUT" | "STDERR";

export interface DialogOptions {
  dialog_type?: DialogType;
  directory?: string;
  allow_multiple?: boolean;
  save_filename?: string;
  file_types?: string[];
}
export interface DropFile {
  name: string;
  last_modified: number;
  last_modified_date: {
    [k: string]: unknown;
  };
  webkit_relative_path: string;
  size: number;
  type: string;
  pywebview_full_path: string;
}
export interface PyEvent {
  action: PyAction;
  job_id?: string;
  message?: string;
  message_type: StreamType;
}
export interface Sub {
  fullpath: string;
  subtype: string;
  lang: string;
  priority: number;
  src: string;
}
