import "./PageView.css"
import {type WinObjId} from "@/App.tsx";
import Jdenticon from "react-jdenticon";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons"
import SelectBox, {type Option} from "@/app/components/select/SelectBox.tsx";
import MonthPicker from "@/app/components/date/MonthPicker.tsx";
import {useDynamicSlice} from "@/store/hooks.ts";
import {type ConfigsActions, type ConfigsState, createConfigsSlice} from "@/app/config/configsSlice.ts";
import {useEffect, useState} from "react";

interface Props {
  winObjId: WinObjId
}

function Page01View({winObjId}: Props) {
  const configKey = "업체명.xlsx";
  const {
    state: configsState,
    // actions: configsActions,
    // dispatch
  } = useDynamicSlice<ConfigsState, ConfigsActions>("CONFIGS", createConfigsSlice)
  const [company, setCompany] = useState<Option[]>([])

  useEffect(() => {
    if (!configsState?.configs) return;
    const config = configsState?.configs?.[configKey];
    console.log('config:', config)
    setCompany(toOptions(config.data))
  }, [configsState?.configs]);


  const toOptions = (data: Record<string, string>[]): Option[] => {
    return data.map(d => {
      return {value: d.cdVlId, label: d.cdVlNm}
    })
  }

  // useDynamicSlice
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
                  onChange={(option) => console.log(option)}
                  options={company}
                />
              </div>
            </div>
            <div className="search-item">
              <div className="search-item-label">조회기간</div>
              <div className="search-item-value">
                <MonthPicker />
              </div>
              <div>~</div>
              <div className="search-item-value">
                <MonthPicker />
              </div>
            </div>
          </div>
        </div>
        <div className="search-box">
          <div className="search-icon-btn">
            <div className="search-icon">
              <Icon icon={faMagnifyingGlass} />
            </div>
            <div className="search-btn-label">
              검색
            </div>
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
