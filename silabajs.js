(function () {
    'use strict';

    // Objeto con metodo que se utilizará globalmente
    var silabaJS = {
        getSilabas: getSilabas
    };

    // Declaración de Variables
    var silaba = {
        palabra: undefined,         // (String) Palabra ingresada
        longitudPalabra: undefined, // (int)    Longitud de la palabra
        numeroSilaba: undefined,    // (int)    Número de silabas de la palabra
        silabas: undefined,         // (Array)  Array de objeto que contiene la silaba (caracter) y la posicion en la palabra
        tonica: undefined,          // (int)    Posición de la silaba tónica (empieza en 1)
        letraTildada: undefined,    // (int)    Posición de la letra tildada (si la hay)
        acentuacion: undefined,     // (int)    Tipo acentuacion de la palabra (Aguda, Grave, Esdrujula y Sobresdrujula)
        hiato: undefined,           // (Array)  Array de objeto que contiene hiato (si la hay)
        diptongo: undefined,        // (Array)  Array de objeto que contiene diptongo (si la hay)
        triptongo: undefined        // (Array)  Array de objeto que contiene triptongo (si la hay)
    };

    var encontroTonica = undefined; // (bool)   Indica si se ha encontrado la silaba tónica


    /**
     * Devuelve Objeto 'silaba' con los valores calculados
     *
     * @param {string} palabra
     * @returns {Object}
     */
    function getSilabas(palabra) {
        posicionSilabas(palabra);
        acentuacion();
        hiato();
        diptongoTriptongo();
        return Object.assign({}, silaba);
    }


    /*********************************************************/
    /*********************************************************/
    //                  METODOS INTERNOS                     //
    /*********************************************************/
    /*********************************************************/

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
        var silabaAux;

        // Se recorre la palabra buscando las sílabas
        for (var actPos = 0; actPos < silaba.longitudPalabra;) {

            silaba.numeroSilaba++;
            silabaAux = {};
            silabaAux.inicioPosicion = actPos;

            // Las sílabas constan de tres partes: ataque, núcleo y coda
            actPos = ataque(silaba.palabra, actPos);
            actPos = nucleo(silaba.palabra, actPos);
            actPos = coda(silaba.palabra, actPos);

            // Obtiene y silaba de la palabra
            silabaAux.silaba = silaba.palabra.substring(silabaAux.inicioPosicion, actPos);

            // Guarda silaba de la palabra
            silaba.silabas.push(silabaAux);

            if ((encontroTonica) && (silaba.tonica == 0))
                silaba.tonica = silaba.numeroSilaba; // Marca la silaba tónica

        }

        // Si no se ha encontrado la sílaba tónica (no hay tilde), se determina en base a
        // las reglas de acentuación
        if (!encontroTonica) {

            if (silaba.numeroSilaba < 2) {

                silaba.tonica = silaba.numeroSilaba;  // Monosílabos

            } else {                                  // Polisílabos

                var letraFinal = silaba.palabra[silaba.longitudPalabra - 1];
                var letraAnterior = silaba.palabra[silaba.longitudPalabra - 2];

                if ((!esConsonante(letraFinal) || (letraFinal == 'y')) ||
                    (((letraFinal == 'n') || (letraFinal == 's') && !esConsonante(letraAnterior)))) {

                    silaba.tonica = silaba.numeroSilaba - 1;	// Palabra llana

                } else {
                    silaba.tonica = silaba.numeroSilaba;		// Palabra aguda
                }

            }
        }

    }

    /**
     * Determina el ataque de la silaba de pal que empieza en pos y avanza
     * pos hasta la posición siguiente al final de dicho ataque
     *
     * @param {string} pal
     * @param {int} pos
     * @returns {int}
     */
    function ataque(pal, pos) {

        // Se considera que todas las consonantes iniciales forman parte del ataque
        var ultimaConsonante = 'a';

        while ((pos < silaba.longitudPalabra) && ((esConsonante(pal [pos])) && (pal [pos] != 'y'))) {
            ultimaConsonante = pal [pos];
            pos++;
        }

        // (q | g) + u (ejemplo: queso, gueto)
        if (pos < silaba.longitudPalabra - 1)
            if (pal [pos] == 'u') {
                if (ultimaConsonante == 'q')
                    pos++;
                else if (ultimaConsonante == 'g') {
                    var letra = pal [pos + 1];
                    if ((letra == 'e') || (letra == 'é') || (letra == 'i') || (letra == 'í'))
                        pos++;
                }
            }
            else { // La u con diéresis se añade a la consonante
                if ((pal[pos] === 'ü') || (pal[pos] == 'Ü'))
                    if (ultimaConsonante == 'g')
                        pos++;
            }

        return pos;
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
        var anterior = 0;
        var c;

        // 0 = fuerte
        // 1 = débil acentuada
        // 2 = débil

        if (pos >= silaba.longitudPalabra)
            return pos; // ¡¿No tiene núcleo?!

        // Se salta una 'y' al principio del núcleo, considerándola consonante
        if (pal[pos] == 'y')
            pos++;

        // Primera vocal
        if (pos < silaba.longitudPalabra) {
            c = pal[pos];
            switch (c) {
                // Vocal fuerte o débil acentuada
                case 'á':
                case 'Á':
                case 'à':
                case 'À':
                case 'é':
                case 'É':
                case 'è':
                case 'È':
                case 'ó':
                case 'Ó':
                case 'ò':
                case 'Ò':
                    silaba.letraTildada = pos;
                    encontroTonica = true;
                    anterior = 0;
                    pos++;
                    break;
                // Vocal fuerte
                case 'a':
                case 'A':
                case 'e':
                case 'E':
                case 'o':
                case 'O':
                    anterior = 0;
                    pos++;
                    break;
                // Vocal débil acentuada, rompe cualquier posible diptongo
                case 'í':
                case 'Í':
                case 'ì':
                case 'Ì':
                case 'ú':
                case 'Ú':
                case 'ù':
                case 'Ù':
                case 'ü':
                case 'Ü':
                    silaba.letraTildada = pos;
                    anterior = 1;
                    pos++;
                    encontroTonica = true;
                    return pos;
                    break;
                // Vocal débil
                case 'i':
                case 'I':
                case 'u':
                case 'U':
                    anterior = 2;
                    pos++;
                    break;
            }
        }

        // 'h' intercalada en el núcleo, no condiciona diptongos o hiatos
        var hache = false;
        if (pos < silaba.longitudPalabra) {
            if (pal[pos] == 'h') {
                pos++;
                hache = true;
            }
        }

        // Segunda vocal
        if (pos < silaba.longitudPalabra) {
            c = pal[pos];
            switch (c) {
                // Vocal fuerte o débil acentuada
                case 'á':
                case 'Á':
                case 'à':
                case 'À':
                case 'é':
                case 'É':
                case 'è':
                case 'È':
                case 'ó':
                case 'Ó':
                case 'ò':
                case 'Ò':

                    silaba.letraTildada = pos;
                    if (anterior != 0) {
                        encontroTonica = true;
                    }
                    if (anterior == 0) {    // Dos vocales fuertes no forman silaba
                        if (hache)
                            pos--;
                        return pos;
                    }
                    else {
                        pos++;
                    }

                    break;
                // Vocal fuerte
                case 'a':
                case 'A':
                case 'e':
                case 'E':
                case 'o':
                case 'O':

                    if (anterior == 0) {    // Dos vocales fuertes no forman silaba
                        if (hache)
                            pos--;
                        return pos;
                    }
                    else {
                        pos++;
                    }

                    break;

                // Vocal débil acentuada, no puede haber triptongo, pero si diptongo
                case 'í':
                case 'Í':
                case 'ì':
                case 'Ì':
                case 'ú':
                case 'Ú':
                case 'ù':
                case 'Ù':

                    silaba.letraTildada = pos;

                    if (anterior != 0) {  // Se forma diptongo
                        encontroTonica = true;
                        pos++;
                    }
                    else if (hache)
                        pos--;

                    return pos;

                    break;
                // Vocal débil
                case 'i':
                case 'I':
                case 'u':
                case 'U':
                case 'ü':
                case 'Ü':
                    if (pos < silaba.longitudPalabra - 1) { // ¿Hay tercera vocal?
                        var siguiente = pal [pos + 1];
                        if (!esConsonante(siguiente)) {
                            var letraAnterior = pal[pos - 1];
                            if (letraAnterior == 'h')
                                pos--;
                            return pos;
                        }
                    }

                    // dos vocales débiles iguales no forman diptongo
                    if (pal [pos] != pal [pos - 1])
                        pos++;

                    // Es un diptongo plano o descendente
                    return pos;
            }
        }

        // ¿tercera vocal?
        if (pos < silaba.longitudPalabra) {
            c = pal[pos];
            if ((c == 'i') || (c == 'u')) { // Vocal débil
                pos++;
                return pos;  // Es un triptongo
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
        if ((pos >= silaba.longitudPalabra) || (!esConsonante(pal[pos])))
            return pos; // No hay coda
        else {
            if (pos == silaba.longitudPalabra - 1) // Final de palabra
            {
                pos++;
                return pos;
            }

            // Si sólo hay una consonante entre vocales, pertenece a la siguiente silaba
            if (!esConsonante(pal [pos + 1])) return pos;

            var c1 = pal[pos];
            var c2 = pal[pos + 1];

            // ¿Existe posibilidad de una tercera consonante consecutina?
            if ((pos < silaba.longitudPalabra - 2)) {
                var c3 = pal [pos + 2];

                if (!esConsonante(c3)) { // No hay tercera consonante
                    // Los grupos ll, lh, ph, ch y rr comienzan silaba

                    if ((c1 == 'l') && (c2 == 'l'))
                        return pos;
                    if ((c1 == 'c') && (c2 == 'h'))
                        return pos;
                    if ((c1 == 'r') && (c2 == 'r'))
                        return pos;

                    ///////// grupos nh, sh, rh, hl son ajenos al español(DPD)
                    if ((c1 != 's') && (c1 != 'r') &&
                        (c2 == 'h'))
                        return pos;

                    // Si la y está precedida por s, l, r, n o c (consonantes alveolares),
                    // una nueva silaba empieza en la consonante previa, si no, empieza en la y
                    if ((c2 == 'y')) {
                        if ((c1 == 's') || (c1 == 'l') || (c1 == 'r') || (c1 == 'n') || (c1 == 'c'))
                            return pos;

                        pos++;
                        return pos;
                    }

                    // gkbvpft + l
                    if ((((c1 == 'b') || (c1 == 'v') || (c1 == 'c') || (c1 == 'k') ||
                            (c1 == 'f') || (c1 == 'g') || (c1 == 'p') || (c1 == 't')) &&
                            (c2 == 'l')
                        )
                    ) {
                        return pos;
                    }

                    // gkdtbvpf + r

                    if ((((c1 == 'b') || (c1 == 'v') || (c1 == 'c') || (c1 == 'd') || (c1 == 'k') ||
                            (c1 == 'f') || (c1 == 'g') || (c1 == 'p') || (c1 == 't')) &&
                            (c2 == 'r')
                        )
                    ) {
                        return pos;
                    }

                    pos++;
                    return pos;
                }
                else { // Hay tercera consonante
                    if ((pos + 3) == silaba.longitudPalabra) { // Tres consonantes al final ¿palabras extranjeras?
                        if ((c2 == 'y')) { // 'y' funciona como vocal
                            if ((c1 == 's') || (c1 == 'l') || (c1 == 'r') || (c1 == 'n') || (c1 == 'c'))
                                return pos;
                        }

                        if (c3 == 'y') { // 'y' final funciona como vocal con c2
                            pos++;
                        }
                        else {	// Tres consonantes al final ¿palabras extranjeras?
                            pos += 3;
                        }
                        return pos;
                    }

                    if ((c2 == 'y')) { // 'y' funciona como vocal
                        if ((c1 == 's') || (c1 == 'l') || (c1 == 'r') || (c1 == 'n') || (c1 == 'c'))
                            return pos;

                        pos++;
                        return pos;
                    }

                    // Los grupos pt, ct, cn, ps, mn, gn, ft, pn, cz, tz, ts comienzan silaba (Bezos)

                    if ((c2 == 'p') && (c3 == 't') ||
                        (c2 == 'c') && (c3 == 't') ||
                        (c2 == 'c') && (c3 == 'n') ||
                        (c2 == 'p') && (c3 == 's') ||
                        (c2 == 'm') && (c3 == 'n') ||
                        (c2 == 'g') && (c3 == 'n') ||
                        (c2 == 'f') && (c3 == 't') ||
                        (c2 == 'p') && (c3 == 'n') ||
                        (c2 == 'c') && (c3 == 'z') ||
                        (c2 == 't') && (c3 == 'z') ||
                        (c2 == 't') && (c3 == 's')) {
                        pos++;
                        return pos;
                    }

                    if ((c3 == 'l') || (c3 == 'r') ||    // Los grupos consonánticos formados por una consonante
                        // seguida de 'l' o 'r' no pueden separarse y siempre inician
                        // sílaba
                        ((c2 == 'c') && (c3 == 'h')) ||  // 'ch'
                        (c3 == 'y')) {                   // 'y' funciona como vocal
                        pos++;  // Siguiente sílaba empieza en c2
                    }
                    else
                        pos += 2; // c3 inicia la siguiente sílaba
                }
            }
            else {
                if ((c2 == 'y')) return pos;

                pos += 2; // La palabra acaba con dos consonantes
            }
        }
        return pos;
    }

    /**
     * Determina si se forma hiato/s
     *
     * @returns {undefined}
     */
    function hiato() {

        var vocalFuerteAnterior = false; // Almacena el tipo de vocal (Fuerte o Debil)
        silaba.hiato = [];

        // La 'u' de "qu" no forma hiato
        if ((silaba.letraTildada > 1) && (silaba.palabra[silaba.letraTildada - 1] == 'u') && (silaba.palabra[silaba.letraTildada - 2] == 'q')) {
            silaba.hiato.push({
                tipoHiato: 'Hiato simple',
                silabaHiato: silaba.palabra[silaba.letraTildada] + '-' + silaba.palabra[silaba.letraTildada + 1]
            });
        }

        for (var i = 0; i < silaba.palabra.length; i++) {

            // Hiato Acentual
            if ('íìúù'.indexOf(silaba.palabra[i]) > -1) {

                if (((i > 0) && vocalFuerte(silaba.palabra[i - 1]))) {
                    silaba.hiato.push({
                        tipoHiato: 'Hiato acentual',
                        silabaHiato: silaba.palabra[i - 1] + '-' + silaba.palabra[i]
                    });
                    vocalFuerteAnterior = false;
                    continue;
                }

                if (((i < (silaba.longitudPalabra - 1)) && vocalFuerte(silaba.palabra[i + 1]))) {
                    silaba.hiato.push({
                        tipoHiato: 'Hiato acentual',
                        silabaHiato: silaba.palabra[i] + '-' + silaba.palabra[i + 1]
                    });
                    vocalFuerteAnterior = false;
                    continue;
                }

            }

            // Hiato Simple
            if (vocalFuerteAnterior && vocalFuerte(silaba.palabra[i])) {
                silaba.hiato.push({
                    tipoHiato: 'Hiato simple',
                    silabaHiato: silaba.palabra[i - 1] + '-' + silaba.palabra[i]
                });
            }

            // Hiato Simple con 'h' intermedio
            if (vocalFuerteAnterior && silaba.palabra[i] === 'h' && vocalFuerte(silaba.palabra[i + 1])) {
                silaba.hiato.push({
                    tipoHiato: 'Hiato simple',
                    silabaHiato: silaba.palabra[i - 1] + '-h' + silaba.palabra[i + 1]
                });
            }

            vocalFuerteAnterior = vocalFuerte(silaba.palabra[i]);

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

        var expresion;

        for (var i = 0; i < silaba.silabas.length; i++) {

            // Triptongo (VD - VF - VD) = ((i|u)(a|e|o)(i|u))
            expresion = /((i|u)(a|e|o)(i|u))/g;
            if (silaba.silabas[i].silaba.match(expresion)) {
                silaba.triptongo.push({
                    tipo: 'Triptongo',
                    silaba: silaba.silabas[i].silaba.match(expresion)[0]
                });
                continue;
            }

            // Diptongo Creciente (VD - VF) = ((i|u)(a|e|o))
            expresion = /((i|u)(a|e|o))/g;
            if (silaba.silabas[i].silaba.match(expresion)) {
                silaba.diptongo.push({
                    tipo: 'Diptongo Creciente',
                    silaba: silaba.silabas[i].silaba.match(expresion)[0]
                });
                continue;
            }

            // Diptongo Drececiente (VF - VD) : ((a|e|o)(i|u))
            expresion = /((a|e|o)(i|u))/g;
            if (silaba.silabas[i].silaba.match(expresion)) {
                silaba.diptongo.push({
                    tipo: 'Diptongo Drececiente',
                    silaba: silaba.silabas[i].silaba.match(expresion)[0]
                });
                continue;
            }

            // Diptongo Homogeneo (VD - VD) : ((i|u)(i|u))
            expresion = /((i|u)(i|u))/g;
            if (silaba.silabas[i].silaba.match(expresion)) {
                silaba.diptongo.push({
                    tipo: 'Diptongo Homogéneos',
                    silaba: silaba.silabas[i].silaba.match(expresion)[0]
                });
            }


        }
    }

    /**
     * Determina el tipo de acentuacion de la palabra
     *
     * @returns {undefined}
     */
    function acentuacion() {

        switch (silaba.numeroSilaba - silaba.tonica) {
            case 0:
                silaba.acentuacion = 'Aguda';
                break;
            case 1:
                silaba.acentuacion = 'Grave (Llana)';
                break;
            case 2:
                silaba.acentuacion = 'Esdrújula';
                break;
            default:
                silaba.acentuacion = 'Sobresdrújula';
                break;
        }

    }

    /**
     * Determina si c es una vocal fuerte o débil acentuada
     *
     * @param {string} c
     * @returns {boolean}
     */
    function vocalFuerte(c) {

        switch (c) {
            case 'a':
            case 'á':
            case 'A':
            case 'Á':
            case 'à':
            case 'À':
            case 'e':
            case 'é':
            case 'E':
            case 'É':
            case 'è':
            case 'È':
            case 'í':
            case 'Í':
            case 'ì':
            case 'Ì':
            case 'o':
            case 'ó':
            case 'O':
            case 'Ó':
            case 'ò':
            case 'Ò':
            case 'ú':
            case 'Ú':
            case 'ù':
            case 'Ù':
                return true;
        }
        return false;

    }

    /**
     * Determina si c no es una vocal
     *
     * @param {string} c
     * @returns {boolean}
     */
    function esConsonante(c) {

        if (!vocalFuerte(c)) {
            switch (c) {
                // Vocal débil
                case 'i':
                case 'I':
                case 'u':
                case 'U':
                case 'ü':
                case 'Ü':
                    return false;
            }

            return true;
        }

        return false;
    }

    // Valida si el objeto está declarado
    if (typeof window.silabaJS === 'undefined')
        window.silabaJS = silabaJS;

})();
