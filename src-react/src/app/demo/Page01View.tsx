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
import { format } from "date-fns";

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
  const [startDate, setStartDate] = useState<Date | null>(new Date())
  const [endDate, setEndDate] = useState<Date | null>(new Date())

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

  const onChangeStartDate = (date: Date | null) => {
    console.log('onChangeStartDate:', date)
    setStartDate(date)
  }

  const onChangeEndDate = (date: Date | null) => {
    console.log('onChangeEndDate:', date)
    setEndDate(date)
  }

  const searchPage01 = () => {
    console.log('searchPage01')
    const jobId = "job_001"
    if (!startDate || !endDate) return;
    const startYm = format(startDate, "yyyyMM");
    const endYm = format(endDate, "yyyyMM");
    window.pywebview.api.start_script(jobId, "page01.py", [jobId, winObjId.viewId, "101", startYm, endYm])
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
                <MonthPicker initialDate={startDate} onChange={onChangeStartDate} />
              </div>
              <div>~</div>
              <div className="search-item-value">
                <MonthPicker initialDate={endDate} onChange={onChangeEndDate} />
              </div>
            </div>
            <div className="search-box">
              <div className="search-icon-btn" onClick={() => searchPage01()}>
                <div className="search-icon">
                  <Icon icon={faMagnifyingGlass} />
                </div>
                <div className="search-btn-label">
                  검색
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*<div className="search-box">*/}
        {/*  <div className="search-icon-btn">*/}
        {/*    <div className="search-icon">*/}
        {/*      <Icon icon={faMagnifyingGlass} />*/}
        {/*    </div>*/}
        {/*    <div className="search-btn-label">*/}
        {/*      검색*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}
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
