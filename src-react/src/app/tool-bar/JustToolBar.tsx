import './JustToolBar.css'
import IconLogo from "../../assets/dcp-cu.svg?react"
import {useDynamicSlice} from "@/store/hooks.ts";
import {
  createJustLayoutSlice,
  type JustLayoutActions,
  type JustLayoutState
} from "@/app/just-layout/justLayoutSlice.ts";
import {LAYOUT_ID} from "@/app/just-layout/ui/JustLayoutView.tsx";
import {hasWinId} from "@/app/just-layout/layoutUtil.ts";
import classNames from "classnames";
import {createJustLayoutThunks} from "@/app/just-layout/justLayoutThunks.ts";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faGear} from "@fortawesome/free-solid-svg-icons"
import {Menu, MenuItem} from "@szhsin/react-menu";
import Jdenticon from "react-jdenticon";

function JustToolBar() {
  const {
    state: justLayoutState,
    // actions: justLayoutActions,
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
    <div className="just-tool-bar">
      <div
        className={classNames("just-app-icon", {"on": hasWinId(justLayoutState?.layout ?? null, "side-menu")})}
        onClick={toggleSideMenu}
      >
        <IconLogo />
      </div>
      <div className="just-tool-center">

      </div>
      {/*<div*/}
      {/*  className={classNames("just-app-icon")}*/}
      {/*>*/}
      {/*  <Icon icon={faGear} />*/}
      {/*</div>*/}

      <div className="just-tool-menus">

        <Menu menuButton={
          <div className="just-tool-menu">
            <Icon icon={faGear} />
          </div>
        }>
          <MenuItem className="just-menu-item" onClick={() => openWin("setting-configs")}>
            <div className="just-icon">
              <Jdenticon size="25" value="setting-configs" />
            </div>
            <div className="just-title">
              설정
            </div>
            <div className="just-icon" />
          </MenuItem>
        </Menu>
      </div>

    </div>
  )
}

export default JustToolBar
