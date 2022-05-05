import { getAuth } from "firebase/auth";

export type Morpheme = {
  surface: string;
  surfaceReading: string;
  dictionaryForm: string;
  dictionaryFormReading: string;
  pitchAccents: {
    descriptive: string;
    mora: number;
  }[];
  isBasic: boolean;
  partOfSpeech: string;
};

type KotuResponse = {
  accentPhrases: {
    components: {
      surface: string;
      kana: string;
      surfaceOriginal: string;
      originalKana: string;
      pitchAccents: {
        descriptive: string;
        mora: number;
      }[];
      isBasic: boolean;
      partOfSpeech: string;
    }[];
  }[];
}[];

export type SbApiResponse<T = null> =
  | {
      success: false;
      errors: unknown[];
    }
  | {
      success: true;
      data: T;
    };

const kotuUrl = "https://kotu.io/api/dictionary/parse";
const sentenceBaseApiUrl =
  "https://us-central1-sentence-base.cloudfunctions.net/api/v1";

export const kotuQuery = async (query: string): Promise<Morpheme[][]> => {
  const response = await fetch(kotuUrl, { method: "post", body: query });
  const sentences = (await response.json()) as KotuResponse;

  return sentences.map((sentence) =>
    sentence.accentPhrases
      .flatMap((accentPhrase) => accentPhrase.components)
      .filter((component) => component.surface.trim() !== "")
      .map<Morpheme>((component) => ({
        surface: component.surface.trim(),
        surfaceReading: component.kana.trim(),
        dictionaryForm: (component.surfaceOriginal || component.surface).trim(),
        dictionaryFormReading: (
          component.originalKana || component.surface
        ).trim(),
        pitchAccents: component.pitchAccents,
        isBasic: component.isBasic,
        partOfSpeech: component.partOfSpeech,
      }))
  );
};

const sentenceBaseApiRequest = async <T = null>(
  method: "get" | "post" | "delete",
  endpoint: string,
  body?: Record<string, unknown>
) => {
  endpoint = endpoint.replace(/^\/+|\/+$/g, "");

  const response = await fetch(`${sentenceBaseApiUrl}/${endpoint}`, {
    method,
    ...(body ? { body: JSON.stringify(body) } : {}),
    headers: new Headers({
      ...(body ? { "Content-Type": "application/json" } : {}),
      Authorization: `Bearer ${await getAuth().currentUser?.getIdToken()}`,
    }),
  });
  const json = (await response.json()) as SbApiResponse<T>;

  if (!json.success) {
    throw new Error(
      `Request ${method.toUpperCase()} -> ${endpoint} responded with { "success": false }`
    );
  }

  return json.data;
};

export const addSentence = async (
  dictionaryForm: string,
  reading: string,
  sentence: string,
  tags: string[]
) =>
  await sentenceBaseApiRequest("post", "sentences", {
    dictionaryForm,
    reading,
    sentence,
    tags,
  });
