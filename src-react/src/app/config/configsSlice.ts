import {createSlice} from "@reduxjs/toolkit";

export interface ConfigsState {
  configs: Record<string, Record<string, string> []>
}

const initialState: ConfigsState = {
  configs: {} as Record<string, Record<string, string> []>,
}

export interface ConfigsPayloadSetConfig {
  key: string,
  val: Record<string, string> []
}
export interface ConfigsPayloadUpdateConfigs {
  configs: Record<string, Record<string, string> []>,
}


export const createConfigsSlice = (id: string) =>
  createSlice({
    name: id,
    initialState,
    reducers: {
      setConfig: (state, { payload }: {payload: ConfigsPayloadSetConfig}) => {
        state.configs[`${id}_${payload.key}`] = payload.val
      },
      updateConfigs: (state, { payload }: {payload: ConfigsPayloadUpdateConfigs}) => {
        state.configs = {
          ...state.configs,
          ...payload.configs,
        }
      },
    }
  })

export type ConfigsSlice = ReturnType<typeof createConfigsSlice>;

export type ConfigsActions = ConfigsSlice["actions"];
