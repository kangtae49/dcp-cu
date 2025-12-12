import "./TerminalView.css"
import {useEffect, useRef} from "react";
import {Terminal as XTerm} from "@xterm/xterm"
import '@xterm/xterm/css/xterm.css';
import { FitAddon } from '@xterm/addon-fit';

interface Props {
  lines: string[]
}

function TerminalView({lines}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(() => {
      fitAddonRef.current?.fit();
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      const term = new XTerm({
        fontFamily: 'operator mono,SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace',
        fontSize: 14,
        theme: { background: '#1e1f22' },
        cursorStyle: 'underline',
        cursorBlink: false,
      });
      try{
        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        fitAddon.fit();
        term.open(containerRef.current);
        termRef.current = term;
        fitAddonRef.current = fitAddon;
        // termRefMap.set(termId, {
        //   termRef: termRef,
        //   fitAddonRef: fitAddonRef,
        // });
        // setTermRefMap(termRefMap);

        // term.writeln(termId);
      } catch (e) {
        console.log(e);
      }


    }
    return () => {
      console.log("dispose terminal");
      termRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    // if (!termRef.current) return;
    termRef?.current?.clear()
    for(const line of lines) {
      termRef?.current?.writeln(line)
    }
  }, [lines.length]);

  return (
    <div
      className="just-terminal"
      ref={containerRef}
    >
    </div>
  )
}

export default TerminalView


