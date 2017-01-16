# SilabaJS
_____________
Librería en Javascript para obtener en formato JSON las silabas, posición de la silaba tónica, tipo acentuación, hiato, diptongo y triptongo de una palabra.

Estructura JSON:

```javascript
    {
        palabra,         // (String) Palabra ingresada
        longitudPalabra, // (int)    Longitud de la palabra
        numeroSilaba,    // (int)    Número de silabas de la palabra
        silabas,         // (Array)  Array de objeto que contiene la silaba (caracter) y la posicion en la palabra
        tonica,          // (int)    Posición de la silaba tónica (empieza en 1)
        letraTildada,    // (int)    Posición de la letra tildada (si la hay)
        acentuacion,     // (int)    Tipo acentuacion de la palabra (Aguda, Grave, Esdrujula y Sobresdrujula)
        hiato,           // (Array)  Array de objeto que contiene hiato (si la hay)
        diptongo,        // (Array)  Array de objeto que contiene diptongo (si la hay)
        triptongo        // (Array)  Array de objeto que contiene triptongo (si la hay)
    }
```

Ejemplo de salida con la palabra **Leer**:

```javascript
{
  "palabra": "leer",
  "longitudPalabra": 4,
  "numeroSilaba": 2,
  "silabas": [
    {
      "inicioPosicion": 0,
      "silaba": "le"
    },
    {
      "inicioPosicion": 2,
      "silaba": "er"
    }
  ],
  "tonica": 2,
  "letraTildada": -1,
  "acentuacion": "Aguda",
  "hiato": [
    {
      "tipoHiato": "Hiato simple",
      "silabaHiato": "e-e"
    }
  ],
  "diptongo": [],
  "triptongo": []
}
```

______________

Como implementar:

* Incluimos la libreria:
```html
<script src="silabajs.js"></script>
```

* Asignamos el resultado de la palabra que le pasamos entre paréntesis:
```javascript
    var silaba = silabaJS.getSilabas('leer');
```

* Ahora la variable *silaba* contiene el JSON con el resultado.

_________________
 [Silabeador](http://tip.iatext.ulpgc.es/silabas/) (Código base en C++ de donde se realizo la migración)