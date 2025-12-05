import {createSlice, current} from "@reduxjs/toolkit";
import {type JSX} from "react";
import {
  activeWinId,
  insertWinId,
  moveWinId, removeAllTabs, removeEmpty,
  removeWinId,
  updateSplitPercentage
} from "@/app/just-layout/layoutUtil.ts";

export type JustDirection = 'row' | 'column';
export type JustSplitDirection = 'first' | 'second';
export type JustSplitType = 'split-percentage' | 'split-pixels';

export type JustNode = JustStack | JustSplit

export type JustBranch = JustSplitDirection []

export interface JustStack {
  type: 'stack'
  tabs: string[]
  active: string | null
}

export type JustSplit = JustSplitPercentage | JustSplitPixels
// export interface JustSplit {
//   type: 'split'
//   direction: JustDirection
//   first: JustNode
//   second: JustNode
//   splitPercentage: number
// }

export interface JustSplitBase {
  type: JustSplitType
  direction: JustDirection
  first: JustNode
  second: JustNode
}

export interface JustSplitPercentage extends JustSplitBase {
  type: 'split-percentage'
  splitPercentage: number
}

export interface JustSplitPixels extends JustSplitBase {
  type: 'split-pixels'
  splitPixels: number
  primary: JustSplitDirection
}

export type JustPos = JustSplitDirection | 'stack'

export interface JustPayloadInsert {
  branch: JustBranch
  winId: string
  direction: JustDirection
  pos: JustPos
  index: number
  splitPercentage?: number
}

export interface JustPayloadRemove {
  winId: string
}
export interface JustPayloadAllTabs {
  branch: JustBranch
}

export interface JustPayloadActive {
  winId: string
}

export interface JustPayloadHasWin {
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

export interface JustLayoutState {
  layout: JustNode | null
}


const initialState: JustLayoutState = {
  layout: null,
}

export interface WinInfo {
  title: string
  icon: JSX.Element
  view: JSX.Element
  canDrag?: boolean
  canDrop?: boolean
  showClose?: boolean
  showTitle?: boolean
}

export const createJustLayoutSlice = (id: string) =>
  createSlice({
    name: id,
    initialState,
    reducers: {
      setLayout: (state, { payload }: {payload: JustNode}) => { state.layout = payload },
      insertWin: (state, { payload }: {payload: JustPayloadInsert}) => {
        state.layout = insertWinId(
          state.layout == null ? null : current(state.layout),
          payload
        )
      },
      removeWin: (state, { payload }: {payload: JustPayloadRemove}) => {
        state.layout = removeEmpty(removeWinId(
          state.layout == null ? null : current(state.layout),
          payload.winId
        ))
      },
      removeAllTabs: (state, { payload }: {payload: JustPayloadAllTabs}) => {
        state.layout = removeEmpty(removeAllTabs(
          state.layout == null ? null : current(state.layout),
          payload.branch
        ))
      },
      activeWin: (state, { payload }: {payload: JustPayloadActive}) => {
        state.layout = activeWinId(
          state.layout == null ? null : current(state.layout),
          payload.winId
        )
      },
      updateResize: (state, { payload }: {payload: JustPayloadResize}) => {
        state.layout = updateSplitPercentage(
          state.layout == null ? null : current(state.layout),
          payload.branch,
          payload.splitPercentage
        )
      },
      moveWin: (state, { payload }: {payload: JustPayloadMoveWin}) => {
        state.layout = removeEmpty(moveWinId(
          state.layout == null ? null : current(state.layout),
          payload.winId,
          payload.branch,
          payload.pos,
          payload.direction,
          payload.index
        ))
      },
    }
  })

export type JustLayoutSlice = ReturnType<typeof createJustLayoutSlice>;

export type JustLayoutActions = JustLayoutSlice["actions"];


