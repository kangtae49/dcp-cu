import JustWinTitleView from "@/app/just-layout/ui/JustWinTitleView.tsx";
import JustWinBodyView from "@/app/just-layout/ui/JustWinBodyView.tsx";
import type {JustBranch, JustStack, WinInfo} from "@/app/just-layout/justLayoutSlice.ts";

interface Prop {
  justBranch: JustBranch
  justStack: JustStack
  viewMap: Record<string, WinInfo>
}

function JustWinView ({justBranch, justStack, viewMap}: Prop) {
  return (
    <div className="just-win">
      <JustWinTitleView justBranch={justBranch} justStack={justStack} viewMap={viewMap} />
      <JustWinBodyView justBranch={justBranch} justStack={justStack} viewMap={viewMap} />
    </div>
  )
}

export default JustWinView
