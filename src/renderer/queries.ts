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

const kotuUrl = "https://kotu.io/api/dictionary/parse";

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
