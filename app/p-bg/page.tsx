/* eslint-disable @next/next/no-img-element */

import styles from "./page.module.css";
import FullScreenButton from "../fullScreenButton";
import img1 from "/a.jpg";

export default function Home() {
  //let bg = { backgroundImage: { img1 } };
  let bg = { backgroundImage: 'url("/a.jpg")' };

  return (
    <main style={bg} className={styles.main}>
      <FullScreenButton />
    </main>
  );
}
