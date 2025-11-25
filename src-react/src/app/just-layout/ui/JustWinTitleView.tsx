import {type DropTargetMonitor, useDrop} from "react-dnd";
import classNames from 'classnames';
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faEllipsisVertical} from "@fortawesome/free-solid-svg-icons"

import {
  createJustLayoutSlice,
  type JustBranch,
  type JustLayoutActions,
  type JustLayoutState,
  type JustStack,
  type WinInfo
} from "@/app/just-layout/justLayoutSlice.ts";
import JustDraggableTitle, {type DragItem} from "@/app/just-layout/ui/JustDraggableTitle.tsx";
import {useAppDispatch, useDynamicSlice} from "@/store/hooks.ts";
import {LAYOUT_ID} from "@/app/just-layout/ui/JustLayoutView.tsx";
import {useRef} from "react";


interface Prop {
  justBranch: JustBranch
  justStack: JustStack
  viewMap: Record<string, WinInfo>
}

function JustWinTitleView({justBranch, justStack, viewMap}: Prop) {
  const ref = useRef<HTMLDivElement>(null)
  const {
    // state: justLayoutState,
    actions: justLayoutActions
  } = useDynamicSlice<JustLayoutState, JustLayoutActions>(LAYOUT_ID, createJustLayoutSlice)
  const dispatch = useAppDispatch();


  const onDrop = (itemType: any, item: DragItem) => {
    console.log("onDrop(JustWinTitle)", itemType, item)
    dispatch(
      justLayoutActions.moveWin({
        branch: justBranch,
        winId: item.winId,
        direction: item.direction,
        pos: 'stack',
        index: item.index
      })
    )
  }

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ['DRAG-SOURCE-JUST-TITLE'],
      collect: (monitor: DropTargetMonitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
      drop(_item: DragItem, monitor) {
        // console.log("drop item", item, monitor.getItem())
        onDrop(monitor.getItemType(), monitor.getItem())
        return undefined
      },
    }),
  )

  drop(ref)
  return (
    <div
      className={classNames("just-win-title")}
    >
      <div className={classNames("just-title-list", {"is-over": isOver})} ref={ref}>
        {justStack.tabs.map(winId =>
          <JustDraggableTitle
            key={[...justBranch, winId].join(",")}
            winId={winId}
            justBranch={justBranch}
            justStack={justStack}
            winInfo={viewMap[winId]}
          />
        )}
      </div>
      <div className="just-title-menu">
        <Icon icon={faEllipsisVertical} />
      </div>
    </div>
  )
}

export default JustWinTitleView
