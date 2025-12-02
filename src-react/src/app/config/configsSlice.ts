import {createSlice} from "@reduxjs/toolkit";

export interface ConfigTable {
  key: string,
  header: string [],
  data: Record<string, string> []
}

export interface ConfigsState {
  configs: Record<string, ConfigTable>
  keys: string[]
}

const initialState: ConfigsState = {
  configs: {} as Record<string, ConfigTable>,
  keys: ["설정1.xlsx", "설정2.xlsx"]
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
