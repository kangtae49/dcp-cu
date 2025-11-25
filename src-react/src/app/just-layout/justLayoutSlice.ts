import {createSlice, current} from "@reduxjs/toolkit";
import {type JSX} from "react";
import {insertWinId, moveWinId, removeWinId, updateSplitPercentage} from "@/app/just-layout/ui/layoutUtil.ts";

export type JustDirection = 'row' | 'column';
export type JustSplitType = 'first' | 'second';

export type JustNode = JustStack | JustSplit

export type JustBranch = JustSplitType []

export interface JustStack {
  type: 'stack'
  tabs: string[]
  active: string | null
}

export interface JustSplit {
  type: 'split'
  direction: JustDirection
  first: JustNode
  second: JustNode
  splitPercentage: number
}

export type JustPos = JustSplitType | 'stack'

export interface JustPayloadInsert {
  branch: JustBranch
  winId: string
  direction: JustDirection
  pos: JustPos
  index: number
}

export interface JustPayloadRemove {
  winId: string
}

export interface JustPayloadResize {
  branch: JustBranch
  splitPercentage: number
}

export interface JustPayloadMoveWin {
  branch: JustBranch
  winId: string
  direction: JustDirection
  pos: JustPos
  index: number
}

// export interface JustPayloadMoveSplit {
//   sourceBranch: JustBranch
//   targetBranch: JustBranch
//   winId: string
//   direction: JustDirection
//   split: JustSplitType
// }

export interface JustLayoutState {
  layout: JustNode | null
}


const initialState: JustLayoutState = {
  layout: null
}

export interface WinInfo {
  title: string
  icon: JSX.Element
  view: JSX.Element
}

export const createJustLayoutSlice = (id: string) =>
  createSlice({
    name: id,
    initialState,
    reducers: {
      setLayout: (state, { payload }: {payload: JustNode}) => { state.layout = payload },
      insertWin: (state, { payload }: {payload: JustPayloadInsert}) => {
        state.layout = insertWinId(
          current(state.layout),
          payload.winId,
          payload.branch,
          payload.pos,
          payload.direction,
          payload.index
        )
      },
      removeWin: (state, { payload }: {payload: JustPayloadRemove}) => {
        state.layout = removeWinId(
          current(state.layout),
          payload.winId
        )
      },
      updateResize: (state, { payload }: {payload: JustPayloadResize}) => {
        state.layout = updateSplitPercentage(
          current(state.layout),
          payload.branch,
          payload.splitPercentage
        )
      },
      moveWin: (state, { payload }: {payload: JustPayloadMoveWin}) => {
        state.layout = moveWinId(
          current(state.layout),
          payload.winId,
          payload.branch,
          payload.pos,
          payload.direction,
          payload.index
        )
      },
      // moveSplit: (state, { payload }: {payload: JustPayloadMoveSplit}) => {
      //
      //   state.layout = moveSplit(current(state.layout), payload)
      // },
    }
  })

export type JustLayoutSlice = ReturnType<typeof createJustLayoutSlice>;

export type JustLayoutActions = JustLayoutSlice["actions"];


