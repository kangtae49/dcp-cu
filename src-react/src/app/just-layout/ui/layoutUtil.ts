import type {
  JustBranch, JustDirection,
  JustNode,
  JustPos,
  JustStack,
} from "@/app/just-layout/justLayoutSlice.ts";
import update from "immutability-helper"
import clamp from "lodash/clamp";


export function insertWinId(layout: JustNode | null, winId: string, branch: JustBranch, pos: JustPos, direction: JustDirection, index: number): JustNode | null {
  if (layout == null) {
    // stack
    return {
      type: "stack",
      tabs: [
        winId,
      ],
      active: winId,
    } as JustStack
  }
  const targetNode = getNodeByBranch(layout, branch)
  const targetType = targetNode.type
  if (pos === 'stack' && targetType === 'stack') {
    const targetTabs = (targetNode as JustStack).tabs

    const newIndex = index >= 0 ? clamp(index, 0, targetTabs.length) : targetTabs.length;
    return updateNodeOfBranch(layout, branch, {
      $set: {
        type: "stack",
        tabs: [
          ...targetTabs.slice(0, newIndex),
          winId,
          ...targetTabs.slice(newIndex),
        ],
        active: winId,
      }
    })
  } else if (pos === 'second') {
    return updateNodeOfBranch(layout, branch, {
      $set: {
        type: "split",
        direction: direction,
        first: targetNode,
        second: {
          type: "stack",
          tabs: [winId],
          active: winId,
        },
        splitPercentage: 50,
      }
    })
  } else if (pos === 'first') {
    return updateNodeOfBranch(layout, branch, {
      $set: {
        type: "split",
        direction: direction,
        first: {
          type: "stack",
          tabs: [winId],
          active: winId,
        },
        second: targetNode,
        splitPercentage: 50,
      }
    })
  }
  console.log("unknown error pos: ", pos, ", targetType: ", targetType)
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


export function removeEmpty(layout: JustNode | null): JustNode | null {
  if (layout == null) return layout;
  const branch = findEmptyBranch(layout)
  if (branch === null || branch.length === 0) return layout;
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
  return removeEmpty(insertWinId(newLayout, winId, branch, pos, direction, index))

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

function getBranchByWinId(layout: JustNode | null, winId: string): JustBranch | null {
  return getBranch(layout, winId, [])
}

function getNodeByWinId(layout: JustNode | null, winId: string): JustNode | null {
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
