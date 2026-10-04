/**
 * Contenido editorial de cada familia: el panel del catálogo y la página
 * `/categoria/<id>`.
 *
 * El catálogo (`catalog.ts`) dice QUÉ se vende; esto dice CÓMO se elige. Son las
 * respuestas que un comercial da por teléfono y que hasta ahora no estaban en
 * ninguna página: son las que pueden posicionar «film estirable Zaragoza» o
 * «qué fleje usar», que en la portada competían las nueve familias a la vez.
 *
 * Regla de redacción: sólo afirmaciones que el propio catálogo respalda. Plazos
 * de entrega, pedidos mínimos, zona de reparto o antigüedad de la empresa NO se
 * escriben aquí hasta que el cliente los confirme (ver BORRADOR_CONTENIDO.md).
 */

import type { CategoryId } from "./catalog";

export interface CategoryGuide {
  /** Encabezado H1 de la página: producto + para qué sirve. */
  h1: string;
  /** `<title>`, ~60 caracteres. */
  title: string;
  /** Meta descripción, tope de 155 caracteres para que Google no la corte. */
  metaDescription: string;
  /** Entradilla, 40-60 palabras: qué es y para qué sirve. */
  intro: string;
  /** Tabla «cómo elegir»: situación → recomendación. */
  guide?: { heading: string; rows: [string, string][] };
  /** Preguntas frecuentes. Se marcan como FAQPage en el pregenerado. */
  faq: { q: string; a: string }[];
}

/** Va en todas las familias: es el servicio que más repite el catálogo. */
const FAQ_MEDIDA = {
  q: "¿Puedo pedir una medida o un formato distinto al del catálogo?",
  a: "Sí. Fabricamos envases y embalajes a medida: indíquenos qué necesita embalar y le preparamos un presupuesto sin compromiso.",
};

export const guides: Record<CategoryId, CategoryGuide> = {
  cintas: {
    h1: "Cinta adhesiva y precinto para cerrar sus cajas",
    title: "Cinta adhesiva y precinto en Zaragoza | Meridional Plastic",
    metaDescription:
      "Precinto de polipropileno acrílico y solvente, manual y automático, impreso hasta en tres colores con su logo. Precintadoras. Presupuesto en Zaragoza.",
    intro:
      "El precinto cierra la caja y, si va impreso, hace que cada paquete salga con su marca. Servimos precinto de polipropileno en acrílico y en solvente, para uso manual o automático, con impresión de hasta tres colores, y las precintadoras para aplicarlo.",
    guide: {
      heading: "Cómo elegir el precinto",
      rows: [
        ["Cerrar cajas a mano, uso general", "Precinto de polipropileno, uso manual"],
        ["Cerrar cajas con máquina", "Precinto de uso automático"],
        ["Que cada paquete lleve su marca", "Precinto impreso hasta en tres colores"],
        ["Avisar de que la mercancía es delicada", "Precinto impreso «MUY FRÁGIL»"],
      ],
    },
    faq: [
      {
        q: "¿Qué diferencia hay entre el precinto acrílico y el de solvente?",
        a: "Se distinguen por el adhesivo. Cada uno tiene su ficha técnica con el detalle de uso; si duda, cuéntenos qué caja cierra y con qué ritmo de trabajo y le recomendamos uno.",
      },
      {
        q: "¿Puedo imprimir el logo de mi empresa en el precinto?",
        a: "Sí, hasta en tres colores. Envíenos el logo y las medidas que necesita y le preparamos el presupuesto.",
      },
      FAQ_MEDIDA,
    ],
  },

  film: {
    h1: "Film estirable para paletizar y envolver",
    title: "Film estirable para paletizar en Zaragoza | Meridional Plastic",
    metaDescription:
      "Film estirable manual y automático, minifilm y envolvedoras de palés. Guía para elegir el formato. Ficha técnica y presupuesto sin compromiso en Zaragoza.",
    intro:
      "El film estirable mantiene la carga unida sobre el palé y la protege del polvo y la humedad durante el transporte. Servimos film de uso manual y automático, minifilm para bultos pequeños y las envolvedoras que lo aplican.",
    guide: {
      heading: "Cómo elegir el film estirable",
      rows: [
        ["Envolver pocos palés, a mano", "Film de uso manual"],
        ["Envolver con envolvedora", "Film de uso automático"],
        ["Unir bultos pequeños o cajas sueltas", "Minifilm, de ancho 100"],
        ["Proteger superficies delicadas", "Minifilm, también con prestiro"],
      ],
    },
    faq: [
      {
        q: "¿Qué diferencia hay entre el film manual y el automático?",
        a: "El manual se aplica a mano y el automático se monta en una envolvedora. Cada uno tiene su ficha técnica con el ancho, el espesor y la presentación.",
      },
      {
        q: "¿Qué significa «23 my»?",
        a: "Es el espesor del film, medido en micras. A mayor espesor, más resistencia.",
      },
      FAQ_MEDIDA,
    ],
  },

  burbuja: {
    h1: "Plástico de burbuja para proteger sus envíos",
    title: "Plástico de burbuja en Zaragoza | Meridional Plastic",
    metaDescription:
      "Burbuja en bobina, bolsa y plancha, y combinada con foam, papel Kraft o PET metalizado. Protección para envíos frágiles. Presupuesto en Zaragoza.",
    intro:
      "La burbuja amortigua los golpes y las vibraciones del transporte. La servimos en bobinas para envolver, en bolsas para meter el producto y cerrar, y en formatos y planchas a medida, además de combinada con foam, papel Kraft o PET metalizado.",
    guide: {
      heading: "Cómo elegir la burbuja",
      rows: [
        ["Envolver piezas de cualquier forma", "Bobinas de burbuja"],
        ["Meter el producto y cerrar, sin cortar", "Bolsa de burbuja"],
        ["Una medida concreta y repetida", "Formatos y planchas"],
        ["Más protección o un acabado especial", "Burbuja con foam, Kraft o PET metalizado"],
      ],
    },
    faq: [
      {
        q: "¿Se puede pedir la burbuja con un ancho o un largo concretos?",
        a: "Sí. Hay formatos y planchas en catálogo, y preparamos medidas a medida bajo presupuesto.",
      },
      {
        q: "¿Para qué sirve la burbuja con papel Kraft o con PET metalizado?",
        a: "Son burbujas combinadas con otra capa, para cuando hace falta un acabado distinto al del plástico solo. Consulte la ficha de cada una.",
      },
      FAQ_MEDIDA,
    ],
  },

  foam: {
    h1: "Foam para embalar piezas delicadas",
    title: "Foam de embalaje en Zaragoza | Meridional Plastic",
    metaDescription:
      "Bobinas, perfiles y cantoneras de foam para proteger superficies, aristas y piezas delicadas. Ficha técnica y presupuesto sin compromiso en Zaragoza.",
    intro:
      "El foam protege las superficies y las piezas delicadas frente a golpes y roces, sin marcar el producto. Servimos bobinas para envolver y perfiles y cantoneras para proteger aristas y esquinas.",
    guide: {
      heading: "Cómo elegir el foam",
      rows: [
        ["Envolver una pieza entera", "Bobinas de foam"],
        ["Proteger aristas, cantos y esquinas", "Perfiles y cantoneras de foam"],
        ["Evitar roces entre piezas apiladas", "Bobinas de foam, como separador"],
      ],
    },
    faq: [
      {
        q: "¿Qué diferencia hay entre el foam y la burbuja?",
        a: "El foam es una espuma continua que protege bien del roce y no marca la superficie; la burbuja amortigua mejor los golpes. En envíos delicados se usan a menudo juntos.",
      },
      FAQ_MEDIDA,
    ],
  },

  polietileno: {
    h1: "Lámina retráctil, semitubo y bolsas de plástico",
    title: "Lámina retráctil, semitubo y bolsas | Meridional Plastic",
    metaDescription:
      "Lámina retráctil, semitubo y bolsas de polietileno para embalaje industrial, en medidas a medida. Presupuesto sin compromiso en Zaragoza.",
    intro:
      "Polietileno para cubrir, agrupar y proteger producto: lámina retráctil, semitubo y bolsas. Es la familia más flexible del catálogo, porque casi todo se puede preparar en la medida que necesite.",
    guide: {
      heading: "Cómo elegir",
      rows: [
        ["Cubrir y ajustar al producto con calor", "Lámina retráctil"],
        ["Cubrir producto de largo variable", "Semitubo"],
        ["Meter, cerrar y manipular", "Bolsas"],
      ],
    },
    faq: [FAQ_MEDIDA],
  },

  fleje: {
    h1: "Fleje, flejadoras y accesorios para asegurar la carga",
    title: "Fleje y flejadoras en Zaragoza | Meridional Plastic",
    metaDescription:
      "Fleje de polipropileno, PET, textil y metálico, flejadoras manuales y semiautomáticas, tensores y hebillas. Presupuesto sin compromiso en Zaragoza.",
    intro:
      "El fleje ata y asegura la carga que el film por sí solo no sujeta. Servimos fleje de polipropileno, poliéster (PET), textil y metálico, junto con las flejadoras, tensores, hebillas, enlazadores y carros devanadores para aplicarlo.",
    guide: {
      heading: "Los cuatro tipos de fleje",
      rows: [
        ["Fleje de polipropileno (PP)", "El más habitual para bultos y paquetes"],
        ["Fleje de poliéster (PET)", "Alternativa plástica de mayor resistencia"],
        ["Fleje textil", "Cuando la carga pide un fleje flexible"],
        ["Fleje metálico", "Para las cargas más pesadas"],
      ],
    },
    faq: [
      {
        q: "¿Qué fleje debo usar para mi carga?",
        a: "Depende del peso, de la forma y de si la carga puede marcarse. Cada fleje tiene su ficha técnica; si duda, cuéntenos qué ata y se lo recomendamos.",
      },
      {
        q: "¿Suministran también las flejadoras y los accesorios?",
        a: "Sí: flejadora manual, flejadora semiautomática, mesa flejadora, tensores, hebillas, enlazadores y carros devanadores.",
      },
      FAQ_MEDIDA,
    ],
  },

  carton: {
    h1: "Cajas y cantoneras de cartón",
    title: "Cajas de cartón y cantoneras en Zaragoza | Meridional Plastic",
    metaDescription:
      "Cajas de cartón para embalar y cantoneras para reforzar aristas de palés y bultos, en medidas a medida. Presupuesto sin compromiso en Zaragoza.",
    intro:
      "El cartón es la base del envío: la caja contiene el producto y la cantonera refuerza las aristas para que el palé no se venza ni el fleje marque la carga. Trabajamos también medidas a medida.",
    faq: [
      {
        q: "¿Para qué sirven las cantoneras?",
        a: "Refuerzan las aristas del palé o del bulto y reparten la presión del fleje, de modo que no marque la carga.",
      },
      FAQ_MEDIDA,
    ],
  },

  pales: {
    h1: "Palés de plástico y de segundo uso",
    title: "Palés de plástico y de segundo uso | Meridional Plastic",
    metaDescription:
      "Palés de polietileno de alta densidad y palés de segundo uso, en medidas estándar. Presupuesto sin compromiso en La Puebla de Alfindén, Zaragoza.",
    intro:
      "El palé es la base sobre la que viaja toda la carga. Servimos palés de polietileno de alta densidad, lavables y de larga vida, y palés de segundo uso en medidas estándar para cuando prima el coste.",
    guide: {
      heading: "Cómo elegir el palé",
      rows: [
        ["Uso repetido, higiene y limpieza", "Palés de polietileno de alta densidad"],
        ["Un solo viaje o coste ajustado", "Palés de 2.º uso"],
      ],
    },
    faq: [FAQ_MEDIDA],
  },

  maquinaria: {
    h1: "Envolvedoras de palés con film estirable",
    title: "Envolvedoras de palés en Zaragoza | Meridional Plastic",
    metaDescription:
      "Envolvedoras de mesa rotativa, de brazo giratorio y robot envolvedor para film estirable. Ficha técnica y presupuesto sin compromiso en Zaragoza.",
    intro:
      "Una envolvedora aplica el film de forma constante, gasta menos por palé y ahorra el esfuerzo de dar vueltas a mano. Servimos envolvedoras de mesa rotativa, de brazo giratorio y robot envolvedor.",
    guide: {
      heading: "Cómo elegir la envolvedora",
      rows: [
        ["Palés de peso y medida normales", "Envolvedora de mesa rotativa"],
        ["Carga inestable o muy pesada, que no conviene girar", "Envolvedora de brazo giratorio"],
        ["Varias zonas de carga, sin sitio fijo", "Robot envolvedor"],
      ],
    },
    faq: [
      {
        q: "¿Qué envolvedora me conviene?",
        a: "Depende de cuántos palés envuelva, de su peso y de si la carga se puede girar. Cuéntenos su caso y se lo recomendamos.",
      },
      FAQ_MEDIDA,
    ],
  },
};
