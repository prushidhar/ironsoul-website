"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame
} from "framer-motion";

function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

export function VelocityMarquee({ children, baseVelocity = 5 }: { children: React.ReactNode, baseVelocity?: number }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });

  const directionFactor = useRef<number>(1);
  
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 16);
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });
  
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  return (
    <div style={{ overflow: "hidden", display: "flex", flexWrap: "nowrap" }}>
      <motion.div style={{ x, display: "flex", whiteSpace: "nowrap" }}>
        <div style={{ display: 'flex', gap: '4rem', paddingRight: '4rem' }}>{children}</div>
        <div style={{ display: 'flex', gap: '4rem', paddingRight: '4rem' }}>{children}</div>
        <div style={{ display: 'flex', gap: '4rem', paddingRight: '4rem' }}>{children}</div>
        <div style={{ display: 'flex', gap: '4rem', paddingRight: '4rem' }}>{children}</div>
      </motion.div>
    </div>
  );
}
