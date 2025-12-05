import * as React from "react";
import {useEffect, useRef} from "react";
import type {JustBranch, JustDirection} from "@/app/just-layout/justLayoutSlice.ts";
import classNames from "classnames";
import throttle from 'lodash/throttle';
import clamp from "lodash/clamp";

const RESIZE_THROTTLE_MS = 1000 / 30; // 30 fps

export interface SplitSize {
  percentage: number,
  firstSize: number,
  secondSize: number
}

interface Props {
  direction: JustDirection
  justBranch: JustBranch
  containerRef: React.RefObject<HTMLDivElement | null>
  onChange?: (splitSize: SplitSize) => void;
  onRelease?: (splitSize: SplitSize) => void;
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

    const splitSize = calculateSplitSize(event, containerRef)
    if (splitSize !== null){
      onRelease!(splitSize);
    }
  };

  const onMouseMove = (event: MouseEvent) => {
    event.preventDefault();
    if (containerRef == undefined) return;
    throttledUpdatePercentage(event, containerRef);
  };

  // const calculateRelativePercentage = (event: MouseEvent, containerRef: React.RefObject<HTMLDivElement | null>) => {
  //   if (containerRef.current == null) return null;
  //   const rect = containerRef.current.getBoundingClientRect()
  //   const MousePos = direction === 'row' ? event.clientX : event.clientY;
  //   const containerPos = direction === 'row' ? rect.left : rect.top;
  //   const containerSize = direction === 'row' ? rect.width : rect.height;
  //   let percentage = (MousePos - containerPos) * 100 / containerSize;
  //
  //   percentage = clamp(percentage, 0, 100);
  //   return percentage;
  // }

  const calculateSplitSize = (event: MouseEvent, containerRef: React.RefObject<HTMLDivElement | null>): SplitSize | null => {
    if (containerRef.current == null) return null;
    const rect = containerRef.current.getBoundingClientRect()
    const MousePos = direction === 'row' ? event.clientX : event.clientY;
    const containerPos = direction === 'row' ? rect.left : rect.top;
    const containerSize = direction === 'row' ? rect.width : rect.height;
    const firstSize = clamp(MousePos - containerPos, 0, containerSize);
    const secondSize = clamp(containerSize - firstSize, 0, containerSize);
    const percentage = clamp(firstSize * 100 / containerSize, 0, 100);

    return {percentage, firstSize, secondSize};
  }

  const throttledUpdatePercentage = throttle((event: MouseEvent, containerRef: React.RefObject<HTMLDivElement | null>) => {
    if (containerRef.current == null) return null;
    const splitSize = calculateSplitSize(event, containerRef)
    if (splitSize !== null) {
      onChange!(splitSize)
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