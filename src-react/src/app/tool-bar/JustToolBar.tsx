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
    </div>
  )
}

export default JustToolBar
