import {useEffect} from "react";
import type {PyJobEvent} from "@/types/models";


function PyJobListener() {
  useEffect(() => {
    const handler = (e: CustomEvent<PyJobEvent>) => {
      const pyJobEvent = e.detail;
      console.log(pyJobEvent)
    }
    window.addEventListener("py-job-event", handler as EventListener);
    return () => {
      window.removeEventListener("py-job-event", handler as EventListener);
    }

  }, [])
  return null;
}

export default PyJobListener
