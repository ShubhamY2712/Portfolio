"use client";

import { useState } from "react";
import { INTRO } from "@/lib/home";
import styles from "./HomeIntro.module.css";

/**
 * Click-to-load intro video: a poster first, the privacy-enhanced YouTube player
 * only after a click. With no video yet (videoId null) the poster stays a still image.
 */
export default function VideoFacade({ videoId }: { videoId: string | null }) {
  const [playing, setPlaying] = useState<boolean>(false);

  if (videoId && playing) {
    return (
      <iframe
        className={styles.player}
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
        title={`${INTRO.posterName}: intro video`}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  }

  const poster = (
    <>
      <img className={styles.posterMascot + " d"} src="/art/mascot/mascot-day.webp" alt="" width={640} height={848} />
      <img className={styles.posterMascot + " n"} src="/art/mascot/mascot-night.webp" alt="" width={640} height={848} />
      <span className={styles.posterLines}>
        <b>{INTRO.posterName}</b>
        <span>{INTRO.posterLine}</span>
      </span>
      <span className={styles.play} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="#FBF7EF"><path d="M6 4l14 8-14 8z" /></svg>
      </span>
    </>
  );

  if (!videoId) {
    return (
      <div className={styles.poster} role="img" aria-label={`${INTRO.posterName}, ${INTRO.posterLine}`}>
        {poster}
      </div>
    );
  }

  return (
    <button type="button" className={styles.poster} aria-label="Play intro video" onClick={() => setPlaying(true)}>
      {poster}
    </button>
  );
}
