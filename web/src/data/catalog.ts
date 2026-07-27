/**
 * Contenido transcrito del "Catálogo de productos 2024" de Meridional Plastic, S.L.
 * Las imágenes proceden del mismo catálogo (ver public/img).
 */

export type CategoryId = "polimeros" | "cintas" | "fleje" | "carton" | "palets";

export interface Category {
  id: CategoryId;
  name: string;
  tagline: string;
  description: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  /** Familia dentro de la categoría, se usa como subtítulo y para agrupar. */
  family: string;
  image: string;
  summary: string;
  specs: string[];
  /** Etiquetas transversales, usadas por el filtro rápido. */
  tags: Tag[];
  /** Variantes o referencias concretas del producto. */
  variants?: string[];
}

export const TAGS = [
  "Impresión personalizada",
  "Uso manual",
  "Uso automático",
  "A medida",
  "Ecológico",
] as const;

export type Tag = (typeof TAGS)[number];

/**
 * Resuelve una ruta de `public/` contra la base de despliegue.
 *
 * Vite reescribe las rutas que aparecen en el HTML y el CSS, pero no las que
 * viven en cadenas de texto como las de este fichero. Sin esto, al publicar en
 * un subdirectorio (por ejemplo GitHub Pages en `usuario.github.io/repo/`)
 * `/img/foo.jpg` apuntaría a la raíz del dominio y ninguna imagen cargaría.
 */
export const asset = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

export const COMPANY = {
  name: "Meridional Plastic, S.L.",
  claim: "Productos para envase y embalaje",
  address: "Pol. Ind. Malpica Alfindén, Calle F, Nave 14",
  city: "50171 La Puebla de Alfindén, Zaragoza, España",
  email: "comercial@meridionalplastic.com",
  phone: "+34 625 473 361",
  /** Mismo número en formato internacional sin separadores, para enlaces wa.me */
  phoneRaw: "34625473361",
  catalogYear: 2026,
};

const rawCategories: Category[] = [
  {
    id: "polimeros",
    name: "Polímeros",
    tagline: "Film, burbuja, espuma y bolsas",
    description:
      "Film estirable, lámina y semitubo, plástico burbuja, foam y bolsas para proteger y agrupar cualquier tipo de carga.",
    image: "/img/film-estirable.jpg",
  },
  {
    id: "cintas",
    name: "Cintas adhesivas y precintos",
    tagline: "Precinto impreso y cintas técnicas",
    description:
      "Precinto en polipropileno y PVC con todo tipo de adhesivos, cintas técnicas y precintadoras manuales.",
    image: "/img/precinto-impreso.jpg",
  },
  {
    id: "fleje",
    name: "Fleje y flejado",
    tagline: "Fleje y herramientas",
    description:
      "Fleje de polipropileno, poliéster, textil y metálico, además de las herramientas y accesorios para aplicarlo.",
    image: "/img/fleje-pet.jpg",
  },
  {
    id: "carton",
    name: "Cartón y papel",
    tagline: "Cajas, cantoneras y bobinas",
    description:
      "Cajas estándar y a medida, cantoneras de protección y bobinas de cartón ondulado y papel kraft.",
    image: "/img/cajas-carton.jpg",
  },
  {
    id: "palets",
    name: "Palets",
    tagline: "Paletina, ligero, semifuerte y europeo",
    description:
      "Palets de madera en los formatos más habituales para la expedición y el almacenaje de mercancías.",
    image: "/img/palets.jpg",
  },
];

const rawProducts: Product[] = [
  /* ---------------------------------------------------------------- POLÍMEROS */
  {
    id: "film-manual",
    name: "Film estirable · Uso manual",
    category: "polimeros",
    family: "Film estirable",
    image: "/img/film-estirable.jpg",
    summary:
      "Film estirable A-500 para paletizado manual, disponible en tres espesores y con opción de impresión de su logotipo.",
    specs: [
      "Referencia A-500 en 12, 17 y 23 my",
      "Disponible en transparente, blanco y negro",
      "Distintos anchos disponibles",
      "Posibilidad de imprimir su logotipo",
    ],
    variants: ["A-500 12 my", "A-500 17 my", "A-500 23 my"],
    tags: ["Impresión personalizada", "Uso manual"],
  },
  {
    id: "film-automatico",
    name: "Film estirable · Uso automático",
    category: "polimeros",
    family: "Film estirable",
    image: "/img/film-estirable.jpg",
    summary:
      "Film estirable para aplicación con máquina automática, con amplia gama de anchos, espesores y niveles de pre-estiro.",
    specs: [
      "Referencia A-500 en 12, 17 y 23 my",
      "Aplicación con máquina automática",
      "Disponible en transparente, blanco y negro",
      "Variedad de referencias en anchos, espesores y con pre-estiro",
      "Posibilidad de impresión a tres colores",
    ],
    variants: ["A-500 12 my", "A-500 17 my", "A-500 23 my"],
    tags: ["Impresión personalizada", "Uso automático"],
  },
  {
    id: "film-miniflex",
    name: "Miniflex",
    category: "polimeros",
    family: "Film estirable",
    image: "/img/film-estirable.jpg",
    summary:
      "Mini bobina de film estirable de 100 mm para agrupar bultos, sujetar cargas ligeras y trabajos de detalle.",
    specs: [
      "Ancho 100 mm, espesor 23 my",
      "Acabado transparente",
      "Aplicación manual y automática",
    ],
    tags: ["Uso manual", "Uso automático"],
  },
  {
    id: "lamina-semitubo",
    name: "Lámina y semitubo · Bobinas de polietileno",
    category: "polimeros",
    family: "Lámina y semitubo",
    image: "/img/lamina-semitubo.jpg",
    summary:
      "Bobinas de polietileno en alta y baja densidad, en lámina o semitubo, con anchos de hasta 1.900 mm.",
    specs: [
      "Polietileno en alta y baja densidad",
      "Ancho hasta 1.900 mm",
      "Disponible también en versión retráctil",
    ],
    tags: ["A medida"],
  },
  {
    id: "bopp",
    name: "Bobinas de polipropileno biorientado",
    category: "polimeros",
    family: "Lámina y semitubo",
    image: "/img/lamina-semitubo.jpg",
    summary:
      "Bobinas de BOPP, PVC, poliolefina y poliéster para envasado y retractilado, con impresión hasta tres colores.",
    specs: [
      "Polipropileno biorientado, PVC, poliolefina y poliéster",
      "Variedad de anchos y espesores",
      "Posibilidad de impresión a tres colores",
    ],
    tags: ["Impresión personalizada", "A medida"],
  },
  {
    id: "foam-bobina",
    name: "Bobinas de espuma (foam)",
    category: "polimeros",
    family: "Foam",
    image: "/img/foam-bobina.jpg",
    summary:
      "Bobina de espuma de polietileno expandido de baja densidad para la protección de superficies delicadas.",
    specs: [
      "Espuma de polietileno expandido en baja densidad",
      "Diversas medidas y espesores",
    ],
    tags: ["A medida"],
  },
  {
    id: "perfil-espuma",
    name: "Perfil de espuma",
    category: "polimeros",
    family: "Foam",
    image: "/img/perfil-espuma.jpg",
    summary:
      "Perfiles de espuma de polietileno expandido para proteger cantos, esquinas y piezas de perfilería.",
    specs: [
      "Fabricado en polietileno expandido",
      "Cinco geometrías disponibles",
    ],
    variants: [
      "Perfil U",
      "Perfil L",
      "Perfil C",
      "Perfil Omega",
      "Perfil Boomerang",
    ],
    tags: ["A medida"],
  },
  {
    id: "burbuja-pe",
    name: "Plástico burbuja · Bobinas de polietileno",
    category: "polimeros",
    family: "Plástico burbuja",
    image: "/img/burbuja.jpg",
    summary:
      "Bobinas de plástico burbuja de polietileno en cinco anchos estándar y distintos espesores.",
    specs: [
      "Anchos de 1,00 · 1,20 · 1,50 · 1,60 y 2,00 m",
      "Disponible en distintos espesores",
    ],
    variants: ["1,00 m", "1,20 m", "1,50 m", "1,60 m", "2,00 m"],
    tags: ["A medida"],
  },
  {
    id: "burbuja-kraft",
    name: "Bobinas de burbuja con Kraft",
    category: "polimeros",
    family: "Plástico burbuja",
    image: "/img/burbuja.jpg",
    summary:
      "Burbuja laminada con papel Kraft: máxima protección y aislamiento térmico, en color marrón.",
    specs: [
      "Burbuja con Kraft de máxima protección",
      "Color marrón",
      "Aislante térmico, también para construcción",
    ],
    tags: [],
  },
  {
    id: "burbuja-aluminio",
    name: "Bobinas de burbuja con aluminio doble capa",
    category: "polimeros",
    family: "Plástico burbuja",
    image: "/img/burbuja.jpg",
    summary:
      "Burbuja con acabado de aluminio en doble capa, para protección reforzada y aislamiento reflectante.",
    specs: [
      "Doble capa de burbuja con aluminio",
      "Protección y aislamiento reforzados",
    ],
    tags: [],
  },
  {
    id: "burbuja-formatos",
    name: "Bolsas y formatos en PE burbuja",
    category: "polimeros",
    family: "Plástico burbuja",
    image: "/img/burbuja.jpg",
    summary:
      "Bolsas y formatos ya cortados en polietileno burbuja, listos para envolver y expedir.",
    specs: [
      "Bolsas y formatos en PE burbuja",
      "Medidas adaptadas a su producto",
    ],
    tags: ["A medida"],
  },
  {
    id: "bolsas",
    name: "Bolsas de polietileno y polipropileno",
    category: "polimeros",
    family: "Bolsas",
    image: "/img/bolsas.jpg",
    summary:
      "Todo tipo de bolsa para uso industrial y comercio, con impresión hasta tres colores y opción de autocierre.",
    specs: [
      "Fabricadas en polietileno y polipropileno",
      "Todo tipo de bolsa para uso industrial y comercio",
      "Impresión hasta 3 colores",
      "Disponible con autocierre",
    ],
    tags: ["Impresión personalizada", "A medida"],
  },
  {
    id: "packing-list",
    name: "Packing list · Sobres portadocumentos",
    category: "polimeros",
    family: "Material de envío",
    image: "/img/packing-list.jpg",
    summary:
      "Sobres adhesivos que facilitan el envío de la documentación junto a la mercancía.",
    specs: [
      "Facilitan el envío de documentación en sus expediciones",
      "Diferentes tamaños",
      "Con o sin impresión «CONTIENE DOCUMENTACIÓN»",
    ],
    tags: ["Impresión personalizada"],
  },
  {
    id: "etiquetas-envio",
    name: "Etiquetas de envío",
    category: "polimeros",
    family: "Material de envío",
    image: "/img/etiquetas-envio.jpg",
    summary:
      "Etiquetas en papel flúor con textos de aviso preimpresos para señalizar sus expediciones.",
    specs: [
      "Etiquetas en papel flúor",
      "Textos: «MUY FRÁGIL» o «CONTIENE ALBARÁN»",
    ],
    variants: ["MUY FRÁGIL", "CONTIENE ALBARÁN"],
    tags: [],
  },

  /* ------------------------------------------------------------------ CINTAS */
  {
    id: "precinto-impreso",
    name: "Precinto impreso",
    category: "cintas",
    family: "Precinto",
    image: "/img/precinto-impreso.jpg",
    summary:
      "Precinto personalizado con su marca, en polipropileno y PVC, para uso manual y automático.",
    specs: [
      "Para uso manual y automático",
      "Fabricado en polipropileno y PVC",
      "Disponible en transparente, marrón y blanco",
      "Impresión máxima en 3 colores",
      "Distintas medidas y variedad de adhesivos",
    ],
    variants: [
      "PP acrílico · adhesivo acrílico base agua",
      "PP hotmelt · adhesivo de caucho sintético",
      "PP solvente · adhesivo de caucho natural",
      "PVC · adhesivo de caucho natural",
    ],
    tags: ["Impresión personalizada", "Uso manual", "Uso automático"],
  },
  {
    id: "pp-acrilico",
    name: "Cinta adhesiva PP acrílico",
    category: "cintas",
    family: "Cintas adhesivas",
    image: "/img/pp-acrilico.jpg",
    summary:
      "Adhesivo acrílico de base agua y alta calidad, apto para aplicación manual y automática.",
    specs: [
      "Adhesivo acrílico (base al agua) de alta calidad",
      "Aplicación manual y automática",
      "Aguanta temperaturas extremas",
      "Colores: transparente, blanco y marrón",
      "Distintas medidas",
    ],
    tags: ["Uso manual", "Uso automático"],
  },
  {
    id: "pp-hotmelt",
    name: "Cinta adhesiva PP hotmelt",
    category: "cintas",
    family: "Cintas adhesivas",
    image: "/img/pp-hotmelt.jpg",
    summary:
      "Adhesivo de caucho sintético con excelente adhesión y resistencia a temperaturas extremas.",
    specs: [
      "Adhesivo de caucho sintético",
      "Excelente adhesión",
      "Aguanta temperaturas extremas",
      "Colores: transparente, blanco y marrón",
      "Distintas medidas",
    ],
    tags: ["Uso manual", "Uso automático"],
  },
  {
    id: "pp-solvente",
    name: "Cinta adhesiva PP solvente",
    category: "cintas",
    family: "Cintas adhesivas",
    image: "/img/pp-solvente.jpg",
    summary:
      "Adhesivo de caucho natural con excelente agarre incluso sobre cartón reciclado.",
    specs: [
      "Adhesivo de caucho natural",
      "Excelente adhesión incluso en cartón reciclado",
      "Aguanta temperaturas extremas y humedad",
      "Colores: transparente, blanco y marrón",
      "Distintas medidas",
    ],
    tags: ["Uso manual", "Uso automático"],
  },
  {
    id: "cinta-pvc",
    name: "Cinta adhesiva PVC",
    category: "cintas",
    family: "Cintas adhesivas",
    image: "/img/cinta-pvc.jpg",
    summary:
      "Soporte rígido de PVC con adhesivo de caucho natural: fuerte adhesión, sin residuo y sin ruido al desenrollar.",
    specs: [
      "Adhesivo de caucho natural",
      "No deja residuo y no hace ruido",
      "Soporte rígido y fuerte adhesión",
      "Colores: transparente, blanco y marrón",
      "Distintas medidas",
    ],
    tags: ["Uso manual"],
  },
  {
    id: "cinta-masking",
    name: "Cinta masking",
    category: "cintas",
    family: "Cintas técnicas",
    image: "/img/cinta-masking.jpg",
    summary:
      "Papel crepado con adhesivo de caucho natural, ideal para enmascarado en carrocería. No deja residuo.",
    specs: [
      "Papel crepado con adhesivo de caucho natural",
      "Ideal para carrocería",
      "No deja residuo",
    ],
    tags: ["Uso manual"],
  },
  {
    id: "cinta-kraft",
    name: "Cinta de papel Kraft y reforzado",
    category: "cintas",
    family: "Cintas técnicas",
    image: "/img/cinta-kraft.jpg",
    summary:
      "Cinta de papel con base de caucho natural, producto ecológico en color marrón.",
    specs: ["Base de caucho natural", "Producto ecológico", "Color marrón"],
    variants: ["Papel Kraft", "Papel Kraft reforzado"],
    tags: ["Ecológico"],
  },
  {
    id: "cinta-doble-cara",
    name: "Cinta doble cara",
    category: "cintas",
    family: "Cintas técnicas",
    image: "/img/cinta-doble-cara.jpg",
    summary:
      "Adhesivo por las dos caras, ideal para unir materiales ligeros de forma invisible.",
    specs: [
      "Adhesivo en los dos lados",
      "Ideal para unir materiales ligeros",
      "Transparente",
    ],
    tags: ["Uso manual"],
  },
  {
    id: "cinta-papel-eco",
    name: "Cinta de papel Eco",
    category: "cintas",
    family: "Cintas técnicas",
    image: "/img/cinta-papel-eco.jpg",
    summary:
      "Cinta ecológica de base caucho natural en color marrón, personalizable con más de tres colores de impresión.",
    specs: [
      "Base de caucho natural, producto ecológico",
      "Color marrón",
      "Impresión en más de 3 colores",
    ],
    tags: ["Ecológico", "Impresión personalizada"],
  },
  {
    id: "cinta-aislante",
    name: "Cinta aislante",
    category: "cintas",
    family: "Cintas técnicas",
    image: "/img/cinta-aislante.jpg",
    summary:
      "Cinta de poliéster y polietileno con adhesivo de caucho natural, en gris y negro.",
    specs: [
      "Fabricada en poliéster y polietileno",
      "Adhesivo de caucho natural",
      "Colores: gris y negro",
    ],
    tags: ["Uso manual"],
  },
  {
    id: "cinta-strapping",
    name: "Cinta strapping",
    category: "cintas",
    family: "Cintas técnicas",
    image: "/img/cinta-strapping.jpg",
    summary:
      "Cinta de polipropileno de alta resistencia en color naranja, pensada para sujetar cargas pesadas.",
    specs: [
      "Polipropileno de alta resistencia",
      "Ideal para mantener las cargas pesadas",
      "Color naranja",
    ],
    tags: ["Uso manual"],
  },
  {
    id: "precintadora",
    name: "Precintadora manual 50 mm",
    category: "cintas",
    family: "Herramientas",
    image: "/img/precintadora.jpg",
    summary:
      "Precintadora manual de 50 mm con freno ajustable y cubierta de seguridad en la hoja de corte.",
    specs: [
      "Ancho de cinta 50 mm",
      "Freno ajustable",
      "Ideal para cierre de cajas",
      "Cubierta de seguridad en la hoja de corte",
      "Fácil manejo · color rojo",
    ],
    tags: ["Uso manual"],
  },
  {
    id: "precintadora-metal",
    name: "Precintadora manual metálica 50 mm",
    category: "cintas",
    family: "Herramientas",
    image: "/img/precintadora-metal.jpg",
    summary:
      "Versión metálica para uso intensivo, con freno ajustable y cubierta de seguridad.",
    specs: [
      "Ancho de cinta 50 mm",
      "Construcción metálica para uso intensivo",
      "Freno ajustable",
      "Ideal para cierre de cajas",
      "Cubierta de seguridad en la hoja de corte",
      "Fácil manejo · color rojo",
    ],
    tags: ["Uso manual"],
  },

  /* -------------------------------------------------------------------- FLEJE */
  {
    id: "fleje-pp",
    name: "Fleje de polipropileno",
    category: "fleje",
    family: "Fleje",
    image: "/img/fleje-pp.jpg",
    summary:
      "Fleje versátil que se adapta a la morfología del producto, resistente a la humedad y a los cambios de temperatura.",
    specs: [
      "Resistencia a la humedad y a las fluctuaciones de temperatura",
      "Compatible con uso manual, automático y semiautomático",
      "Se adapta a la morfología de los productos",
      "Distintos anchos y espesores",
      "Posibilidad de impresión",
    ],
    tags: ["Impresión personalizada", "Uso manual", "Uso automático"],
  },
  {
    id: "fleje-pet",
    name: "Fleje de poliéster (PET)",
    category: "fleje",
    family: "Fleje",
    image: "/img/fleje-pet.jpg",
    summary:
      "Alta resistencia y flexibilidad, especial para mercancías pesadas y voluminosas.",
    specs: [
      "Alta resistencia y flexibilidad",
      "Especial para mercancías pesadas y voluminosas",
      "Compatible con uso manual, automático y semiautomático",
      "Distintos anchos y espesores",
      "Posibilidad de impresión",
    ],
    tags: ["Impresión personalizada", "Uso manual", "Uso automático"],
  },
  {
    id: "fleje-textil",
    name: "Fleje textil",
    category: "fleje",
    family: "Fleje",
    image: "/img/fleje-textil.jpg",
    summary:
      "Fleje de hilos de poliéster con adhesivo hotmelt antideslizante, de aplicación manual con hebillas.",
    specs: [
      "Hilos de poliéster con adhesivo hotmelt antideslizante",
      "Aplicación manual con hebillas",
      "Alta resistencia a la tensión y a la rotura",
      "Distintos colores y medidas",
      "Posibilidad de impresión",
    ],
    tags: ["Impresión personalizada", "Uso manual"],
  },
  {
    id: "fleje-metalico",
    name: "Fleje metálico",
    category: "fleje",
    family: "Fleje",
    image: "/img/fleje-metalico.jpg",
    summary:
      "Fleje de acero laminado en frío, encerado y pintado en negro, con protección contra la corrosión.",
    specs: [
      "Laminado en frío y protección contra la corrosión",
      "Fabricado en acero",
      "Resistencia de 80–83 kg/mm²",
      "Encerado y pintado en negro",
    ],
    tags: [],
  },
  {
    id: "flejadora",
    name: "Flejadoras y enlazadores",
    category: "fleje",
    family: "Herramientas de flejado",
    image: "/img/flejadora.jpg",
    summary:
      "Herramientas tensoras y enlazadores para aplicar y cerrar el fleje de forma manual.",
    specs: [
      "Tensado y cierre manual del fleje",
      "Compatibles con fleje de PP y PET",
    ],
    tags: ["Uso manual"],
  },
  {
    id: "portarrollos",
    name: "Porta rollos de fleje",
    category: "fleje",
    family: "Herramientas de flejado",
    image: "/img/portarrollos.jpg",
    summary:
      "Carro porta rollos con freno para desenrollar el fleje cómodamente en el puesto de trabajo.",
    specs: [
      "Carro con soporte para bobina de fleje",
      "Facilita el desenrollado y transporte",
    ],
    tags: ["Uso manual"],
  },
  {
    id: "hebillas",
    name: "Hebillas",
    category: "fleje",
    family: "Herramientas de flejado",
    image: "/img/hebillas.jpg",
    summary:
      "Hebillas metálicas para el cierre manual del fleje textil y de polipropileno.",
    specs: [
      "Cierre manual del fleje",
      "Distintas medidas según ancho de fleje",
    ],
    tags: ["Uso manual"],
  },
  {
    id: "grapas-fleje",
    name: "Grapas y precintos metálicos",
    category: "fleje",
    family: "Herramientas de flejado",
    image: "/img/grapas-fleje.jpg",
    summary:
      "Grapas metálicas de unión para el cierre por engaste del fleje metálico y de plástico.",
    specs: ["Cierre por engaste", "Distintas medidas según ancho de fleje"],
    tags: ["Uso manual"],
  },

  /* ------------------------------------------------------------------- CARTÓN */
  {
    id: "cajas-carton",
    name: "Cajas de cartón",
    category: "carton",
    family: "Cartón",
    image: "/img/cajas-carton.jpg",
    summary:
      "Cajas de canal simple y doble, estándar o fabricadas a medida, incluidas cajas para palet.",
    specs: [
      "Canal simple y canal doble",
      "Estándar y a medida · cajas para palet",
      "Color marrón y blanco",
      "Posibilidad de impresión",
      "Producto reciclable",
    ],
    tags: ["A medida", "Impresión personalizada", "Ecológico"],
  },
  {
    id: "cantoneras",
    name: "Cantoneras",
    category: "carton",
    family: "Cartón",
    image: "/img/cantoneras.jpg",
    summary:
      "Protección lateral para la paletización: refuerzan las esquinas frente al flejado y el filmado.",
    specs: [
      "Protección lateral en la paletización de productos",
      "Refuerzan las esquinas de palés y cajas ante el flejado y el filmado",
      "Previenen daños al embalaje",
      "Distintas anchuras y espesores · corte a medida",
    ],
    tags: ["A medida"],
  },
  {
    id: "carton-ondulado",
    name: "Bobinas de cartón ondulado",
    category: "carton",
    family: "Bobinas",
    image: "/img/carton-ondulado.jpg",
    summary:
      "Material flexible, ligero y ecológico con excelente resistencia a los golpes para envolver y proteger.",
    specs: [
      "Diferentes medidas y gramajes",
      "Embalaje y protección de sus productos",
      "Excelente resistencia a los golpes",
      "Material flexible, ligero y ecológico",
    ],
    tags: ["Ecológico", "A medida"],
  },
  {
    id: "papel-kraft",
    name: "Bobinas de papel Kraft",
    category: "carton",
    family: "Bobinas",
    image: "/img/papel-kraft.jpg",
    summary:
      "Papel Kraft de alta resistencia para embalar y como material de relleno y protección de mercancías.",
    specs: [
      "Bobina de papel Kraft para embalar sus envíos",
      "Uso como material de relleno para protección de mercancías",
      "Alta resistencia",
      "Diferentes gramajes y medidas",
      "Producto ecológico",
    ],
    tags: ["Ecológico", "A medida"],
  },

  /* ------------------------------------------------------------------- PALETS */
  {
    id: "palets",
    name: "Palets de madera",
    category: "palets",
    family: "Palets",
    image: "/img/palets.jpg",
    summary:
      "Palets de madera en los formatos paletina, ligero, semifuerte y europeo para expedición y almacenaje.",
    specs: [
      "Cuatro formatos disponibles",
      "Para expedición y almacenaje de mercancías",
    ],
    variants: ["Paletina", "Ligero", "Semifuerte", "Europeo"],
    tags: [],
  },
];

/* Las rutas de imagen se resuelven una sola vez, al cargar el módulo. */
export const categories: Category[] = rawCategories.map((c) => ({
  ...c,
  image: asset(c.image),
}));

export const products: Product[] = rawProducts.map((p) => ({
  ...p,
  image: asset(p.image),
}));

export const productsByCategory = (id: CategoryId) =>
  products.filter((p) => p.category === id);

export const categoryById = (id: CategoryId) =>
  categories.find((c) => c.id === id) as Category;
