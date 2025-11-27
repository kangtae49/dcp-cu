import './JustToolBar.css'
import IconLogo from "../../assets/dcp-cu.svg?react"
import {useDynamicSlice} from "@/store/hooks.ts";
import {
  createJustLayoutSlice,
  type JustLayoutActions,
  type JustLayoutState
} from "@/app/just-layout/justLayoutSlice.ts";
import {LAYOUT_ID} from "@/app/just-layout/ui/JustLayoutView.tsx";
import {hasWinId} from "@/app/just-layout/ui/layoutUtil.ts";
import classNames from "classnames";

function JustToolBar() {
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
    <div className="just-tool-bar">
      <div
        className={classNames("just-app-icon", {"on": hasWinId(justLayoutState?.layout ?? null, "side-bar")})}
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
