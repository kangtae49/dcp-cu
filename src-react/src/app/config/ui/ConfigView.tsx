// import {useState} from "react";
// import {useDynamicSlice} from "@/store/hooks.ts";
// import {type ConfigsActions, type ConfigsState, createConfigsSlice} from "@/app/config/configsSlice.ts";
import ConfigGrid from "@/app/grid/ConfigGrid.tsx";
import "./ConfigView.css"
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons";
import AutoSizer from "react-virtualized-auto-sizer";
// import classNames from "classnames";

interface Props {
  configKey: string
}

function ConfigView({configKey}: Props) {
  // const {
  //   state: configsState,
  // } = useDynamicSlice<ConfigsState, ConfigsActions>("CONFIGS", createConfigsSlice)

  // const [configKey, setConfigKey] = useState<string | null>(null)
  const clickConfigKey = () => {
    console.log(configKey)
    openSetting(configKey)
  }

  const openSetting = (key: string) => {
    window.pywebview.api.start_data_file(key)
  }

  return (
    <div className="config">
      <div className="config-key" onClick={clickConfigKey}>
        <div className="config-title"><Icon icon={faPenToSquare} /> {configKey}</div>
      </div>
      <AutoSizer>
        {({ height, width }) => (
          <div className="config-table" style={{width, height: height - 25}}>
            {configKey && <ConfigGrid configKey={configKey} />}
          </div>
        )}
      </AutoSizer>
    </div>
  )
}

export default ConfigView;

