import React, { useEffect, useRef } from "react";

export default function LazyVideo({ src, ...props }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // set video source only when visible
          el.src = src;
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [src]);

  return (
    <video
      ref={videoRef}
      preload="none"
      {...props} // passes width, height, controls, autoplay, etc.
    />
  );
}
