import './App.css'
import JustLayoutView from "@/app/just-layout/ui/JustLayoutView.tsx";
import AboutView from "@/app/about/AboutView.tsx";
import type {JustNode, WinInfo} from "@/app/just-layout/justLayoutSlice.ts";
// import VideoView from "@/app/video/ui/VideoView.tsx";

import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faCircleQuestion} from "@fortawesome/free-solid-svg-icons"
import TopMenuBar from "@/app/top-menu-bar/TopMenuBar.tsx";

const viewMap: Record<string, WinInfo> = {
  "about": {
    title: "About",
    icon: <Icon icon={faCircleQuestion} />,
    view: <AboutView/>
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
    tabs: ['about'],
    active: 'about'
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
      <TopMenuBar />
      <JustLayoutView viewMap={viewMap} initialValue={initialValue} />
      {/*<VideoView />*/}
    </div>
  )
}

export default App
