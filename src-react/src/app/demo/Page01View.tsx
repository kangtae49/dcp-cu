import "./PageView.css"
import {type WinObjId} from "@/App.tsx";
import Jdenticon from "react-jdenticon";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons"
import SelectBox, {type Option} from "@/app/components/select/SelectBox.tsx";
import MonthPicker from "@/app/components/date/MonthPicker.tsx";
import {useDynamicSlice} from "@/store/hooks.ts";
import {type ConfigsActions, type ConfigsState, createConfigsSlice} from "@/app/config/configsSlice.ts";
import {Activity, useEffect, useState} from "react";
import { format } from "date-fns";
import {createJobMonitorSlice, type JobMonitorActions, type JobMonitorState} from "@/app/job/jobMonitorSlice.ts";
import {createJobMonitorThunks} from "@/app/job/jobMonitorThunks.ts";
import type {JobDataStream, JobStatus, PyJobEvent} from "@/types/models";
import TerminalView from "@/app/terminal/TerminalView.tsx";

interface Props {
  winObjId: WinObjId
}

interface JobInfo {
  jobId: string,
  status: JobStatus
}

type TabType = "GRAPH" | "GRID" | "LOG"

function Page01View({winObjId}: Props) {
  const configKey = "업체명.xlsx";
  const {
    state: configsState,
    // actions: configsActions,
    // dispatch
  } = useDynamicSlice<ConfigsState, ConfigsActions>("CONFIGS", createConfigsSlice)

  const {
    state: jobMonitorState,
    actions: jobMonitorActions,
    thunks: jobMonitorThunks,
    dispatch
  } = useDynamicSlice<JobMonitorState, JobMonitorActions>("JOB_MONITOR", createJobMonitorSlice, createJobMonitorThunks)

  const [company, setCompany] = useState<Option[]>([])
  const [startDate, setStartDate] = useState<Date | null>(new Date())
  const [endDate, setEndDate] = useState<Date | null>(new Date())
  const [jobInfo, setJobInfo] = useState<JobInfo | null>(null)
  const [tab, setTab] = useState<TabType>("GRAPH")
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    if (!configsState?.configs) return;
    const config = configsState?.configs?.[configKey];
    console.log('config:', config)
    setCompany(toOptions(config.data))
  }, [configsState?.configs]);

  useEffect(() => {
    if (jobInfo === null) return;

    const status: JobStatus | null = dispatch(jobMonitorThunks.getJobStatus({jobId: jobInfo?.jobId}))
    if (status !== null && jobInfo.status !== status) {
      console.log('jobStatus:', status)
      setJobInfo({...jobInfo, status})
    }

    const events: PyJobEvent [] = dispatch(jobMonitorThunks.getJobEvents({jobId: jobInfo?.jobId}))
    const streamEvents = events.filter((event) => event.action === 'PY_JOB_STREAM')
    const logs = streamEvents.map((event) => (event.data as JobDataStream).message ?? '')
    setLogs(logs)
  }, [jobMonitorState, jobInfo]);

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

  const searchPage01 = async () => {


    if (!startDate || !endDate) return;
    const startYm = format(startDate, "yyyyMM");
    const endYm = format(endDate, "yyyyMM");

    if (jobInfo !== null && jobInfo.status === 'RUNNING') return;
    console.log('searchPage01')

    if (jobInfo) {
      await dispatch(jobMonitorActions.clearEvents({jobId: jobInfo?.jobId}))
    }
    const jobId = "page01"
    setJobInfo({jobId, status: 'RUNNING'})
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
                  {jobInfo !== null && jobInfo.status === 'RUNNING' ?
                    <div className="spinner"></div>
                    :
                    <Icon icon={faMagnifyingGlass} />
                  }
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
      {/*<div className="page-graph">*/}
      {/*  Graph*/}
      {/*</div>*/}
      {/*<div className="page-grid">*/}
      {/*  Grid*/}
      {/*</div>*/}
      <div className="page-body">
        <div className="tabs">
          <div className="tab-graph tab-title" onClick={()=>setTab('GRAPH')}>graph</div>
          <div className="tab-grid tab-title" onClick={()=>setTab('GRID')}>grid</div>
          <div className="tab-log tab-title" onClick={()=>setTab('LOG')}>log</div>
        </div>
        <div className="tab-body">
          <Activity mode={tab === "LOG" ? "visible" : "hidden"}>
              <TerminalView lines={logs} />
          </Activity>
        </div>
      </div>

    </div>
  )
}

export default Page01View;
