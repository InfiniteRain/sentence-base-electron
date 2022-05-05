import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { kotuQuery, Morpheme } from "../queries";

export const Mining = () => {
  const [clip, setClip] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
  const [morphemes, setSelectedMorphemes] = useState<Morpheme[]>([]);
  const [selectedMorpheme, setSelectedMorpheme] = useState<Morpheme | null>(
    null
  );
  const [tagsInput, setTagsInput] = useState("");
  const [tags, setTags] = useState<string[]>(
    (localStorage.getItem("tags") ?? "").trim().split(/\s+/)
  );

  const { data: kotuData, status: kotuStatus } = useQuery(
    ["kotu", clip],
    () => kotuQuery(clip),
    {
      enabled: clip !== "",
      keepPreviousData: true,
      onSuccess() {
        setSelectedKeys([]);
      },
    }
  );

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
  useEffect(() => {
    setSelectedMorphemes(
      (kotuData ?? []).filter((_, index) => selectedKeys.includes(index)).flat()
    );
    setSelectedMorpheme(null);
  }, [selectedKeys, kotuData]);
  useEffect(() => {
    const tagsString = tags.join(" ");

    setTagsInput(tagsString);
    localStorage.setItem("tags", tagsString);
  }, [tags]);

  const onSentenceButtonPressed = useCallback(
    (key: number) => {
      if (selectedKeys.includes(key)) {
        setSelectedKeys((existingKeys) =>
          existingKeys.filter((existingKey) => existingKey !== key)
        );
        return;
      }

      setSelectedKeys((existingKeys) => [...existingKeys, key]);
    },
    [selectedKeys]
  );

  return (
    <>
      Tags:
      <input
        style={{ marginLeft: "10px" }}
        type="text"
        value={tagsInput}
        onChange={(e) => setTagsInput(e.target.value)}
        onBlur={(e) => setTags(e.target.value.trim().split(/\s+/))}
      />
      <br />
      {kotuData ? (
        kotuData.map((morphemes, index) => (
          <button
            key={index}
            style={styles.button}
            onClick={() => {
              onSentenceButtonPressed(index);
            }}
          >
            {morphemes.map((morpheme) => morpheme.surface).join("")}
          </button>
        ))
      ) : (
        <p>Copy some text!</p>
      )}
      {morphemes.length > 0 && (
        <>
          <hr />
          {morphemes.map((morpheme, index) => (
            <button
              key={index}
              style={styles.button}
              onClick={() => setSelectedMorpheme({ ...morpheme })}
            >
              {morpheme.surface}
            </button>
          ))}
          <br />
          <input
            style={styles.input}
            type="text"
            value={selectedMorpheme?.dictionaryForm ?? ""}
            onChange={(e) =>
              setSelectedMorpheme((morpheme) =>
                morpheme
                  ? { ...morpheme, dictionaryForm: e.target.value.trim() }
                  : null
              )
            }
          />
          <input
            style={styles.input}
            type="text"
            value={selectedMorpheme?.dictionaryFormReading ?? ""}
            onChange={(e) =>
              setSelectedMorpheme((morpheme) =>
                morpheme
                  ? {
                      ...morpheme,
                      dictionaryFormReading: e.target.value.trim(),
                    }
                  : null
              )
            }
          />
          <br />
          <button
            style={{ ...styles.button, width: "200px" }}
            disabled={!selectedMorpheme}
          >
            Mine!
          </button>
        </>
      )}
    </>
  );
};

const styles: {
  [K: string]: React.CSSProperties;
} = {
  button: {
    padding: "2.5px",
    margin: "2.5px",
  },
  input: {
    margin: "2.5px",
  },
};

// これは猫です。猫が鳴いている。
