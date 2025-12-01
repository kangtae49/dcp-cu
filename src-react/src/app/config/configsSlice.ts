import {createSlice} from "@reduxjs/toolkit";


const initialState = {
  configs: {} as Record<string, any>,
}

export interface ConfigsPayloadSetConfig {
  key: string,
  val: any
}
export interface ConfigsPayloadUpdateConfigs {
  configs: Record<string, any>,
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
