export const NOT_ACCENTED_STRONG_VOWEL = ["a", "e", "o"];
export const isNotAccentedStrongVowel = (vowel: string = ""): boolean =>
  NOT_ACCENTED_STRONG_VOWEL.includes(vowel.toLowerCase());

export const NOT_ACCENTED_WEAK_VOWEL = ["i", "u"];
export const isNotAccentedWeakVowel = (vowel: string = ""): boolean =>
  NOT_ACCENTED_WEAK_VOWEL.includes(vowel.toLowerCase());

export const ACCENTED_STRONG_VOWEL = ["á", "à", "é", "è", "ó", "ò"];
export const isAccentedStrongVowel = (vowel: string = ""): boolean =>
  ACCENTED_STRONG_VOWEL.includes(vowel.toLowerCase());

export const ACCENTED_WEAK_VOWEL = ["í", "ì", "ú", "ù"];
export const isAccentedWeakVowel = (vowel: string = ""): boolean => ACCENTED_WEAK_VOWEL.includes(vowel.toLowerCase());

export const DIAERESIS_VOWEL = ["ü"];
export const isAccentedWeakVowelWithDiaresis = (vowel: string = ""): boolean =>
  [...ACCENTED_WEAK_VOWEL, ...DIAERESIS_VOWEL].includes(vowel.toLowerCase());

export const STRONG_VOWELS = ["a", "á", "à", "e", "é", "è", "í", "ì", "o", "ó", "ò", "ú", "ù"];
export const isStrongVowel = (vowel: string = ""): boolean => STRONG_VOWELS.includes(vowel.toLowerCase());

export const WEAK_VOWELS = ["i", "u", "ü"];
export const isWeakVowel = (vowel: string = ""): boolean => STRONG_VOWELS.includes(vowel.toLowerCase());

export const isConsonant = (consonant: string = ""): boolean => !isStrongVowel(consonant) && !isWeakVowel(consonant);
