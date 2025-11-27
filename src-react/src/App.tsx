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

const viewMap: Record<string, WinInfo> = {
  "about": {
    title: "About",
    icon: <Icon icon={faCircleQuestion} />,
    view: <AboutView/>
  },
  "side-bar": {
    title: "Menu",
    icon: <Icon icon={faCircleQuestion} />,
    view: <SideMenu />,
    canDrag: false,
    canDrop: false,
    showTitle: false,
    // showClose: false,
  },
  "winId02": {
    title: "About",
    icon: <Icon icon={faCircleQuestion} />,
    view: <AboutView/>
  },
  "winId03": {
    title: "About",
    icon: <Icon icon={faCircleQuestion} />,
    view: <AboutView/>
  },
  "winId04": {
    title: "About",
    icon: <Icon icon={faCircleQuestion} />,
    view: <AboutView/>
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
    tabs: ['side-bar'],
    active: 'side-bar'
  },
  second: {
    type: 'split',
    direction: 'column',
    splitPercentage: 50,
    first: {
      type: 'stack',
      tabs: ['winId02'],
      active: 'winId02'
    },
    second: {
      type: 'stack',
      tabs: ['winId03', 'winId04'],
      active: 'winId04'
    }
  },
}

function App() {

  return (
    <div className="just-app">
      {/*<TopMenuBar />*/}
      <div className="just-container">
        <JustToolBar />
        <JustLayoutView viewMap={viewMap} initialValue={initialValue} />
      </div>
      {/*<VideoView />*/}
    </div>
  )
}

export default App
