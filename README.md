# SilabaJS

Librería para el análisis silábico de palabras en español. Separa cualquier palabra en sílabas e identifica acentuación, hiatos, diptongos y triptongos.

**Zero dependencies** · ESM + CJS · Tipado completo en TypeScript

## Instalación

```bash
npm install silabajs
```

```bash
pnpm add silabajs
```

```bash
yarn add silabajs
```

## Uso rápido

```typescript
import { getSyllables } from "silabajs";

const resultado = getSyllables("murciélago");
// → { syllables: ['mur', 'cié', 'la', 'go'], accentuation: 'proparoxytone', ... }
```

## Ejemplo completo

```typescript
import { getSyllables, ACCENT_LABELS, DIPHTHONG_LABELS } from "silabajs";

const r = getSyllables("murciélago");

console.log(r.word); // "murciélago"
console.log(r.syllableCount); // 4
console.log(r.syllables);
// [
//   { syllable: "mur", startIndex: 0 },
//   { syllable: "cié", startIndex: 3 },
//   { syllable: "la",  startIndex: 6 },
//   { syllable: "go",  startIndex: 8 }
// ]

console.log(r.accentuation); // "proparoxytone"
console.log(ACCENT_LABELS[r.accentuation]); // "Esdrújula"

console.log(r.tonicSyllable); // 2  (1-indexed desde la última)
console.log(r.accentedLetterIndex); // 4  (índice de 'é' en la palabra)

console.log(r.diphthongs);
// [{ type: "rising", combination: "ie" }]

console.log(r.hiatus); // []
console.log(r.triphthongs); // []
```

## API

### `getSyllables(word: string): SyllableResult`

Recibe una palabra en español y retorna su análisis silábico completo.

La entrada se normaliza automáticamente a minúsculas y sin espacios laterales.

### `SyllableResult`

| Propiedad             | Tipo               | Descripción                                              |
| --------------------- | ------------------ | -------------------------------------------------------- |
| `word`                | `string`           | Palabra normalizada (minúsculas, sin espacios)           |
| `wordLength`          | `number`           | Cantidad de caracteres                                   |
| `syllableCount`       | `number`           | Cantidad de sílabas                                      |
| `syllables`           | `SyllableInfo[]`   | Cada sílaba con su índice de inicio en la palabra        |
| `tonicSyllable`       | `number`           | Posición de la sílaba tónica (1-indexed desde la última) |
| `accentedLetterIndex` | `number`           | Índice de la letra acentuada (-1 si no tiene tilde)      |
| `accentuation`        | `AccentuationType` | Tipo de acentuación                                      |
| `hiatus`              | `HiatusInfo[]`     | Hiatos detectados                                        |
| `diphthongs`          | `DiphthongInfo[]`  | Diptongos detectados                                     |
| `triphthongs`         | `TriphthongInfo[]` | Triptongos detectados                                    |

### Tipos de acentuación — `AccentuationType`

| Valor                | Español       | Ejemplo              |
| -------------------- | ------------- | -------------------- |
| `oxytone`            | Aguda         | café, reloj          |
| `paroxytone`         | Grave (Llana) | casa, lápiz          |
| `proparoxytone`      | Esdrújula     | murciélago, teléfono |
| `superproparoxytone` | Sobresdrújula | dígamelo             |

### Tipos de diptongo — `DiphthongType`

| Valor         | Español     | Ejemplo             |
| ------------- | ----------- | ------------------- |
| `rising`      | Creciente   | _ie_ en c**ie**lo   |
| `falling`     | Decreciente | _ai_ en b**ai**le   |
| `homogeneous` | Homogéneo   | _ui_ en c**ui**dado |

### Tipos de hiato — `HiatusType`

| Valor       | Español  | Ejemplo                |
| ----------- | -------- | ---------------------- |
| `simple`    | Simple   | _ae_ en a**e**ropuerto |
| `accentual` | Acentual | _ía_ en d**ía**        |

### Labels en español

La librería exporta mapas para convertir los valores en inglés a sus nombres en español:

```typescript
import { ACCENT_LABELS, DIPHTHONG_LABELS, HIATUS_LABELS } from "silabajs";

ACCENT_LABELS.oxytone; // "Aguda"
ACCENT_LABELS.proparoxytone; // "Esdrújula"
DIPHTHONG_LABELS.rising; // "Creciente"
HIATUS_LABELS.accentual; // "Acentual"
```

### Tipos exportados

```typescript
import type {
  SyllableResult,
  SyllableInfo,
  AccentuationType,
  HiatusInfo,
  HiatusType,
  DiphthongInfo,
  DiphthongType,
  TriphthongInfo,
} from "silabajs";
```

## Licencia

MIT — Nicolás Cofré Méndez
