import React from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.container}`}>
        <div className={styles.left}>
          <Link href="/" className={styles.logo}>
            <svg viewBox="0 0 60 25" fill="none" xmlns="http://www.w3.org/2000/svg" width="60" height="25">
              <path d="M59.64 14.272c0 5.224-4.472 8.672-10.616 8.672-3.4 0-6.176-1.008-8.256-2.528l1.44-3.528c1.616 1.2 3.968 2.144 6.144 2.144 3.064 0 5.232-1.392 5.232-3.528 0-5.328-14.392-2.312-14.392-10.4 0-4.608 3.96-8.216 9.816-8.216 3.16 0 5.488.944 7.352 2.16l-1.4 3.448c-1.616-1.048-3.552-1.76-5.464-1.76-2.672 0-4.256 1.352-4.256 3.12 0 4.672 14.4 1.76 14.4 10.416zM24.952 2.272V13.72c0 2.752 1.48 4.352 3.912 4.352 1.216 0 2.16-.216 2.864-.52l.28 3.392c-1.016.512-2.456.904-4.52.904-5.024 0-8.52-2.832-8.52-8.128V2.272h6zM36.888 15.352c0 2.224 1.552 3.488 3.488 3.488 1.144 0 2.08-.232 2.784-.552l.272 3.416c-.952.488-2.344.888-4.288.888-4.888 0-8.248-2.888-8.248-8.08V8.184c0-4.824 3.016-7.936 8.16-7.936 4.616 0 7.424 2.768 7.424 7.224v1.832h-9.592v6.048zm6.152-7.168c0-1.88-.936-3.152-2.88-3.152-1.936 0-3.272 1.272-3.272 3.152h6.152zM14.296 8.184c0-4.824 3.016-7.936 8.16-7.936 4.616 0 7.424 2.768 7.424 7.224v1.832h-9.592v6.048c0 2.224 1.552 3.488 3.488 3.488 1.144 0 2.08-.232 2.784-.552l.272 3.416c-.952.488-2.344.888-4.288.888-4.888 0-8.248-2.888-8.248-8.08V8.184zm6.152.88h6.152c0-1.88-.936-3.152-2.88-3.152-1.936 0-3.272 1.272-3.272 3.152zM0 8.272C0 3.344 3.288.248 8.648.248c2.472 0 4.504.68 6.04 1.592l-1.336 3.424C12.184 4.544 10.608 4 8.76 4c-2.736 0-4.48 1.576-4.48 4.272 0 5.312 14.392 2.304 14.392 10.4 0 4.608-3.96 8.216-9.816 8.216-3.16 0-5.488-.944-7.352-2.16l1.4-3.448c1.616 1.048 3.552 1.76 5.464 1.76 2.672 0 4.256-1.352 4.256-3.12 0-4.672-14.4-1.76-14.4-10.416z" fill="currentColor"></path>
            </svg>
          </Link>
          <div className={styles.links}>
            <button className={styles.navItem}>Products</button>
            <button className={styles.navItem}>Solutions</button>
            <button className={styles.navItem}>Developers</button>
            <button className={styles.navItem}>Resources</button>
            <button className={styles.navItem}>Pricing</button>
          </div>
        </div>
        <div className={styles.right}>
          <Link href="/signin" className={styles.navItem}>Sign in</Link>
          <Link href="/contact" className={styles.contactBtn}>
            Contact sales
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="12" height="12">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
