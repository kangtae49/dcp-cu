import './App.css'
import JustLayoutView from "@/app/just-layout/ui/JustLayoutView.tsx";
import AboutView from "@/app/about/AboutView.tsx";
import type {GetWinInfoFn, JustNode, WinInfo} from "@/app/just-layout/justLayoutSlice.ts";
// import VideoView from "@/app/video/ui/VideoView.tsx";

import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faCircleQuestion} from "@fortawesome/free-solid-svg-icons"
// import TopMenuBar from "@/app/top-menu-bar/TopMenuBar.tsx";
import JustToolBar from "@/app/tool-bar/JustToolBar.tsx";
import SideMenu from "@/app/side-menu/ui/SideMenu.tsx";
import DemoView from "@/app/demo/DemoView.tsx";
import Jdenticon from "react-jdenticon";
import PyJobListener from "@/app/listeners/PyJobListener.tsx";
import PyWatchListener from "@/app/listeners/PyWatchListener.tsx";
import {useDynamicSlice} from "@/store/hooks.ts";
import {
  CONFIG_ID,
  CONFIG_KEYS,
  type ConfigsActions,
  type ConfigsSlice,
  createConfigsSlice
} from "@/app/config/configsSlice.ts";
import {useEffect, useState} from "react";
import DemoGridView from "@/app/demo/DemoGridView.tsx";
import ConfigView from "@/app/config/ui/ConfigView.tsx";
import DemoLineChartView from "@/app/demo/DemoLineChartView.tsx";
import {stableStringify} from "@/utils/json-util.ts";
import Page01View from "@/app/page/Page01View.tsx";

export type ViewId = "side-menu"
  | "page01"
  | "demo" | "demo-grid" | "demo-line-chart" | "about" | "setting-config"
export interface WinObjId {
  viewId: ViewId
  params?: Record<string, any>
}

const viewMap = {
  "side-menu": (winId: string) => ({
    title: "Menu",
    icon: <Icon icon={faCircleQuestion} />,
    view: <SideMenu key={winId} />,
    canDrag: false,
    canDrop: false,
    showTitle: false,
    // showClose: false,
  }),
  "page01": (winId: string) => {
    const winObjId = fromWinId(winId)
    return ({
      title: "자산통계정보",
      icon: <Jdenticon size="30" value={winObjId.viewId} />,
      view: <Page01View key={winId} winObjId={winObjId} />
    })
  },
  "demo": (winId: string) => ({
    title: "Demo",
    icon: <Jdenticon size="30" value="demo" />,
    view: <DemoView key={winId} />
  }),
  "demo-grid": (winId: string) => ({
    title: "Demo Grid",
    icon: <Jdenticon size="30" value="demo-grid" />,
    view: <DemoGridView key={winId} />
  }),
  "demo-line-chart": (winId: string) => ({
    title: "Demo Line Chart",
    icon: <Jdenticon size="30" value="demo-line-chart" />,
    view: <DemoLineChartView key={winId} />
  }),
  "about": (winId: string) => ({
    title: "About",
    icon: <Jdenticon size="30" value="about" />,
    view: <AboutView key={winId} />
  }),

  // "setting-config": (winId: string) => {
  //   const winObjId = fromWinId(winId);
  //   return ({
  //     title: winObjId.params?.['title'],
  //     icon: <Jdenticon size="30" value="setting-config" />,
  //     view: <ConfigView winObjId={winObjId} />
  //   })
  // },
} as Record<ViewId, GetWinInfoFn>;

CONFIG_KEYS.forEach((winObjId: WinObjId) => {

  viewMap[winObjId.viewId] = (_winId) => ({
    title: winObjId.params?.['title'],
    icon: <Jdenticon size="30" value={"setting-config"} />,
    view: <ConfigView winObjId={winObjId} />
  });
})


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
    tabs: [fromWinObjId({viewId: 'side-menu'})],
    active: fromWinObjId({viewId: 'side-menu'})
  },
  second: {
    type: 'split-percentage',
    direction: 'column',
    size: 50,
    show: true,
    first: {
      type: 'stack',
      tabs: [fromWinObjId({viewId: 'demo-grid'})],
      active: fromWinObjId({viewId: 'demo-grid'})
    },
    second: {
      type: 'stack',
      tabs: [fromWinObjId({viewId: 'about'})],
      active: fromWinObjId({viewId: 'about'})
    }
  },
}

export function getWinInfo(winId: string): WinInfo {
  const viewId = JSON.parse(winId).viewId as ViewId;
  return viewMap[viewId](winId)
}


export function fromWinObjId(winObjId: WinObjId): string {
  const winId = stableStringify(winObjId)
  if (winId == undefined) throw new Error("buildWinId: stringify error")
  return winId
}

export function fromWinId(winId: string): WinObjId {
  return JSON.parse(winId) as WinObjId
}

function App() {
  const [isPywebviewReady, setIsPywebviewReady] = useState(false);
  const {
    actions: configsActions, dispatch
  } = useDynamicSlice<ConfigsSlice, ConfigsActions>(CONFIG_ID, createConfigsSlice)

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

    CONFIG_KEYS.forEach((winObjId: WinObjId) => {
      const file: string = winObjId.params?.['file'];
      window.pywebview.api.read_config(file).then(res => {
        dispatch(configsActions.updateConfigs({ configs: {[res.key]: res}}))
      })

      // viewMap[winObjId.viewId] = (_winId) => ({
      //   title: winObjId.params?.['title'],
      //   icon: <Jdenticon size="30" value={"setting-config"} />,
      //   view: <ConfigView winObjId={winObjId} />
      // });
    })



    // window.pywebview.api.read_config("설정1.xlsx").then(res => {
    //   dispatch(configsActions.updateConfigs({ configs: {[res.key]: res}}))
    // })
    // window.pywebview.api.read_config("설정2.xlsx").then(res => {
    //   dispatch(configsActions.updateConfigs({ configs: {[res.key]: res}}))
    // })
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
