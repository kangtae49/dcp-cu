import JustWinTitleView from "@/app/just-layout/ui/JustWinTitleView.tsx";
import JustWinBodyView from "@/app/just-layout/ui/JustWinBodyView.tsx";
import type {JustBranch, JustStack, WinInfo} from "@/app/just-layout/justLayoutSlice.ts";
import {useEffect, useState} from "react";

interface Prop {
  justBranch: JustBranch
  justStack: JustStack
  viewMap: Record<string, WinInfo>
  closeWin: (winId: string) => void
  activeWin: (winId: string) => void
}

function JustWinView ({justBranch, justStack, viewMap, closeWin, activeWin}: Prop) {
  const [showTitle, setShowTitle] = useState(true)
  useEffect(() => {
    if (justStack.active === null) {
      return;
    }
    setShowTitle(viewMap[justStack.active].showTitle ?? true)

  }, [justStack])
  return (
    <div className="just-win">
      {showTitle &&
        <JustWinTitleView
          justBranch={justBranch}
          justStack={justStack}
          viewMap={viewMap}
          closeWin={closeWin}
          activeWin={activeWin}
        />
      }
      <JustWinBodyView justBranch={justBranch} justStack={justStack} viewMap={viewMap} />
    </div>
  )
}

export default JustWinView
