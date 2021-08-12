import { isConsonant } from "./lettersHelper";

interface ILastConsantAndPosition {
  lastConsant: string;
  position: number;
}

const lastConsantAndPosition = (
  position: number,
  lastConsant: string | undefined = "a",
  word: string
): ILastConsantAndPosition => {
  const currentLetter = word[position];
  if (position < word.length && isConsonant(currentLetter) && currentLetter !== "y") {
    return lastConsantAndPosition(position + 1, currentLetter, word);
  }
  return { lastConsant, position };
};

export default (word: string, currentPosition: number): number => {
  // c - u
  const { lastConsant, position } = lastConsantAndPosition(currentPosition, undefined, word);
  const currentLetter = word[position].toLowerCase();

  // (q | g) + u (ejemplo: queso, gueto)
  let extraPosition = 0;
  if (position < word.length - 1) {
    if (currentLetter === "u") {
      if (lastConsant === "q") {
        extraPosition += 1;
      } else if (lastConsant === "g") {
        const nextLetter = word[position + 1];
        const letters = ["e", "é", "i", "í"];

        if (letters.includes(nextLetter)) {
          extraPosition += 1;
        }
      }
    } else if (currentLetter === "ü" && lastConsant === "g") {
      // La u con diéresis se añade a la consonante
      extraPosition += 1;
    }
  }

  return position + extraPosition;
};
