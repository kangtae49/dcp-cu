import {
  createJustLayoutSlice,
  type JustBranch,
  type JustLayoutActions,
  type JustLayoutState,
  type JustNode, type WinInfo
} from "@/app/just-layout/justLayoutSlice.ts";
import JustWinView from "@/app/just-layout/ui/JustWinView.tsx";
import classNames from "classnames";
import * as React from "react";
import {useAppDispatch, useDynamicSlice} from "@/store/hooks.ts";
import JustSplit from "@/app/just-layout/ui/JustSplit.tsx";
import {useRef} from "react";

interface Props {
  justBranch: JustBranch
  node: JustNode | null
  viewMap: Record<string, WinInfo>
}

export const JustNodeView: React.FC<Props> = ({ node, justBranch, viewMap }) => {
  const layoutId = "just-layout"
  const refNode = useRef<HTMLDivElement>(null);

  const {
    // state: justLayoutState,
    actions: justLayoutActions
  } = useDynamicSlice<JustLayoutState, JustLayoutActions>(layoutId, createJustLayoutSlice)
  const dispatch = useAppDispatch();

  const onResize= (splitPercentage: number) => {
    dispatch(justLayoutActions.updateResize({ branch: justBranch, splitPercentage }))
  }
  return (
    <div className="just-node" ref={refNode}>
      {node?.type === 'stack' && (
        <JustWinView justStack={node} justBranch={justBranch} viewMap={viewMap} />
      )}
      {node?.type === 'split' && (
        <div key={`JustNode-${justBranch.join(",")}`}
             className={classNames(
               {
                 "just-column": node.direction === 'column',
                 "just-row": node.direction === 'row'
               }
             )}>
          <div
            className="just-first"
            style={{
              flexBasis: `calc(${node.splitPercentage}% - 2px)`,
              flexGrow: 0,
              flexShrink: 0,
              minWidth: 0,
            }}
          >
            <JustNodeView node={node.first} justBranch={[...justBranch, "first"]} viewMap={viewMap} />
          </div>

          <JustSplit
            direction={node.direction}
            justBranch={justBranch}
            containerRef={refNode}
            onChange={onResize}
            onRelease={onResize}
          />

          <div className="just-second">
            <JustNodeView node={node.second} justBranch={[...justBranch, "second"]} viewMap={viewMap} />
          </div>
        </div>
      )}

    </div>
  )

};