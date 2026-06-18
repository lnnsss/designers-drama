"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { CartIcon, LogoutIcon } from "@/components/Icons/Icons";
import { IconButton } from "@/components/IconButton/IconButton";
import { BackButton } from "@/components/Header/BackButton";
import styles from "./Header.module.css";

export function Header() {
  const { openCart, count } = useCart();
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");

  async function signOutAdmin() {
    if (!isSupabaseConfigured) {
      return;
    }

    await createClient().auth.signOut();
    window.location.href = "/admin";
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <BackButton />

        <Link href="/" className={styles.logoLink} aria-label="Designers Drama home">
          <Image src="/logo.svg" width={260} height={28} alt="Designers Drama" priority />
        </Link>

        <div className={styles.actions}>
          {isAdminPage ? (
            <IconButton label="Sign out" onClick={signOutAdmin}>
              <LogoutIcon />
            </IconButton>
          ) : (
            <IconButton label="Open cart" onClick={openCart}>
              <span className={styles.cartWrap}>
                <CartIcon />
                {count > 0 && <Image className={styles.cartStar} src="/star.svg" width={22} height={18} alt="" aria-hidden="true" />}
              </span>
            </IconButton>
          )}
        </div>
      </div>
    </header>
  );
}
