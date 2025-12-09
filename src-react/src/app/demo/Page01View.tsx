import "./PageView.css"
import type {WinObjId} from "@/App.tsx";

interface Props {
  winObjId: WinObjId
}

function Page01View({}: Props) {
  return (
    <div className="win-page">
      <div className="page-title">
        <div>자산통계정보</div>
      </div>
      <div className="page-search">
        Search
      </div>
      <div className="page-grid">
        Grid
      </div>
      <div className="page-graph">
        Graph
      </div>

    </div>
  )
}

export default Page01View;
