import {createSlice} from "@reduxjs/toolkit";

export interface ConfigTable {
  key: string,
  header: string [],
  data: Record<string, string> []
}

export interface ConfigsState {
  configs: Record<string, ConfigTable>
}

const initialState: ConfigsState = {
  configs: {} as Record<string, ConfigTable>,
}

export interface ConfigsPayloadSetConfig {
  key: string,
  val: ConfigTable
}
export interface ConfigsPayloadUpdateConfigs {
  configs: Record<string, ConfigTable>,
}


export const createConfigsSlice = (id: string) =>
  createSlice({
    name: id,
    initialState,
    reducers: {
      setConfig: (state, { payload }: {payload: ConfigsPayloadSetConfig}) => {
        state.configs[payload.key] = payload.val
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
