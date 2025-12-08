import './App.css'
import JustLayoutView from "@/app/just-layout/ui/JustLayoutView.tsx";
import AboutView from "@/app/about/AboutView.tsx";
import type {GetWinInfoFn, JustNode, WinInfo} from "@/app/just-layout/justLayoutSlice.ts";
// import VideoView from "@/app/video/ui/VideoView.tsx";

import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faCircleQuestion} from "@fortawesome/free-solid-svg-icons"
// import TopMenuBar from "@/app/top-menu-bar/TopMenuBar.tsx";
import JustToolBar from "@/app/tool-bar/JustToolBar.tsx";
import SideMenu from "@/app/side-menu/SideMenu.tsx";
import DemoView from "@/app/demo/DemoView.tsx";
import Jdenticon from "react-jdenticon";
import PyJobListener from "@/app/listeners/PyJobListener.tsx";
import PyWatchListener from "@/app/listeners/PyWatchListener.tsx";
import {useDynamicSlice} from "@/store/hooks.ts";
import {type ConfigsActions, type ConfigsSlice, createConfigsSlice} from "@/app/config/configsSlice.ts";
import {useEffect, useState} from "react";
import DemoGridView from "@/app/demo/DemoGridView.tsx";
import ConfigView from "@/app/config/ui/ConfigView.tsx";
import DemoLineChartView from "@/app/demo/DemoLineChartView.tsx";
import {stableStringify} from "@/utils/json-util.ts";

export type ViewId = "side-menu" | "demo" | "demo-grid" | "demo-line-chart" | "about" | "setting-config1" | "setting-config2"
export interface ViewObjId {
  viewId: ViewId
  params?: Record<string, any>
}

const viewMap: Record<ViewId, GetWinInfoFn> = {
  "side-menu": (_winId: string) => ({
    title: "Menu",
    icon: <Icon icon={faCircleQuestion} />,
    view: <SideMenu />,
    canDrag: false,
    canDrop: false,
    showTitle: false,
    // showClose: false,
  }),
  "demo": (_winId: string) => ({
    title: "Demo",
    icon: <Jdenticon size="30" value="demo" />,
    view: <DemoView />
  }),
  "demo-grid": (_winId: string) => ({
    title: "Demo Grid",
    icon: <Jdenticon size="30" value="demo-grid" />,
    view: <DemoGridView />
  }),
  "demo-line-chart": (_winId: string) => ({
    title: "Demo Line Chart",
    icon: <Jdenticon size="30" value="demo-line-chart" />,
    view: <DemoLineChartView />
  }),
  "about": (_winId: string) => ({
    title: "About",
    icon: <Jdenticon size="30" value="about" />,
    view: <AboutView />
  }),
  "setting-config1": (_winId: string) => ({
    title: "설정1",
    icon: <Jdenticon size="30" value="setting-config1" />,
    view: <ConfigView configKey={"설정1.xlsx"}/>
  }),
  "setting-config2": (_winId: string) => ({
    title: "설정2",
    icon: <Jdenticon size="30" value="setting-config2" />,
    view: <ConfigView configKey={"설정2.xlsx"}/>
  }),
}

// dispatch(justLayoutActions.insertWin({ branch: [], winId: "winId01", direction: 'row', pos: 'first' }))
// dispatch(justLayoutActions.removeWin({ branch: [], winId: "winId01" }))
// dispatch(justLayoutActions.insertWin({ branch: [], winId: "winId01", direction: 'row', pos: 'first' }))
// dispatch(justLayoutActions.insertWin({ branch: [], winId: "winId02", direction: 'column', pos: 'second' }))
// dispatch(justLayoutActions.insertWin({ branch: [], winId: "winId03", direction: 'row', pos: 'first' }))
// dispatch(justLayoutActions.insertWin({ branch: ['second', 'second'], winId: "winId04", direction: 'row', pos: 'stack' }))

const initialValue: JustNode = {
  type: 'split-pixels',
  direction: 'row',
  primary: 'first',
  size: 200,
  show: true,
  // minSize: 38,
  first: {
    type: 'stack',
    tabs: [buildWinId({viewId: 'side-menu'})],
    active: buildWinId({viewId: 'side-menu'})
  },
  second: {
    type: 'split-percentage',
    direction: 'column',
    size: 50,
    show: true,
    first: {
      type: 'stack',
      tabs: [buildWinId({viewId: 'demo-grid'})],
      active: buildWinId({viewId: 'demo-grid'})
    },
    second: {
      type: 'stack',
      tabs: [buildWinId({viewId: 'about'})],
      active: buildWinId({viewId: 'about'})
    }
  },
}

export function getWinInfo(winId: string): WinInfo {
  const viewId = JSON.parse(winId).viewId as ViewId;
  return viewMap[viewId](winId)
}


export function buildWinId(viewObjId: ViewObjId): string {
   const winId = stableStringify(viewObjId)
  if (winId == undefined) throw new Error("buildWinId: stringify error")
  return winId
}

function App() {
  const [isPywebviewReady, setIsPywebviewReady] = useState(false);
  const {
    actions: configsActions, dispatch
  } = useDynamicSlice<ConfigsSlice, ConfigsActions>("CONFIGS", createConfigsSlice)

  useEffect(() => {

    window.addEventListener("pywebviewready", handleReady);

    return () => {
      window.removeEventListener("pywebviewready", handleReady);
    };
  }, []);

  function handleReady() {
    console.log("pywebview is ready!");
    setIsPywebviewReady(true);
  }

  useEffect(() => {
    if(!isPywebviewReady) return;
    console.log("api", window.pywebview.api)
    window.pywebview.api.read_config("설정1.xlsx").then(res => {
      dispatch(configsActions.updateConfigs({ configs: {[res.key]: res}}))
    })
    window.pywebview.api.read_config("설정2.xlsx").then(res => {
      dispatch(configsActions.updateConfigs({ configs: {[res.key]: res}}))
    })
  }, [isPywebviewReady])



  return (
    <>
      <PyJobListener />
      <PyWatchListener />
      <div className="just-app">
        {/*<TopMenuBar />*/}
        <div className="just-container">
          <JustToolBar />
          <JustLayoutView getWinInfo={getWinInfo} initialValue={initialValue} />
        </div>
        {/*<VideoView />*/}
      </div>
    </>
  )
}

export default App
