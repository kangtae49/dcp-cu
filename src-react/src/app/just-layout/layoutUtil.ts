import type {
  JustBranch, JustDirection,
  JustNode, JustPayloadInsert,
  JustPos,
  JustStack,
} from "@/app/just-layout/justLayoutSlice.ts";
import update from "immutability-helper"
import clamp from "lodash/clamp";


export function insertWinId(layout: JustNode | null, payload: JustPayloadInsert): JustNode | null {
  if (layout == null) {
    // stack
    return {
      type: "stack",
      tabs: [
        payload.winId,
      ],
      active: payload.winId,
    } as JustStack
  }
  const targetNode = getNodeByBranch(layout, payload.branch)
  const targetType = targetNode.type
  if (payload.pos === 'stack' && targetType === 'stack') {
    const targetTabs = (targetNode as JustStack).tabs

    const newIndex = payload.index >= 0 ? clamp(payload.index, 0, targetTabs.length) : targetTabs.length;
    return updateNodeOfBranch(layout, payload.branch, {
      $set: {
        type: "stack",
        tabs: [
          ...targetTabs.slice(0, newIndex),
          payload.winId,
          ...targetTabs.slice(newIndex),
        ],
        active: payload.winId,
      }
    })
  } else if (payload.pos === 'second') {
    return updateNodeOfBranch(layout, payload.branch, {
      $set: {
        type: "split",
        direction: payload.direction,
        first: targetNode,
        second: {
          type: "stack",
          tabs: [payload.winId],
          active: payload.winId,
        },
        splitPercentage: payload.splitPercentage ?? 50,
      }
    })
  } else if (payload.pos === 'first') {
    return updateNodeOfBranch(layout, payload.branch, {
      $set: {
        type: "split",
        direction: payload.direction,
        first: {
          type: "stack",
          tabs: [payload.winId],
          active: payload.winId,
        },
        second: targetNode,
        splitPercentage: payload.splitPercentage ?? 50,
      }
    })
  }
  console.log("unknown error pos: ", payload.pos, ", targetType: ", targetType)
  return null

}

export function removeWinId(layout: JustNode | null, winId: string): JustNode | null {
  if (layout == null) return null;
  const justStack = getNodeByWinId(layout, winId) as unknown as JustStack | null
  if (justStack == null) return layout;
  const newTabs = justStack.tabs.filter((tab: string) => tab !== winId)
  const active = (newTabs.length > 0 && justStack.active !== null)
    ? newTabs[clamp(justStack.tabs.indexOf(justStack.active), 0, newTabs.length-1)]
    : null
  return updateNodeOfWinId(layout, winId, {
    $set: {
      ...justStack,
      tabs: newTabs,
      active: active,
    }
  })
}

export function removeAllTabs(layout: JustNode | null, branch: JustBranch): JustNode | null {
  if (layout == null) return null;
  const justStack = getNodeByBranch(layout, branch);
  if (justStack == null) return layout;
  if (justStack.type !== 'stack') return layout;
  return updateNodeOfBranch(layout, branch, {
    $set: {
      ...justStack,
      tabs: [],
      active: null,
    }
  })
}


export function activeWinId(layout: JustNode | null, winId: string): JustNode | null {
  if (layout == null) return null;
  const justStack = getNodeByWinId(layout, winId) as unknown as JustStack | null
  if (justStack == null) return layout;
  return updateNodeOfWinId(layout, winId, {
    $set: {
      ...justStack,
      active: winId,
    }
  })
}

export function getActiveWinIds(layout: JustNode | null): string[] {
  const findFn = (layout: JustNode | null, activeWinIds: string []): string [] => {
    if( layout === null) return activeWinIds
    if (layout.type === 'stack') {
      if (layout.active !== null) {
        return [...activeWinIds, layout.active]
      } else {
        return activeWinIds
      }
    } else {
      const firstActiveWinIds = findFn(layout.first, activeWinIds)
      return findFn(layout.second, firstActiveWinIds)
    }
  }

  return findFn(layout, [])
}

export function removeEmpty(layout: JustNode | null): JustNode | null {
  if (layout == null) return layout;
  const branch = findEmptyBranch(layout)
  if (branch === null) return layout
  if (branch.length === 0) return null
  const lastSplitType = branch[branch.length - 1]
  const parentBranch = branch.slice(0, -1)
  const otherSplitType = lastSplitType === 'first' ? 'second' : 'first'
  const otherNode = getNodeByBranch(layout, [...parentBranch, otherSplitType])
  return updateNodeOfBranch(layout, parentBranch, {
    $set: otherNode,
  })
}


export function findEmptyBranch(layout: JustNode | null): JustBranch | null {

  const findFn = (layout: JustNode | null, branch: JustBranch): JustBranch | null => {
    if( layout === null) return null
    if (layout.type === 'stack') {
      if (layout.tabs.length === 0) {
        return branch
      } else {
        return null
      }
    } else {
      const nodeFirst = findFn(layout.first, [...branch, 'first'])
      if (nodeFirst != null) {
        return nodeFirst
      }
      const nodeSecond = findFn(layout.second, [...branch, 'second'])
      if (nodeSecond != null) {
        return nodeSecond
      }
      return null
    }
  }

  return findFn(layout, [])
}




export function moveWinId(layout: JustNode | null, winId: string, branch: JustBranch, pos: JustPos, direction: JustDirection, index: number): JustNode | null {
  const newLayout = removeWinId(layout, winId)
  return insertWinId(newLayout, {
    winId,
    branch,
    pos,
    direction,
    index,
    splitPercentage: 50
  })

}

export function updateSplitPercentage(layout: JustNode | null, branch: JustBranch, splitPercentage: number) {
  return updateNodeOfBranch(layout, branch, {
    $merge: {
      splitPercentage: splitPercentage,
    }
  })
}


function getBranch(layout: JustNode | null, winId: string, branch: JustBranch): JustBranch | null {
  if( layout === null) return null
  if (layout.type === 'stack') {
    if (layout.tabs.includes(winId)) {
      return branch
    } else {
      return null
    }
  } else {
    const branchFirst = getBranch(layout.first, winId, [...branch, 'first'])
    if (branchFirst != null) {
      return branchFirst
    }
    const branchSecond = getBranch(layout.second, winId, [...branch, 'second'])
    if (branchSecond != null) {
      return branchSecond
    }
    return null
  }
}

export function getBranchByWinId(layout: JustNode | null, winId: string): JustBranch | null {
  return getBranch(layout, winId, [])
}

export function getNodeByWinId(layout: JustNode | null, winId: string): JustNode | null {
  if( layout === null) return null
  if (layout.type === 'stack') {
    if (layout.tabs.includes(winId)) {
      return layout
    } else {
      return null
    }
  } else {
    const nodeFirst = getNodeByWinId(layout.first, winId)
    if (nodeFirst != null) {
      return nodeFirst
    }
    const nodeSecond = getNodeByWinId(layout.second, winId)
    if (nodeSecond != null) {
      return nodeSecond
    }
    return null
  }
}

function getNodeByBranch<T extends JustNode>(obj: JustNode, path: JustBranch): T {
  return path.reduce((acc: any, key) => (acc == null ? undefined : acc[key]), obj)
}

function makePatch(path: JustBranch, value:any): any {
  return path.reduceRight((acc, key) => ({ [key]: acc }), value)
}

function updateNodeOfBranch(layout: JustNode | null, branch: JustBranch, value: any): JustNode | null {
  if (layout == null) return null;
  return update(layout, makePatch(branch, value))
}

function updateNodeOfWinId(layout: JustNode | null, winId: string, value: any): JustNode | null {
  if (layout == null) return null;
  const branch = getBranchByWinId(layout, winId)
  if (branch == null) return layout;
  const patch = makePatch(branch, value)
  return update(layout, patch)
}

export function hasWinId(layout: JustNode | null, winId: string)  {
  return getNodeByWinId(layout, winId) != null
}
