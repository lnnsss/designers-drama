"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./Preloader.module.css";

const REMOVE_DELAY = 3800;

export function Preloader() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const removeTimer = window.setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = previousOverflow;
    }, REMOVE_DELAY);

    return () => {
      window.clearTimeout(removeTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={styles.preloader}
      aria-label="Loading Designers Drama"
      aria-live="polite"
    >
      <Image
        className={`${styles.mark} ${styles.logoMark}`}
        src="/logo.svg"
        width={81}
        height={40}
        alt="Designers Drama logo"
        priority
      />
      <Image
        className={`${styles.mark} ${styles.starMark}`}
        src="/star.svg"
        width={714}
        height={555}
        alt="Designers Drama star"
        priority
      />
    </div>
  );
}
