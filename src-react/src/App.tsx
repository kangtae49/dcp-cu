import './App.css'
import JustLayoutView from "@/app/just-layout/ui/JustLayoutView.tsx";
import AboutView from "@/app/about/AboutView.tsx";
import type {JustNode, WinInfo} from "@/app/just-layout/justLayoutSlice.ts";
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
import ConfigsView from "@/app/config/ui/ConfigsView.tsx";

const viewMap: Record<string, WinInfo> = {
  "side-menu": {
    title: "Menu",
    icon: <Icon icon={faCircleQuestion} />,
    view: <SideMenu />,
    canDrag: false,
    canDrop: false,
    showTitle: false,
    // showClose: false,
  },
  "demo": {
    title: "Demo",
    icon: <Jdenticon size="30" value="demo" />,
    view: <DemoView />
  },
  "demo-grid": {
    title: "Demo Grid",
    icon: <Jdenticon size="30" value="demo-grid" />,
    view: <DemoGridView />
  },
  "about": {
    title: "About",
    icon: <Jdenticon size="30" value="about" />,
    view: <AboutView />
  },
  "setting-configs": {
    title: "설정",
    icon: <Jdenticon size="30" value="setting-configs" />,
    view: <ConfigsView />
  },
  "winId03": {
    title: "winId03",
    icon: <Jdenticon size="30" value="winId03" />,
    view: <AboutView />
  },
  "winId04": {
    title: "winId04",
    icon: <Jdenticon size="30" value="winId04" />,
    view: <AboutView />
  },
}

// dispatch(justLayoutActions.insertWin({ branch: [], winId: "winId01", direction: 'row', pos: 'first' }))
// dispatch(justLayoutActions.removeWin({ branch: [], winId: "winId01" }))
// dispatch(justLayoutActions.insertWin({ branch: [], winId: "winId01", direction: 'row', pos: 'first' }))
// dispatch(justLayoutActions.insertWin({ branch: [], winId: "winId02", direction: 'column', pos: 'second' }))
// dispatch(justLayoutActions.insertWin({ branch: [], winId: "winId03", direction: 'row', pos: 'first' }))
// dispatch(justLayoutActions.insertWin({ branch: ['second', 'second'], winId: "winId04", direction: 'row', pos: 'stack' }))

const initialValue: JustNode = {
  type: 'split',
  direction: 'row',
  splitPercentage: 50,
  first: {
    type: 'stack',
    tabs: ['side-menu'],
    active: 'side-menu'
  },
  second: {
    type: 'split',
    direction: 'column',
    splitPercentage: 50,
    first: {
      type: 'stack',
      tabs: ['demo-grid'],
      active: 'demo-grid'
    },
    second: {
      type: 'stack',
      tabs: ['winId03', 'winId04'],
      active: 'winId04'
    }
  },
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
          <JustLayoutView viewMap={viewMap} initialValue={initialValue} />
        </div>
        {/*<VideoView />*/}
      </div>
    </>
  )
}

export default App
