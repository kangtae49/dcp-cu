import * as React from "react";
import {useEffect, useRef} from "react";
import type {JustBranch, JustDirection} from "@/app/just-layout/justLayoutSlice.ts";
import classNames from "classnames";
import throttle from 'lodash/throttle';
import clamp from "lodash/clamp";

const RESIZE_THROTTLE_MS = 1000 / 30; // 30 fps

interface Props {
  direction: JustDirection
  justBranch: JustBranch
  containerRef: React.RefObject<HTMLDivElement | null>
  onChange?: (splitPercentage: number) => void;
  onRelease?: (splitPercentage: number) => void;
}

function JustSplit({ direction, containerRef, onChange, onRelease }: Props) {
  const refSplit = useRef<HTMLDivElement>(null);
  const [listenersBound, setListenersBound] = React.useState(false);

  const bindListeners = () => {
    if (!listenersBound) {
      refSplit.current!.ownerDocument!.addEventListener('mousemove', onMouseMove, true);
      refSplit.current!.ownerDocument!.addEventListener('mouseup', onMouseUp, true);
      setListenersBound(true)
    }
  }

  const unbindListeners = () => {
    if (refSplit.current) {
      refSplit.current.ownerDocument!.removeEventListener('mousemove', onMouseMove, true);
      refSplit.current.ownerDocument!.removeEventListener('mouseup', onMouseUp, true);
      setListenersBound(false);
    }
  }
  const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    bindListeners();
  };

  const onMouseUp = (event: MouseEvent) => {
    unbindListeners();
    if (containerRef == undefined) return;

    const percentage = calculateRelativePercentage(event, containerRef)
    if (percentage !== null){
      onRelease!(percentage);
    }
  };

  const onMouseMove = (event: MouseEvent) => {
    event.preventDefault();
    if (containerRef == undefined) return;
    throttledUpdatePercentage(event, containerRef);
  };

  const calculateRelativePercentage = (event: MouseEvent, containerRef: React.RefObject<HTMLDivElement | null>) => {
    if (containerRef.current == null) return null;
    const rect = containerRef.current.getBoundingClientRect()
    const MousePos = direction === 'row' ? event.clientX : event.clientY;
    const containerPos = direction === 'row' ? rect.left : rect.top;
    const containerSize = direction === 'row' ? rect.width : rect.height;
    let percentage = (MousePos - containerPos) * 100 / containerSize;

    percentage = clamp(percentage, 0, 100);
    return percentage;
  }
  const throttledUpdatePercentage = throttle((event: MouseEvent, containerRef: React.RefObject<HTMLDivElement | null>) => {
    if (containerRef.current == null) return null;
    const percentage = calculateRelativePercentage(event, containerRef)
    if (percentage !== null) {
      onChange!(percentage)
    }
  }, RESIZE_THROTTLE_MS)

  useEffect(() => {

  })

  return (
    <div
      ref={refSplit}
      className={classNames("just-splitter")}
      onMouseDown={onMouseDown}
    />
  )
}

export default JustSplit