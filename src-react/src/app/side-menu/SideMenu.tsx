import "./SideMenu.css"
import Jdenticon from "react-jdenticon";
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
          <div className="side-menu-icon">
            <Jdenticon size="25" value="demo" />
          </div>
          <div className="side-menu-name">Demo</div>
        </div>
        <div className="side-menu-item"  onClick={() => openWin("demo-grid")}>
          <div className="side-menu-icon">
            <Jdenticon size="25" value="demo-grid" />
          </div>
          <div className="side-menu-name">Demo Grid</div>
        </div>
        <div className="side-menu-item"  onClick={() => openWin("demo-line-chart")}>
          <div className="side-menu-icon">
            <Jdenticon size="25" value="demo-line-chart" />
          </div>
          <div className="side-menu-name">Demo Line Chart</div>
        </div>
        <div className="side-menu-item">
          <div className="side-menu-icon">
            <Jdenticon size="25" value="메뉴3" />
          </div>
          <div className="side-menu-name">메뉴3</div>
        </div>
      </div>
    </div>
  )
}

export default SideMenu