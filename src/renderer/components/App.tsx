import React, { useEffect, useState } from "react";

export const App = () => {
  const [clip, setClip] = useState("");

  useEffect(() => {
    let lastClipboardEntry: string | null = null;

    const clipboardInterval = setInterval(async () => {
      const clipboardEntry = await sentenceBase.getCurrentClipboardEntry();

      if (
        lastClipboardEntry !== clipboardEntry &&
        lastClipboardEntry !== null
      ) {
        setClip(clipboardEntry);
      }

      lastClipboardEntry = clipboardEntry;
    }, 100);

    return () => clearInterval(clipboardInterval);
  }, []);

  return <p>{clip}</p>;
};
