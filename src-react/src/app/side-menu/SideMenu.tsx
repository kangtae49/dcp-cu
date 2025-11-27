import "./SideMenu.css"
import Avatar from 'react-avatar';
import IconMinimize from "@/assets/minimize.svg?react"
import {hasWinId} from "@/app/just-layout/ui/layoutUtil.ts";
import {useDynamicSlice} from "@/store/hooks.ts";
import {
  createJustLayoutSlice,
  type JustLayoutActions,
  type JustLayoutState
} from "@/app/just-layout/justLayoutSlice.ts";
import {LAYOUT_ID} from "@/app/just-layout/ui/JustLayoutView.tsx";

function SideMenu() {
  const {
    state: justLayoutState,
    actions: justLayoutActions,
    dispatch
  } = useDynamicSlice<JustLayoutState, JustLayoutActions>(LAYOUT_ID, createJustLayoutSlice)

  const toggleSideMenu = () => {
    if (hasWinId(justLayoutState?.layout ?? null, "side-bar")) {
      dispatch(justLayoutActions.removeWin({
        winId: "side-bar"
      }))
    } else {
      dispatch(justLayoutActions.insertWin({
        branch: [], direction: "row", index: -1, pos: "first", winId: "side-bar", splitPercentage: 25,
      }))
    }
  }

  return (
    <div className="side-menu">
      <div className="side-menu-title">
        <div className="side-menu-name">Menu</div>
        <div className="side-menu-minimize side-menu-icon" onClick={toggleSideMenu}><IconMinimize /></div>
      </div>
      <div className="side-menu-items">
        <div className="side-menu-item">
          <Avatar name="ㅁ 1" size="30" round={true} maxInitials={2} textSizeRatio={2} textMarginRatio={0.2} title="메뉴1" />
          <div className="side-menu-name">메뉴1</div>
        </div>
        <div className="side-menu-item">
          <Avatar name="ㅁ 2" size="30" round={true} maxInitials={2} textSizeRatio={2} textMarginRatio={0.2} title="메뉴2" />
          <div className="side-menu-name">메뉴2</div>
        </div>
        <div className="side-menu-item">
          <Avatar name="ㅁ 3" size="30" round={true} maxInitials={2} textSizeRatio={2} textMarginRatio={0.2} title="메뉴3" />
          <div className="side-menu-name">메뉴3</div>
        </div>
      </div>
    </div>
  )
}

export default SideMenu