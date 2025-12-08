import './JustToolBar.css'
import IconLogo from "../../assets/dcp-cu.svg?react"
import {useDynamicSlice} from "@/store/hooks.ts";
import {
  createJustLayoutSlice,
  type JustLayoutActions,
  type JustLayoutState
} from "@/app/just-layout/justLayoutSlice.ts";
import {LAYOUT_ID} from "@/app/just-layout/ui/JustLayoutView.tsx";
import classNames from "classnames";
import {createJustLayoutThunks} from "@/app/just-layout/justLayoutThunks.ts";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faGear} from "@fortawesome/free-solid-svg-icons"
import {Menu, MenuItem} from "@szhsin/react-menu";
import Jdenticon from "react-jdenticon";
import {useCallback, useEffect, useState} from "react";
import {INIT_SIDE_MENU_SIZE, SIDE_MENU_ID_LIST} from "@/app/side-menu/SideMenu.tsx";
import {buildWinId} from "@/App.tsx";


function JustToolBar() {
  const {
    state: justLayoutState,
    // actions: justLayoutActions,
    dispatch,
    thunks: justLayoutTrunks
  } = useDynamicSlice<JustLayoutState, JustLayoutActions>(LAYOUT_ID, createJustLayoutSlice, createJustLayoutThunks)
  const [size, setSize] = useState(INIT_SIDE_MENU_SIZE);

  const toggleSideMenu = useCallback(() => {
    dispatch(justLayoutTrunks.toggleSideMenu({size: INIT_SIDE_MENU_SIZE}))
  }, [size])

  const openWin = (winId: string) => {
    dispatch(justLayoutTrunks.openWin({winId}))
  }

  useEffect(() => {
    if (!justLayoutState?.layout) {
      return;
    }
    if (justLayoutState.layout.type === "split-percentage" || justLayoutState.layout.type === "split-pixels") {
      console.log("set size", justLayoutState.layout.size)
      setSize(justLayoutState.layout.size)
    }
  }, [justLayoutState?.layout]);


  return (
    <div className="just-tool-bar">
      <div
        className={classNames("just-app-icon", {"on": size > 0})}
        onClick={toggleSideMenu}
      >
        <IconLogo />
      </div>
      <div className="just-tool-center">
        {
          size <= 0 &&
          SIDE_MENU_ID_LIST.map(item =>
            <div key={item.menuId} className="just-tool-center-menu" onClick={() => openWin(item.menuId)} title={item.menuName}>
              <div className="just-icon">
                <Jdenticon size="25" value={item.menuId} />
              </div>
            </div>
          )
        }
      </div>

      <div className="just-tool-menus">

        <Menu menuButton={
          <div className="just-tool-menu">
            <Icon icon={faGear} />
          </div>
        }>
          <MenuItem className="just-menu-item" onClick={() => openWin(buildWinId({viewId: "setting-config1"}))}>
            <div className="just-icon">
              <Jdenticon size="25" value="setting-config1" />
            </div>
            <div className="just-title">
              설정1
            </div>
            <div className="just-icon" />
          </MenuItem>
          <MenuItem className="just-menu-item" onClick={() => openWin(buildWinId({viewId: "setting-config2"}))}>
            <div className="just-icon">
              <Jdenticon size="25" value="setting-config2" />
            </div>
            <div className="just-title">
              설정2
            </div>
            <div className="just-icon" />
          </MenuItem>
        </Menu>
      </div>

    </div>
  )
}

export default JustToolBar
