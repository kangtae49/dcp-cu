import {useState} from "react";
import {useDynamicSlice} from "@/store/hooks.ts";
import {type ConfigsActions, type ConfigsState, createConfigsSlice} from "@/app/config/configsSlice.ts";
import ConfigGrid from "@/app/grid/ConfigGrid.tsx";
import "./ConfigsView.css"
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
function ConfigsView() {
  const {
    state: configsState,
  } = useDynamicSlice<ConfigsState, ConfigsActions>("CONFIGS", createConfigsSlice)

  const [configKey, setConfigKey] = useState<string | null>(null)
  const clickConfigKey = (key: string) => {
    console.log(key)
    setConfigKey(key)
    openSetting(key)
  }

  const openSetting = (key: string) => {
    window.pywebview.api.start_data_file(key)
  }

  return (
    <div className="configs">
      <div className="configs-keys">
        {
          configsState?.keys.map((key) => (
            <div key={key} className={classNames("config-key", {"selected": configKey === key})} onClick={() => clickConfigKey(key)}>
              <div className="config-title"><Icon icon={faPenToSquare} /> {key}</div>
            </div>
          ))
        }
      </div>
      <div className="config-table">
        {configKey && <ConfigGrid configKey={configKey}/>}
      </div>
    </div>
  )
}

export default ConfigsView;

