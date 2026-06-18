"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@/components/Icons/Icons";
import { IconButton } from "@/components/IconButton/IconButton";
import styles from "./Header.module.css";

export function BackButton() {
  const pathname = usePathname();
  const router = useRouter();
  const isProductPage = pathname.startsWith("/product/");

  if (!isProductPage) {
    return null;
  }

  return (
    <div className={styles.backAction}>
      <IconButton label="Go back" onClick={() => router.back()}>
        <ArrowLeftIcon />
      </IconButton>
    </div>
  );
}
