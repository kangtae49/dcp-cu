import "./SideMenu.css"
import Avatar from 'react-avatar';
import IconMinimize from "@/assets/minimize.svg?react"
import {useDynamicSlice} from "@/store/hooks.ts";
import {
  createJustLayoutSlice,
  type JustLayoutActions,
  type JustLayoutState
} from "@/app/just-layout/justLayoutSlice.ts";
import {LAYOUT_ID} from "@/app/just-layout/ui/JustLayoutView.tsx";
import {createJustLayoutThunks} from "@/app/just-layout/justLayoutThunks.ts";

function SideMenu() {
  const {
    dispatch,
    thunks: justLayoutTrunks
  } = useDynamicSlice<JustLayoutState, JustLayoutActions>(LAYOUT_ID, createJustLayoutSlice, createJustLayoutThunks)

  const toggleSideMenu = () => {
    dispatch(justLayoutTrunks.toggleSideMenu())
  }

  const openWin = (winId: string) => {
    dispatch(justLayoutTrunks.openWin({winId}))
  }

  return (
    <div className="side-menu">
      <div className="side-menu-title">
        <div className="side-menu-name">Menu</div>
        <div className="side-menu-minimize side-menu-icon" onClick={toggleSideMenu}><IconMinimize /></div>
      </div>
      <div className="side-menu-items">
        <div className="side-menu-item" onClick={() => openWin("demo")}>
          <Avatar name="D" size="30" round={true} maxInitials={2} textSizeRatio={2} textMarginRatio={0.2} title="메뉴1" />
          <div className="side-menu-name">Demo</div>
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