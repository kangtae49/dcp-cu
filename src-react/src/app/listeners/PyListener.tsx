import {useEffect} from "react";
import type {PyEvent} from "@/types/models";

// interface PyEvent {
//   action: any
// }

function PyListener() {
  useEffect(() => {
    const handler = (e: CustomEvent<PyEvent>) => {
      const action = e.detail.action;
      console.log(action)
    }
    window.addEventListener("py-event", handler as EventListener);
    return () => {
      window.removeEventListener("py-event", handler as EventListener);
    }

  }, [])
  return null;
}

export default PyListener
