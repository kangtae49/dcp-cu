import type {JobStatus, PyJobEvent} from "@/types/models";
import {createSlice} from "@reduxjs/toolkit";

export interface JobMonitorState {
  status: Record<string, JobStatus>,
  events: Record<string, PyJobEvent []>
}

const initialState: JobMonitorState = {
  status: {} as Record<string, JobStatus>,
  events: {} as Record<string, PyJobEvent []>
}

export interface JobMonitorSetStatus {
  jobId: string,
  status: JobStatus
}

export interface JobMonitorAddEvent {
  jobId: string,
  event: PyJobEvent
}

export const createJobMonitorSlice = (id: string) =>
  createSlice({
    name: id,
    initialState,
    reducers: {
      setStatus: (state, { payload }: {payload: JobMonitorSetStatus}) => {
        state.status[payload.jobId] = payload.status
      },
      addEvent: (state, { payload }: {payload: JobMonitorAddEvent}) => {
        state.events[payload.jobId] = [...(state.events[payload.jobId] ?? []), payload.event]
      },
    }
  })

export type JobMonitorSlice = ReturnType<typeof createJobMonitorSlice>;
export type JobMonitorActions = JobMonitorSlice["actions"];

