import styles from "./Footer.module.css";

const socialLinks = [
  { label: "Telegram", href: "https://t.me/designersdrama" },
  { label: "Instagram", href: "https://www.instagram.com/designers.drama/" },
  { label: "Email", href: "mailto:designersdrama@gmail.com" }
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <nav className={styles.socials} aria-label="Social links">
        {socialLinks.map((link) => (
          <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
            {link.label}
          </a>
        ))}
      </nav>
      <p className={styles.rights}>ALL RIGHTS RESERVED © 2026 DESIGNERSDRAMA</p>
    </footer>
  );
}
