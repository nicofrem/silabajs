import {
  ACCENTED_STRONG_VOWEL,
  NOT_ACCENTED_STRONG_VOWEL,
  DIAERESIS_VOWEL,
  ACCENTED_WEAK_VOWEL,
  NOT_ACCENTED_WEAK_VOWEL,
  isConsonant,
} from "./lettersHelper";

interface IConditionsVowels {
  prev: number;
  position: number;
  hasReturn: boolean;
}

interface IConditionsParam {
  accentedStrongVowel: Function;
  notAccentedStrongVowel: Function;
  accentedWeakVowel: Function;
  notAccentedWeakVowel: Function;
}

const conditionsVowels = (word: string, position: number, conditions: IConditionsParam): IConditionsVowels => {
  let response;
  const currentLetter = word[position];

  if (position < word.length && !isConsonant(currentLetter)) {
    if (ACCENTED_STRONG_VOWEL.includes(currentLetter)) {
      response = conditions.accentedStrongVowel();
    } else if (NOT_ACCENTED_STRONG_VOWEL.includes(currentLetter)) {
      response = conditions.notAccentedStrongVowel();
    } else if ([...ACCENTED_WEAK_VOWEL, ...DIAERESIS_VOWEL].includes(currentLetter)) {
      response = conditions.accentedWeakVowel();
    } else if (NOT_ACCENTED_WEAK_VOWEL.includes(currentLetter)) {
      response = conditions.notAccentedWeakVowel();
    }
  }

  return {
    position,
    prev: 0,
    hasReturn: false,
    ...response,
  };
};

const nucleo = (word: string, currentPosition: number): number => {
  // 0 = fuerte
  // 1 = débil acentuada
  // 2 = débil

  // ver guen za - 1

  // Sirve para saber el tipo de vocal anterior cuando hay dos seguidas
  let finalPosition = currentPosition;
  // let encontroTonica;

  const wordLength = word.length;

  if (finalPosition >= wordLength) return finalPosition; // ¡¿No tiene núcleo?!

  // Se salta una 'y' al principio del núcleo, considerándola consonante
  if (word[finalPosition] === "y") finalPosition += 1;

  // Primera vocal
  const {
    prev,
    position: positionFirstVowel,
    hasReturn,
  } = conditionsVowels(word, finalPosition, {
    accentedStrongVowel: () => ({
      position: finalPosition + 1,
    }),
    notAccentedStrongVowel: () => ({
      position: finalPosition + 1,
    }),
    accentedWeakVowel: () => ({
      position: finalPosition + 1,
      hasReturn: true,
    }),
    notAccentedWeakVowel: () => ({
      position: finalPosition + 1,
      prev: 2,
    }),
  });

  if (hasReturn) return positionFirstVowel;

  finalPosition = positionFirstVowel;

  // 'h' intercalada en el núcleo, no condiciona diptongos o hiatos
  let hasH = false;
  if (positionFirstVowel < wordLength && word[positionFirstVowel] === "h") {
    finalPosition += 1;
    hasH = true;
  }

  const { position: positionSecondVowel, hasReturn: hasSecondReturn } = conditionsVowels(word, finalPosition, {
    accentedStrongVowel: () => {
      let newPosition = finalPosition;
      // silaba.letraTildada = pos;
      if (prev !== 0) {
        // encontroTonica = true;
      } else {
        // Dos vocales fuertes no forman silaba
        if (hasH) {
          newPosition -= 1;
        }
        return { position: newPosition, hasReturn: true };
      }

      return { position: newPosition + 1 };
    },
    notAccentedStrongVowel: () => {
      let newPosition = finalPosition;
      if (prev === 0) {
        // Dos vocales fuertes no forman silaba
        if (hasH) {
          newPosition -= 1;
        }
        return { position: newPosition, hasReturn: true };
      }

      finalPosition += 1;
      return { position: newPosition + 1 };
    },
    accentedWeakVowel: () => {
      let newPosition = finalPosition;

      // silaba.letraTildada = pos;

      if (prev !== 0) {
        // Se forma diptongo
        // encontroTonica = true;
        newPosition += 1;
      } else if (hasH) {
        newPosition -= 1;
      }

      return { position: newPosition, hasReturn: true };
    },
    notAccentedWeakVowel: () => {
      let newPosition = finalPosition;

      if (newPosition < wordLength - 1) {
        // ¿Hay tercera vocal?
        const nextLetter = word[newPosition + 1];
        if (!isConsonant(nextLetter)) {
          const prevLetter = word[newPosition - 1];
          if (prevLetter === "h") {
            newPosition -= 1;
          }

          return { position: newPosition, hasReturn: true };
        }
      }

      // dos vocales débiles iguales no forman diptongo
      if (word[newPosition] !== word[newPosition - 1]) {
        newPosition += 1;
      }

      // Es un diptongo plano o descendente
      return { position: newPosition, hasReturn: true };
    },
  });

  if (hasSecondReturn) return positionSecondVowel;

  finalPosition = positionSecondVowel;

  // ¿tercera vocal?
  if (positionSecondVowel < wordLength) {
    const currentLetter = word[positionSecondVowel];
    if (currentLetter === "i" || currentLetter === "u") {
      // Vocal débil
      finalPosition += 1;
      return positionSecondVowel; // Es un triptongo
    }
  }

  // console.log(silaba.letraTildada, encontroTonica, anterior, pos, hasH);

  return positionSecondVowel;
};

export default nucleo;
