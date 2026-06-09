"use client";

import { useEffect, useState } from "react";

const CAN_HOVER_MQ = "(hover: hover) and (pointer: fine)";

export function useCanHover() {
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(CAN_HOVER_MQ);
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return canHover;
}
