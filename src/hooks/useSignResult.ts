import { useCallback, useState } from 'react';
import { signCategories } from '../utils/signGeometry';
import type { SignPhoto } from '../types/sign';

export type BreadAnswer = 'and' | 'crumbs';

const breadMapping: Record<BreadAnswer | 'none', string[]> = {
  none: ['Breads/Crumbs'],
  and: ['Bread', 'Crumbs'],
  crumbs: ['Bread crumbs']
};

interface Fields {
  aisles: (number | null)[];
  categories: string[];
  guesses: string[];
}

function fieldsFor(photo: SignPhoto, selected: number[]): Fields {
  return {
    aisles: selected.map((i) => photo.signs[i].aisle),
    categories: selected.flatMap((i) => signCategories(photo.signs[i])),
    guesses: selected.flatMap((i) => photo.signs[i].guesses)
  };
}

/** Editable result of reading a sign. Everything Pip read can be changed. */
export function useSignResult(photo: SignPhoto, signsInBox: number[]) {
  const initialSelection =
  photo.outcome === 'unreadable' ?
  [] :
  photo.outcome === 'multi' ?
  signsInBox.length === 1 ?
  signsInBox :
  [] :
  [0];

  const [selected, setSelected] = useState<number[]>(initialSelection);
  const [manual, setManual] = useState(false);
  const [answer, setAnswer] = useState<BreadAnswer | null>(null);
  const [fields, setFields] = useState<Fields>(() => fieldsFor(photo, initialSelection));

  const chooseSigns = useCallback(
    (next: number[]) => {
      setSelected(next);
      setFields(fieldsFor(photo, next));
    },
    [photo]
  );

  const answerQuestion = useCallback(
    (next: BreadAnswer) => {
      setFields((prev) => {
        const from = breadMapping[answer ?? 'none'];
        const at = prev.categories.indexOf(from[0]);
        if (at === -1) return prev;
        const categories = [...prev.categories];
        categories.splice(at, from.length, ...breadMapping[next]);
        return { ...prev, categories };
      });
      setAnswer(next);
    },
    [answer]
  );

  const startManual = useCallback(() => {
    setManual(true);
    setFields({ aisles: [null], categories: [], guesses: [] });
  }, []);

  const setAisle = useCallback((index: number, value: number | null) => {
    setFields((prev) => ({ ...prev, aisles: prev.aisles.map((a, i) => i === index ? value : a) }));
  }, []);

  const setCategories = useCallback((categories: string[]) => setFields((prev) => ({ ...prev, categories })), []);
  const setGuesses = useCallback((guesses: string[]) => setFields((prev) => ({ ...prev, guesses })), []);

  const showFields =
  photo.outcome === 'unreadable' ? manual : photo.outcome === 'multi' ? selected.length > 0 : true;
  const canSave = showFields && fields.aisles.length > 0 && fields.aisles.every((a) => a !== null && a > 0);

  return {
    ...fields,
    selected,
    manual,
    answer,
    showFields,
    canSave,
    chooseSigns,
    answerQuestion,
    startManual,
    setAisle,
    setCategories,
    setGuesses
  };
}