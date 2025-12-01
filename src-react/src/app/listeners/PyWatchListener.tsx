import {useEffect} from "react";
import type {PyWatchEvent} from "@/types/models";
import {useDynamicSlice} from "@/store/hooks.ts";
import {
  type ConfigsState,
  type ConfigsActions,
  createConfigsSlice,
} from "@/app/config/configsSlice.ts";


function PyWatchListener() {
  const { actions: configsActions, dispatch } = useDynamicSlice<ConfigsState, ConfigsActions>("CONFIGS", createConfigsSlice)

  useEffect(() => {

    const handler = (e: CustomEvent<PyWatchEvent>) => {
      const pyWatchEvent = e.detail;
      const watchFile = pyWatchEvent.data;
      console.log(watchFile)
      if (watchFile.status === 'CREATED' || watchFile.status === 'MODIFIED') {
        window.pywebview.api.read_config(watchFile.key).then(res => {
          dispatch(
            configsActions.updateConfigs({
              configs: res
            })
          )
        })
      } else if (watchFile.status === 'DELETED') {
        dispatch(
          configsActions.updateConfigs({
            configs: {
              [watchFile.key]: []
            }
          })
        )
      }
    }
    window.addEventListener("py-watch-event", handler as EventListener);
    return () => {
      window.removeEventListener("py-watch-event", handler as EventListener);
    }

  }, [])
  return null;
}

export default PyWatchListener
