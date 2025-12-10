import "./PageView.css"
import {type WinObjId} from "@/App.tsx";
import Jdenticon from "react-jdenticon";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons"
import SelectBox from "@/app/components/select/SelectBox.tsx";

interface Props {
  winObjId: WinObjId
}

function Page01View({winObjId}: Props) {
  return (
    <div className="win-page">
      <div className="page-title">
        <div className="page-icon">
          <Jdenticon size="25" value={winObjId.viewId} />
        </div>
        <div className="page-label">자산통계정보</div>
      </div>
      <div className="page-search">
        <div className="search-filter">
          <div className="search-row">
            <div className="search-item">
              <div className="search-item-label">기업체명</div>
              <div className="search-item-value">
                <SelectBox
                  options={[
                    {
                      value: "한화생명보험주식회사0",
                      label: "한화생명보험주식회사0"
                    },
                    {
                      value: "한화",
                      label: "한화"
                    },
                    {
                      value: "한화생명보험주식회사3",
                      label: "한화생명보험주식회사3"
                    },
                    {
                      value: "한화생명보험주식회사1",
                      label: "한화생명보험주식회사1"
                    },
                    {
                      value: "한화생명보험주식회사2",
                      label: "한화생명보험주식회사2"
                    },

                  ]}
                />
                {/*<select>*/}
                {/*  <option value="">한화생명보험주식회사1</option>*/}
                {/*  <option value="">한화생명보험주식회사2</option>*/}
                {/*  <option value="">한화생명보험주식회사3</option>*/}
                {/*</select>*/}
              </div>
            </div>
          </div>
        </div>
        <div className="search-box">
          <div className="search-btn">
            <Icon icon={faMagnifyingGlass} />
          </div>
        </div>
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
