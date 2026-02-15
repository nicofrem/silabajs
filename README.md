# SilabaJS

Spanish syllable analysis library — splits any Spanish word into syllables and provides accentuation type, hiatus, diphthongs and triphthongs.

## Install

```bash
npm install silabajs
```

## Usage

```typescript
import { getSyllables } from 'silabajs';

const result = getSyllables('murciélago');
```

### Output

```json
{
  "word": "murciélago",
  "wordLength": 10,
  "syllableCount": 4,
  "syllables": [
    { "syllable": "mur", "startIndex": 0 },
    { "syllable": "cié", "startIndex": 3 },
    { "syllable": "la", "startIndex": 6 },
    { "syllable": "go", "startIndex": 8 }
  ],
  "tonicSyllable": 2,
  "accentedLetterIndex": 4,
  "accentuation": "proparoxytone",
  "hiatus": [],
  "diphthongs": [
    { "type": "rising", "combination": "ie" }
  ],
  "triphthongs": []
}
```

## API

### `getSyllables(word: string): SyllableResult`

Returns a `SyllableResult` object with:

| Property | Type | Description |
|---|---|---|
| `word` | `string` | Lowercased, trimmed input |
| `wordLength` | `number` | Character count |
| `syllableCount` | `number` | Number of syllables |
| `syllables` | `SyllableInfo[]` | Each syllable with its start index |
| `tonicSyllable` | `number` | Position of stressed syllable (1-indexed) |
| `accentedLetterIndex` | `number` | Index of accented letter (-1 if none) |
| `accentuation` | `AccentuationType` | `'oxytone'` \| `'paroxytone'` \| `'proparoxytone'` \| `'superproparoxytone'` |
| `hiatus` | `HiatusInfo[]` | Detected hiatus (simple or accentual) |
| `diphthongs` | `DiphthongInfo[]` | Detected diphthongs (rising, falling, homogeneous) |
| `triphthongs` | `TriphthongInfo[]` | Detected triphthongs |

### Accentuation types

| Type | Spanish | Example |
|---|---|---|
| `oxytone` | Aguda | café, reloj |
| `paroxytone` | Grave (Llana) | casa, lápiz |
| `proparoxytone` | Esdrújula | murciélago, teléfono |
| `superproparoxytone` | Sobresdrújula | dígamelo |

## Development

```bash
npm install
npm test          # run tests
npm run build     # build ESM + CJS + types
npm run lint      # type-check
```

## License

MIT — Nicolás Cofré Méndez
