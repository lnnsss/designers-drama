import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./IconButton.module.css";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  children: ReactNode;
};

export function IconButton({ label, children, ...props }: IconButtonProps) {
  return (
    <button className={styles.button} type="button" aria-label={label} title={label} {...props}>
      {children}
    </button>
  );
}
