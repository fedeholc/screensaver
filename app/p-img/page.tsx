/* eslint-disable @next/next/no-img-element */

import styles from "../page.module.css";
import FullScreenButton from "../fullScreenButton";

export default function Home() {
  return (
    <main className={styles.main}>
      <FullScreenButton />
      <img alt="fondo" src="/a.jpg" />
    </main>
  );
}
