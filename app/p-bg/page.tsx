/* eslint-disable @next/next/no-img-element */

import styles from "./page.module.css";
import FullScreenButton from "../fullScreenButton";

export default function Home() {
  return (
    <main style={{ backgroundImage: 'url("/a.jpg")' }} className={styles.main}>
      <FullScreenButton />
    </main>
  );
}
