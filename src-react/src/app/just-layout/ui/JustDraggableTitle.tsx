import {useRef} from "react";
import {
  type JustBranch,
  type JustDirection,
  type JustPos,
  type JustStack,
  type WinInfo
} from "@/app/just-layout/justLayoutSlice.ts";
import {type DragSourceMonitor, useDrag, useDrop} from "react-dnd";
import type { XYCoord } from 'react-dnd';
import classnames from "classnames";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faCircleXmark} from "@fortawesome/free-solid-svg-icons"

export interface DragItem {
  justBranch: JustBranch
  winId: string
  direction: JustDirection
  pos: JustPos
  index: number
}

interface Prop {
  justBranch: JustBranch
  winId: string
  winInfo: WinInfo
  justStack: JustStack
  closeWin: (winId: string) => void
  activeWin: (winId: string) => void
}

function JustDraggableTitle(props: Prop) {
  const { winInfo, justBranch, winId, justStack, closeWin, activeWin } = props;
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'DRAG-SOURCE-JUST-TITLE',
      canDrag: winInfo.canDrag ?? true,
      item: {
        justBranch,
        winId,
        index: -1,
      } as DragItem,
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
  )

  const [, drop] = useDrop<DragItem, void, { handlerId: any | null }> ({
    accept: 'DRAG-SOURCE-JUST-TITLE',
    canDrop: () => winInfo.canDrop ?? true,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return
      }
      if (winId === item.winId) {
        return
      }
      if (!monitor.canDrop()) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const clientOffset = monitor.getClientOffset()
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2
      const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.left

      const sourceWinId = item.winId;
      const targetWinId = winId;

      const curTabs = justStack.tabs.filter(tabId => tabId !== sourceWinId)
      let targetIndex = curTabs.indexOf(targetWinId)
      if (hoverClientX > hoverMiddleX) {
        targetIndex += 1
      }
      item.pos = 'stack'
      item.index = targetIndex
    }
  })

  drag(drop(ref))


  console.log("JustDraggableTitle", winId, winInfo)
  return (
    <div
      className={classnames(
        "just-draggable-title",
        {
          "dragging": isDragging,
          "just-active": justStack.active === winId
        }
      )}
      ref={ref}
    >
      <div className="just-icon">{winInfo.icon}</div>
      <div className="just-title" onClick={() => activeWin(winId)}>{winInfo.title}({winId})</div>

      {(winInfo.showClose ?? true) && <div className="just-icon just-close" onClick={() => closeWin(winId)}>
        <Icon icon={faCircleXmark}/>
      </div>}
    </div>
  )
}

export default JustDraggableTitle
