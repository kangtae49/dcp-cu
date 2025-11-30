import {useEffect} from "react";
import type {PyWatchEvent} from "@/types/models";


function PyWatchListener() {
  useEffect(() => {
    const handler = (e: CustomEvent<PyWatchEvent>) => {
      const pyWatchEvent = e.detail;
      console.log(pyWatchEvent)
    }
    window.addEventListener("py-watch-event", handler as EventListener);
    return () => {
      window.removeEventListener("py-watch-event", handler as EventListener);
    }

  }, [])
  return null;
}

export default PyWatchListener
