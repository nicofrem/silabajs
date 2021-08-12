import { isStrongVowel, isConsonant } from "./lettersHelper";
import accentName from "./accentName";
import onset from "./onset";

(function () {
  // Objeto con metodo que se utilizará globalmente
  const silabaJS = {
    getSilabas,
  };

  // Declaración de Variables
  const silaba = {
    palabra: undefined, // (String) Palabra ingresada
    longitudPalabra: undefined, // (int)    Longitud de la palabra
    numeroSilaba: undefined, // (int)    Número de silabas de la palabra
    silabas: undefined, // (Array)  Array de objeto que contiene la silaba (caracter) y la posicion en la palabra
    tonica: undefined, // (int)    Posición de la silaba tónica (empieza en 1)
    letraTildada: undefined, // (int)    Posición de la letra tildada (si la hay)
    acentuacion: undefined, // (int)    Tipo acentuacion de la palabra (Aguda, Grave, Esdrujula y Sobresdrujula)
    hiato: undefined, // (Array)  Array de objeto que contiene hiato (si la hay)
    diptongo: undefined, // (Array)  Array de objeto que contiene diptongo (si la hay)
    triptongo: undefined, // (Array)  Array de objeto que contiene triptongo (si la hay)
  };

  let encontroTonica; // (bool)   Indica si se ha encontrado la silaba tónica

  /**
   * Devuelve Objeto 'silaba' con los valores calculados
   *
   * @param {string} palabra
   * @returns {Object}
   */
  function getSilabas(palabra) {
    posicionSilabas(palabra);
    // TODO - NUMBER
    accentName(0);
    hiato();
    diptongoTriptongo();
    return { ...silaba };
  }

  /** ****************************************************** */
  /** ****************************************************** */
  //                  METODOS INTERNOS                     //
  /** ****************************************************** */
  /** ****************************************************** */

  /**
   * Realiza calculo de las sílabas
   *
   * @param {string} palabra
   * @returns {undefined}
   */
  function posicionSilabas(palabra) {
    silaba.palabra = palabra.toLowerCase().trim();
    silaba.silabas = [];

    silaba.longitudPalabra = silaba.palabra.length;
    encontroTonica = false;
    silaba.tonica = 0;
    silaba.numeroSilaba = 0;
    silaba.letraTildada = -1;

    // Variable que almacena silaba y la pocision de la silaba
    let silabaAux;

    // Se recorre la palabra buscando las sílabas
    for (let actPos = 0; actPos < silaba.longitudPalabra; ) {
      silaba.numeroSilaba++;
      silabaAux = {};
      silabaAux.inicioPosicion = actPos;

      // Las sílabas constan de tres partes: ataque, núcleo y coda
      actPos = onset(silaba.palabra, actPos);
      actPos = nucleo(silaba.palabra, actPos);
      actPos = coda(silaba.palabra, actPos);

      // Obtiene y silaba de la palabra
      silabaAux.silaba = silaba.palabra.substring(silabaAux.inicioPosicion, actPos);

      // Guarda silaba de la palabra
      silaba.silabas.push(silabaAux);

      if (encontroTonica && silaba.tonica == 0) {
        silaba.tonica = silaba.numeroSilaba;
      } // Marca la silaba tónica
    }

    // Si no se ha encontrado la sílaba tónica (no hay tilde), se determina en base a
    // las reglas de acentuación
    if (!encontroTonica) {
      if (silaba.numeroSilaba < 2) {
        silaba.tonica = silaba.numeroSilaba; // Monosílabos
      } else {
        // Polisílabos
        const letraFinal = silaba.palabra[silaba.longitudPalabra - 1];
        const letraAnterior = silaba.palabra[silaba.longitudPalabra - 2];

        if (
          !isConsonant(letraFinal) ||
          letraFinal == "y" ||
          letraFinal == "n" ||
          (letraFinal == "s" && !isConsonant(letraAnterior))
        ) {
          silaba.tonica = silaba.numeroSilaba - 1; // Palabra llana
        } else {
          silaba.tonica = silaba.numeroSilaba; // Palabra aguda
        }
      }
    }
  }

  /**
   * Determina el núcleo de la silaba de pal cuyo ataque termina en pos - 1
   * y avanza pos hasta la posición siguiente al final de dicho núcleo
   *
   * @param {string} pal
   * @param {int} pos
   * @returns {int}
   */
  function nucleo(pal, pos) {
    // Sirve para saber el tipo de vocal anterior cuando hay dos seguidas
    let anterior = 0;
    let c;

    // 0 = fuerte
    // 1 = débil acentuada
    // 2 = débil

    if (pos >= silaba.longitudPalabra) return pos; // ¡¿No tiene núcleo?!

    // Se salta una 'y' al principio del núcleo, considerándola consonante
    if (pal[pos] == "y") pos++;

    // Primera vocal
    if (pos < silaba.longitudPalabra) {
      c = pal[pos];
      switch (c) {
        // Vocal fuerte o débil acentuada
        case "á":
        case "Á":
        case "à":
        case "À":
        case "é":
        case "É":
        case "è":
        case "È":
        case "ó":
        case "Ó":
        case "ò":
        case "Ò":
          silaba.letraTildada = pos;
          encontroTonica = true;
          anterior = 0;
          pos++;
          break;
        // Vocal fuerte
        case "a":
        case "A":
        case "e":
        case "E":
        case "o":
        case "O":
          anterior = 0;
          pos++;
          break;
        // Vocal débil acentuada, rompe cualquier posible diptongo
        case "í":
        case "Í":
        case "ì":
        case "Ì":
        case "ú":
        case "Ú":
        case "ù":
        case "Ù":
        case "ü":
        case "Ü":
          silaba.letraTildada = pos;
          anterior = 1;
          pos++;
          encontroTonica = true;
          return pos;
          break;
        // Vocal débil
        case "i":
        case "I":
        case "u":
        case "U":
          anterior = 2;
          pos++;
          break;
      }
    }

    // 'h' intercalada en el núcleo, no condiciona diptongos o hiatos
    let hache = false;
    if (pos < silaba.longitudPalabra) {
      if (pal[pos] == "h") {
        pos++;
        hache = true;
      }
    }

    // Segunda vocal
    if (pos < silaba.longitudPalabra) {
      c = pal[pos];
      switch (c) {
        // Vocal fuerte o débil acentuada
        case "á":
        case "Á":
        case "à":
        case "À":
        case "é":
        case "É":
        case "è":
        case "È":
        case "ó":
        case "Ó":
        case "ò":
        case "Ò":
          silaba.letraTildada = pos;
          if (anterior != 0) {
            encontroTonica = true;
          }
          if (anterior == 0) {
            // Dos vocales fuertes no forman silaba
            if (hache) pos--;
            return pos;
          }

          pos++;

          break;
        // Vocal fuerte
        case "a":
        case "A":
        case "e":
        case "E":
        case "o":
        case "O":
          if (anterior == 0) {
            // Dos vocales fuertes no forman silaba
            if (hache) pos--;
            return pos;
          }

          pos++;

          break;

        // Vocal débil acentuada, no puede haber triptongo, pero si diptongo
        case "í":
        case "Í":
        case "ì":
        case "Ì":
        case "ú":
        case "Ú":
        case "ù":
        case "Ù":
          silaba.letraTildada = pos;

          if (anterior != 0) {
            // Se forma diptongo
            encontroTonica = true;
            pos++;
          } else if (hache) pos--;

          return pos;

          break;
        // Vocal débil
        case "i":
        case "I":
        case "u":
        case "U":
        case "ü":
        case "Ü":
          if (pos < silaba.longitudPalabra - 1) {
            // ¿Hay tercera vocal?
            const siguiente = pal[pos + 1];
            if (!isConsonant(siguiente)) {
              const letraAnterior = pal[pos - 1];
              if (letraAnterior == "h") pos--;
              return pos;
            }
          }

          // dos vocales débiles iguales no forman diptongo
          if (pal[pos] != pal[pos - 1]) pos++;

          // Es un diptongo plano o descendente
          return pos;
      }
    }

    // ¿tercera vocal?
    if (pos < silaba.longitudPalabra) {
      c = pal[pos];
      if (c == "i" || c == "u") {
        // Vocal débil
        pos++;
        return pos; // Es un triptongo
      }
    }

    return pos;
  }

  /**
   * Determina la coda de la silaba de pal cuyo núcleo termina en pos - 1
   * y avanza pos hasta la posición siguiente al final de dicha coda
   *
   * @param {string} pal
   * @param {int} pos
   * @returns {int}
   */
  function coda(pal, pos) {
    if (pos >= silaba.longitudPalabra || !isConsonant(pal[pos])) return pos; // No hay coda

    if (pos == silaba.longitudPalabra - 1) {
      // Final de palabra
      pos++;
      return pos;
    }

    // Si sólo hay una consonante entre vocales, pertenece a la siguiente silaba
    if (!isConsonant(pal[pos + 1])) return pos;

    const c1 = pal[pos];
    const c2 = pal[pos + 1];

    // ¿Existe posibilidad de una tercera consonante consecutina?
    if (pos < silaba.longitudPalabra - 2) {
      const c3 = pal[pos + 2];

      if (!isConsonant(c3)) {
        // No hay tercera consonante
        // Los grupos ll, lh, ph, ch y rr comienzan silaba

        if (c1 == "l" && c2 == "l") return pos;
        if (c1 == "c" && c2 == "h") return pos;
        if (c1 == "r" && c2 == "r") return pos;

        /// ////// grupos nh, sh, rh, hl son ajenos al español(DPD)
        if (c1 != "s" && c1 != "r" && c2 == "h") return pos;

        // Si la y está precedida por s, l, r, n o c (consonantes alveolares),
        // una nueva silaba empieza en la consonante previa, si no, empieza en la y
        if (c2 == "y") {
          if (c1 == "s" || c1 == "l" || c1 == "r" || c1 == "n" || c1 == "c") return pos;

          pos++;
          return pos;
        }

        // gkbvpft + l
        if (
          (c1 == "b" || c1 == "v" || c1 == "c" || c1 == "k" || c1 == "f" || c1 == "g" || c1 == "p" || c1 == "t") &&
          c2 == "l"
        ) {
          return pos;
        }

        // gkdtbvpf + r

        if (
          (c1 == "b" ||
            c1 == "v" ||
            c1 == "c" ||
            c1 == "d" ||
            c1 == "k" ||
            c1 == "f" ||
            c1 == "g" ||
            c1 == "p" ||
            c1 == "t") &&
          c2 == "r"
        ) {
          return pos;
        }

        pos++;
        return pos;
      }
      // Hay tercera consonante
      if (pos + 3 == silaba.longitudPalabra) {
        // Tres consonantes al final ¿palabras extranjeras?
        if (c2 == "y") {
          // 'y' funciona como vocal
          if (c1 == "s" || c1 == "l" || c1 == "r" || c1 == "n" || c1 == "c") return pos;
        }

        if (c3 == "y") {
          // 'y' final funciona como vocal con c2
          pos++;
        } else {
          // Tres consonantes al final ¿palabras extranjeras?
          pos += 3;
        }
        return pos;
      }

      if (c2 == "y") {
        // 'y' funciona como vocal
        if (c1 == "s" || c1 == "l" || c1 == "r" || c1 == "n" || c1 == "c") return pos;

        pos++;
        return pos;
      }

      // Los grupos pt, ct, cn, ps, mn, gn, ft, pn, cz, tz, ts comienzan silaba (Bezos)

      if (
        (c2 == "p" && c3 == "t") ||
        (c2 == "c" && c3 == "t") ||
        (c2 == "c" && c3 == "n") ||
        (c2 == "p" && c3 == "s") ||
        (c2 == "m" && c3 == "n") ||
        (c2 == "g" && c3 == "n") ||
        (c2 == "f" && c3 == "t") ||
        (c2 == "p" && c3 == "n") ||
        (c2 == "c" && c3 == "z") ||
        (c2 == "t" && c3 == "z") ||
        (c2 == "t" && c3 == "s")
      ) {
        pos++;
        return pos;
      }

      if (
        c3 == "l" ||
        c3 == "r" || // Los grupos consonánticos formados por una consonante
        // seguida de 'l' o 'r' no pueden separarse y siempre inician
        // sílaba
        (c2 == "c" && c3 == "h") || // 'ch'
        c3 == "y"
      ) {
        // 'y' funciona como vocal
        pos++; // Siguiente sílaba empieza en c2
      } else pos += 2; // c3 inicia la siguiente sílaba
    } else {
      if (c2 == "y") return pos;

      pos += 2; // La palabra acaba con dos consonantes
    }

    return pos;
  }

  /**
   * Determina si se forma hiato/s
   *
   * @returns {undefined}
   */
  function hiato() {
    let vocalFuerteAnterior = false; // Almacena el tipo de vocal (Fuerte o Debil)
    silaba.hiato = [];

    // La 'u' de "qu" no forma hiato
    if (
      silaba.letraTildada > 1 &&
      silaba.palabra[silaba.letraTildada - 1] == "u" &&
      silaba.palabra[silaba.letraTildada - 2] == "q"
    ) {
      silaba.hiato.push({
        tipoHiato: "Hiato simple",
        silabaHiato: `${silaba.palabra[silaba.letraTildada]}-${silaba.palabra[silaba.letraTildada + 1]}`,
      });
    }

    for (let i = 0; i < silaba.palabra.length; i++) {
      // Hiato Acentual
      if ("íìúù".indexOf(silaba.palabra[i]) > -1) {
        if (i > 0 && isStrongVowel(silaba.palabra[i - 1])) {
          silaba.hiato.push({
            tipoHiato: "Hiato acentual",
            silabaHiato: `${silaba.palabra[i - 1]}-${silaba.palabra[i]}`,
          });
          vocalFuerteAnterior = false;
          continue;
        }

        if (i < silaba.longitudPalabra - 1 && isStrongVowel(silaba.palabra[i + 1])) {
          silaba.hiato.push({
            tipoHiato: "Hiato acentual",
            silabaHiato: `${silaba.palabra[i]}-${silaba.palabra[i + 1]}`,
          });
          vocalFuerteAnterior = false;
          continue;
        }
      }

      // Hiato Simple
      if (vocalFuerteAnterior && isStrongVowel(silaba.palabra[i])) {
        silaba.hiato.push({
          tipoHiato: "Hiato simple",
          silabaHiato: `${silaba.palabra[i - 1]}-${silaba.palabra[i]}`,
        });
      }

      // Hiato Simple con 'h' intermedio
      if (vocalFuerteAnterior && silaba.palabra[i] === "h" && isStrongVowel(silaba.palabra[i + 1])) {
        silaba.hiato.push({
          tipoHiato: "Hiato simple",
          silabaHiato: `${silaba.palabra[i - 1]}-h${silaba.palabra[i + 1]}`,
        });
      }

      vocalFuerteAnterior = isStrongVowel(silaba.palabra[i]);
    }
  }

  /**
   * Determina si se forma triptongo/s y diptongo/s
   *
   * @returns {undefined}
   */
  function diptongoTriptongo() {
    silaba.diptongo = [];
    silaba.triptongo = [];

    // Vocal Debil = VD
    // Vocal Fuerte = VF

    let expresion;

    for (let i = 0; i < silaba.silabas.length; i++) {
      // Triptongo (VD - VF - VD) = ((i|u)(a|e|o)(i|u))
      expresion = /((i|u)(a|e|o)(i|u))/g;
      if (silaba.silabas[i].silaba.match(expresion)) {
        silaba.triptongo.push({
          tipo: "Triptongo",
          silaba: silaba.silabas[i].silaba.match(expresion)[0],
        });
        continue;
      }

      // Diptongo Creciente (VD - VF) = ((i|u)(a|e|o))
      expresion = /((i|u)(a|e|o))/g;
      if (silaba.silabas[i].silaba.match(expresion)) {
        silaba.diptongo.push({
          tipo: "Diptongo Creciente",
          silaba: silaba.silabas[i].silaba.match(expresion)[0],
        });
        continue;
      }

      // Diptongo Drececiente (VF - VD) : ((a|e|o)(i|u))
      expresion = /((a|e|o)(i|u))/g;
      if (silaba.silabas[i].silaba.match(expresion)) {
        silaba.diptongo.push({
          tipo: "Diptongo Drececiente",
          silaba: silaba.silabas[i].silaba.match(expresion)[0],
        });
        continue;
      }

      // Diptongo Homogeneo (VD - VD) : ((i|u)(i|u))
      expresion = /((i|u)(i|u))/g;
      if (silaba.silabas[i].silaba.match(expresion)) {
        silaba.diptongo.push({
          tipo: "Diptongo Homogéneos",
          silaba: silaba.silabas[i].silaba.match(expresion)[0],
        });
      }
    }
  }

  // Valida si el objeto está declarado
  if (typeof window.silabaJS === "undefined") {
    window.silabaJS = silabaJS;
  }
})();
