/**
 * Listado de productos de la web de Meridional Plastic, S.L.
 *
 * El contenido sigue el fichero "LISTADO DE PRODUCTOS WEB.xlsx" facilitado por
 * el cliente. Donde el Excel indica «TEXTO CATALOGO» se conserva la redacción
 * del catálogo de 2024 en PDF.
 */

export type CategoryId =
  | "cintas"
  | "film"
  | "burbuja"
  | "foam"
  | "polietileno"
  | "fleje"
  | "carton"
  | "pales"
  | "maquinaria";

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
  /** Piezas pequeñas (hebillas, fichas): se muestran a menor tamaño. */
  imageSize?: "sm";
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
] as const;

export type Tag = (typeof TAGS)[number];

/** Resuelve una ruta de public/ contra la base de despliegue. */
export const asset = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

export const COMPANY = {
  name: "Meridional Plastic, S.L.",
  claim: "Productos para envase y embalaje",
  address: "Pol. Ind. Malpica Alfindén, Calle F, Nave 14",
  city: "50171 La Puebla de Alfindén, Zaragoza, España",
  email: "info@meridionalplastic.com",
  phone: "976 158 711",
  /** Mismo número sin separadores, para los enlaces tel: y wa.me */
  phoneRaw: "34976158711",
  catalogYear: 2026,
};

const rawCategories: Category[] = [
  {
    id: "cintas",
    name: "Cinta adhesiva",
    tagline: "Precintos y precintadoras",
    description:
      "Precinto de polipropileno en acrílico y solvente, manual y automático, impreso en hasta tres colores para personalizarlo con el logo de su empresa.",
    image: "/img/precinto-impreso.jpg",
  },
  {
    id: "film",
    name: "Film estirable",
    tagline: "Manual, automático y minifilm",
    description:
      "Film estirable de polietileno de baja densidad para paletizar de forma manual o automática, con posibilidad de impresión.",
    image: "/img/film-estirable.jpg",
  },
  {
    id: "burbuja",
    name: "Burbuja",
    tagline: "Bobinas, bolsas y formatos",
    description:
      "Bobinas, bolsas y formatos de burbuja para proteger sus productos durante el almacenaje y el transporte, también combinada con Kraft, foam o PET metalizado.",
    image: "/img/bobina-burbuja.jpg",
  },
  {
    id: "foam",
    name: "Foam",
    tagline: "Bobinas, perfiles y cantoneras",
    description:
      "Espuma de polietileno expandido de baja densidad: protección efectiva contra impactos con un alto rendimiento a un coste contenido.",
    image: "/img/foam-bobina.jpg",
  },
  {
    id: "polietileno",
    name: "Lámina, semitubo y bolsas",
    tagline: "Retráctil, semitubo y bolsas",
    description:
      "Lámina retráctil, semitubo y todo tipo de bolsas en polietileno de baja densidad y polipropileno.",
    image: "/img/lamina-retractil.jpg",
  },
  {
    id: "fleje",
    name: "Fleje y accesorios",
    tagline: "Fleje, flejadoras y herramientas",
    description:
      "Fleje de polipropileno, poliéster, textil y metálico, con las flejadoras, tensores y accesorios necesarios para aplicarlo.",
    image: "/img/fleje-pet.jpg",
  },
  {
    id: "carton",
    name: "Cartón",
    tagline: "Cajas y cantoneras",
    description:
      "Cajas de canal simple y doble, estándar o a medida, y cantoneras para reforzar las esquinas en la paletización.",
    image: "/img/cajas-carton.jpg",
  },
  {
    id: "pales",
    name: "Palés",
    tagline: "Medidas estándar y de segundo uso",
    description:
      "Palés de polietileno de alta densidad y palés de segundo uso en las medidas más habituales.",
    image: "/img/palets.jpg",
  },
  {
    id: "maquinaria",
    name: "Maquinaria",
    tagline: "Envolvedoras de film estirable",
    description:
      "Envolvedoras de film estirable: mesa rotativa, brazo giratorio y robot autopropulsado.",
    image: "/img/envolvedora-ecoplat.jpg",
  },
];

const rawProducts: Product[] = [
  /* ----------------------------------------------------------- CINTA ADHESIVA */
  {
    id: "precinto-acrilico",
    name: "Precinto polipropileno acrílico",
    category: "cintas",
    family: "Precinto",
    image: "/img/pp-acrilico.jpg",
    summary:
      "Precinto de polipropileno con adhesivo acrílico de base agua, en cajas de 36 rollos.",
    specs: [
      "Cajas de 36 rollos",
      "Fabricado en polipropileno con adhesivo acrílico (base agua)",
      "Disponible en color marrón y transparente",
    ],
    tags: ["Uso manual", "Uso automático"],
  },
  {
    id: "precinto-solvente",
    name: "Precinto polipropileno solvente",
    category: "cintas",
    family: "Precinto",
    image: "/img/pp-solvente.jpg",
    summary:
      "Adhesivo solvente de caucho natural con excelente adhesión incluso en cartón reciclado.",
    specs: [
      "Cajas de 36 rollos",
      "Fabricado en polipropileno con adhesivo solvente de caucho natural",
      "Excelente adhesión incluso en cartón reciclado",
      "Aguanta temperaturas extremas y la humedad",
      "Disponible en color marrón y transparente",
    ],
    tags: ["Uso manual", "Uso automático"],
  },
  {
    id: "precinto-impreso",
    name: "Precinto impreso",
    category: "cintas",
    family: "Precinto",
    image: "/img/precinto-impreso.jpg",
    summary:
      "Precinto personalizado con el logo de su empresa, hasta 3 tintas y fondo negativo.",
    specs: [
      "Cajas de 36 rollos",
      "Fabricado en polipropileno solvente de máxima calidad",
      "Distintos colores",
      "Impresión hasta 3 tintas y fondo negativo",
    ],
    tags: ["Impresión personalizada", "Uso manual", "Uso automático"],
  },
  {
    id: "precinto-muy-fragil",
    name: "Precinto impreso fondo blanco «MUY FRÁGIL»",
    category: "cintas",
    family: "Precinto",
    image: "/img/precinto-muy-fragil.jpg",
    summary:
      "Precinto de aviso con fondo blanco e impresión «MUY FRÁGIL» para señalizar sus expediciones.",
    specs: ["Presentación en cajas de 36 rollos", "Medida 36 × 48 mm"],
    tags: ["Uso manual"],
  },
  {
    id: "precinto-automatico",
    name: "Precinto PP solvente transparente · uso automático",
    category: "cintas",
    family: "Precinto",
    image: "/img/precinto-automatico.jpg",
    summary:
      "Bobinas para precintadora automática, en presentación de 6 rollos por caja.",
    specs: [
      "Presentación en cajas de 6 rollos",
      "Se utiliza para precintar cajas con máquina automática",
    ],
    tags: ["Uso automático"],
  },
  {
    id: "precintadora",
    name: "Precintadora manual 50 mm",
    category: "cintas",
    family: "Precintadoras",
    image: "/img/precintadora.jpg",
    summary:
      "Precintadora manual de 50 mm con freno ajustable y cubierta de seguridad en la hoja de corte.",
    specs: [
      "Freno ajustable",
      "Ideal para cierre de cajas",
      "Cubierta de seguridad en la hoja de corte",
      "De fácil manejo",
    ],
    tags: ["Uso manual"],
  },
  {
    id: "precintadora-metal",
    name: "Precintadora manual 50 mm metálica",
    category: "cintas",
    family: "Precintadoras",
    image: "/img/precintadora-metal.jpg",
    summary:
      "Versión metálica para uso intensivo: más duradera y precisa, y de fácil manejo.",
    specs: [
      "Utilización para uso intensivo",
      "De fácil manejo",
      "Metálica, más duradera y precisa",
    ],
    tags: ["Uso manual"],
  },

  /* ----------------------------------------------------------- FILM ESTIRABLE */
  {
    id: "film-manual",
    name: "Film ancho 500 · 23 my · manual",
    category: "film",
    family: "Film estirable",
    image: "/img/film-estirable.jpg",
    summary:
      "Film estirable de polietileno de baja densidad (PEBD), en cajas de 6 bobinas, para paletizar su mercancía de forma manual.",
    specs: [
      "Ancho 500 · 23 my · 1,5 kg (mandril de 300 g)",
      "Presentado en cajas de 6 bobinas",
      "60 cajas por palé",
      "Kilos reales",
    ],
    tags: ["Uso manual"],
  },
  {
    id: "minifilm",
    name: "Minifilm",
    category: "film",
    family: "Film estirable",
    image: "/img/minifilm.jpg",
    summary:
      "Film de ancho 100 en polietileno de baja densidad (PEBD), muy sencillo y ágil de utilizar.",
    specs: [
      "Ancho 100",
      "Cajas de 54 bobinas",
      "Unión de pequeños paquetes y protección de superficies delicadas",
    ],
    tags: ["Uso manual"],
  },
  {
    id: "film-automatico",
    name: "Film ancho 500 · 23 my · uso automático",
    category: "film",
    family: "Film estirable",
    image: "/img/film-impreso.jpg",
    summary:
      "Film estirable para paletizar de forma automática con envolvedora, en palé de 750 kg o en bobinas sueltas.",
    specs: [
      "Polietileno de baja densidad (PEBD)",
      "Presentación en palé de 750 kg o bobinas sueltas",
      "Disponible en transparente y en color",
      "Posibilidad de impresión en 3 colores",
    ],
    tags: ["Uso automático", "Impresión personalizada"],
  },

  /* ----------------------------------------------------------------- BURBUJA */
  {
    id: "bolsa-burbuja",
    name: "Bolsa de burbuja",
    category: "burbuja",
    family: "Bolsas y formatos",
    image: "/img/bolsa-burbuja.jpg",
    summary:
      "Bolsas bidimensionales para la protección y separación de productos sensibles a los golpes y las rayaduras.",
    specs: [
      "Diversidad de materiales y medidas",
      "Con solapa y con autocierre",
      "Versión antiestática",
      "Laminados con foam",
    ],
    tags: ["A medida"],
  },
  {
    id: "formato-burbuja",
    name: "Formatos y planchas",
    category: "burbuja",
    family: "Bolsas y formatos",
    image: "/img/burbuja.jpg",
    summary:
      "Formatos y planchas cortados a medida que facilitan el apilamiento del producto en el palé.",
    specs: ["Formatos y planchas a medida", "En distintos materiales"],
    tags: ["A medida"],
  },
  {
    id: "bobina-burbuja",
    name: "Bobinas de burbuja",
    category: "burbuja",
    family: "Bobinas",
    image: "/img/bobina-burbuja.jpg",
    summary:
      "Bobinas de burbuja de polietileno de baja densidad para proteger sus productos durante el almacenaje y el transporte.",
    specs: [
      "Fácil manejo en el proceso de embalado",
      "Distintos anchos, gramajes y materiales",
      "Posibilidad de cortes y precorte a medida",
      "Ancho hasta 2.600 mm",
    ],
    tags: ["A medida"],
  },
  {
    id: "burbuja-kraft",
    name: "Burbuja con papel Kraft",
    category: "burbuja",
    family: "Bobinas",
    image: "/img/burbuja-kraft.jpg",
    summary:
      "Bobinas de burbuja con papel Kraft para una protección total de la mercancía.",
    specs: ["Protección total", "Evita las roturas por cantos afilados o golpes"],
    tags: [],
  },
  {
    id: "burbuja-foam",
    name: "Burbuja con foam",
    category: "burbuja",
    family: "Bobinas",
    image: "/img/burbuja-foam.jpg",
    summary:
      "Bobina de burbuja con foam, disponible en distintos grosores y a una o dos caras.",
    specs: [
      "Distintos grosores",
      "A una y dos caras",
      "Buena absorción de los golpes",
    ],
    tags: [],
  },
  {
    id: "burbuja-pet",
    name: "Burbuja con PET metalizado",
    category: "burbuja",
    family: "Bobinas",
    image: "/img/burbuja-pet.jpg",
    summary:
      "Bobina de burbuja con poliéster metalizado a una o dos caras, excelente aislante térmico.",
    specs: [
      "Poliéster metalizado",
      "A una o dos caras",
      "Excelente aislante térmico",
    ],
    tags: [],
  },

  /* -------------------------------------------------------------------- FOAM */
  {
    id: "foam-bobinas",
    name: "Bobinas de foam",
    category: "foam",
    family: "Foam",
    image: "/img/foam-bobina.jpg",
    summary:
      "La bobina de espuma de polietileno expandido de baja densidad protege eficazmente contra los impactos, con un alto rendimiento a un coste contenido.",
    specs: [
      "Espuma de polietileno expandido de baja densidad",
      "Protección efectiva contra impactos",
      "En distintos anchos y espesores",
    ],
    tags: ["A medida"],
  },
  {
    id: "perfil-cantoneras",
    name: "Perfiles y cantoneras de foam",
    category: "foam",
    family: "Foam",
    image: "/img/perfil-espuma.jpg",
    summary:
      "Perfiles y cantoneras en espuma de polietileno expandido que absorben los impactos y protegen frente a daños y arañazos.",
    specs: [
      "Espuma de polietileno expandido de baja densidad",
      "Absorben eficazmente los impactos",
      "Protección contra daños y arañazos",
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

  /* ------------------------------------------------ LÁMINA, SEMITUBO Y BOLSAS */
  {
    id: "lamina-retractil",
    name: "Lámina retráctil",
    category: "polietileno",
    family: "Lámina",
    image: "/img/lamina-retractil.jpg",
    summary:
      "Lámina de polietileno de baja densidad con gran capacidad de retracción, que se adapta a la forma del producto.",
    specs: [
      "Fabricada en polietileno de baja densidad",
      "Gran capacidad de retracción: se adapta a la forma del producto",
      "Alta protección y estabilidad en el transporte y el almacenamiento",
    ],
    tags: [],
  },
  {
    id: "semitubo",
    name: "Semitubo",
    category: "polietileno",
    family: "Semitubo",
    image: "/img/lamina-semitubo.jpg",
    summary:
      "Semitubo de polietileno que permite su apertura doblando el ancho para abarcar más producto.",
    specs: [
      "Fabricado en polietileno de baja y alta densidad",
      "Permite su apertura doblando el ancho",
      "Distintos anchos, hasta 1.900 mm",
      "Gramaje desde galga 100",
    ],
    tags: ["A medida"],
  },
  {
    id: "bolsas",
    name: "Bolsas",
    category: "polietileno",
    family: "Bolsas",
    image: "/img/bolsas.jpg",
    summary:
      "Todo tipo de bolsas en polietileno de baja densidad y polipropileno, para industria, comercio y alimentación.",
    specs: [
      "Polietileno de baja densidad y polipropileno",
      "Impresas y anónimas",
      "Distintos tamaños y gramajes",
      "Estándar, troqueladas, con y sin asas, autocierre",
    ],
    tags: ["Impresión personalizada", "A medida"],
  },

  /* ------------------------------------------------------------------- FLEJE */
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
      "Fleje de hilos de poliéster con adhesivo hot melt antideslizante, de aplicación manual con hebillas.",
    specs: [
      "Hilos de poliéster con adhesivo hot melt antideslizante",
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
    id: "flejadora-manual",
    name: "Flejadora manual",
    category: "fleje",
    family: "Accesorios",
    image: "/img/flejadora.jpg",
    summary:
      "Herramienta robusta y de fácil uso para asegurar cargas de forma rápida y eficiente.",
    specs: [
      "Herramienta robusta y de fácil uso",
      "Asegura las cargas de forma rápida y eficiente",
    ],
    tags: ["Uso manual"],
  },
  {
    id: "tensores",
    name: "Tensores",
    category: "fleje",
    family: "Accesorios",
    image: "/img/flejadora.jpg",
    summary:
      "El tensor manual permite tensar y cortar flejes de PP, PET, hot melt y composite de 19 a 25 mm.",
    specs: [
      "Tensa y corta flejes de PP, PET, hot melt y composite",
      "Para anchos de 19 a 25 mm",
      "Asegura las cargas de forma rápida y eficiente",
    ],
    tags: ["Uso manual"],
  },
  {
    id: "flejadora-fbtx19",
    name: "Flejadora semiautomática FBTX-19",
    category: "fleje",
    family: "Accesorios",
    image: "/img/flejadora-fbtx19.jpg",
    summary:
      "Flejadora manual con batería, de fiabilidad excepcional gracias a su diseño ergonómico y su construcción robusta.",
    specs: [
      "Flejadora manual con batería",
      "Diseño ergonómico y construcción robusta",
      "Para flejes de poliéster y polipropileno de 15 a 19 mm de ancho",
    ],
    tags: ["Uso manual"],
  },
  {
    id: "mesa-flejadora",
    name: "Mesa flejadora semiautomática",
    category: "fleje",
    family: "Accesorios",
    image: "/img/flejadora.jpg",
    summary:
      "Mesa flejadora de alto rendimiento para flejes de polipropileno y poliéster.",
    specs: [
      "De alto rendimiento",
      "Para flejes de polipropileno y poliéster de 5 a 15,5 mm de ancho",
    ],
    tags: ["Uso automático"],
  },
  {
    id: "carros-devanadores",
    name: "Carros devanadores",
    category: "fleje",
    family: "Accesorios",
    image: "/img/portarrollos.jpg",
    summary:
      "Dispensador móvil de color azul para fleje, con cajetín en la parte superior para las fichas y las hebillas.",
    specs: [
      "Dispensador móvil de color azul",
      "Cajetín en la parte superior para depositar las fichas y hebillas",
    ],
    tags: ["Uso manual"],
  },
  {
    id: "enlazadores",
    name: "Enlazadores",
    category: "fleje",
    family: "Accesorios",
    image: "/img/grapas-fleje.jpg",
    imageSize: "sm",
    summary:
      "Unión metálica para cerrar flejes de polipropileno y poliéster. En cajas de 4.000 unidades.",
    specs: [
      "Unión metálica para cerrar flejes de polipropileno y poliéster",
      "En cajas de 4.000 unidades",
    ],
    tags: ["Uso manual"],
  },
  {
    id: "hebillas",
    name: "Hebillas",
    category: "fleje",
    family: "Accesorios",
    image: "/img/hebillas.jpg",
    imageSize: "sm",
    summary:
      "Abrazadera de metal galvanizado para atar y sujetar flejes. En cajas de 1.000 unidades.",
    specs: [
      "Abrazadera de metal galvanizado para atar y sujetar flejes",
      "En cajas de 1.000 unidades",
    ],
    tags: ["Uso manual"],
  },

  /* ------------------------------------------------------------------ CARTÓN */
  {
    id: "cajas-carton",
    name: "Cajas de cartón",
    category: "carton",
    family: "Cartón",
    image: "/img/cajas-carton.jpg",
    summary:
      "Cajas de canal simple y doble, estándar o fabricadas a medida, incluidas cajas para palé.",
    specs: [
      "Canal simple y canal doble",
      "Estándar y a medida · cajas para palé",
      "Color marrón y blanco",
      "Posibilidad de impresión",
      "Producto reciclable",
    ],
    tags: ["A medida", "Impresión personalizada"],
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

  /* ------------------------------------------------------------------- PALÉS */
  {
    id: "pales-polietileno",
    name: "Palés de polietileno de alta densidad",
    category: "pales",
    family: "Palés",
    image: "/img/palet-polietileno.jpg",
    summary:
      "Palés fabricados en polietileno de alta densidad, muy resistentes y válidos para la exportación.",
    specs: [
      "Fabricados en polietileno de alta densidad",
      "Muy resistentes",
      "Válidos para la exportación",
      "Medidas 800 × 1200 mm",
    ],
    tags: [],
  },
  {
    id: "pales-segundo-uso",
    name: "Palés de 2.º uso",
    category: "pales",
    family: "Palés",
    image: "/img/palets.jpg",
    summary:
      "Palés de segundo uso: más manejables y económicos que el europalé, en las medidas más habituales.",
    specs: [
      "Palé americano 800 × 600 mm",
      "800 × 1200 mm ligero",
      "800 × 1200 mm fuerte (hasta 750 kg)",
      "Resistente, más manejable y económico que el europalé",
    ],
    variants: [
      "Americano 800 × 600",
      "800 × 1200 ligero",
      "800 × 1200 fuerte",
    ],
    tags: [],
  },

  /* -------------------------------------------------------------- MAQUINARIA */
  {
    id: "envolvedora-ecoplat",
    name: "Envolvedora de mesa rotativa Ecoplat Plus",
    category: "maquinaria",
    family: "Envolvedoras",
    image: "/img/envolvedora-ecoplat.jpg",
    summary:
      "Envolvedora de mesa rotativa para paletizar con film estirable, disponible en versión Base y FRD.",
    specs: [
      "Mesa rotativa para envolver palés con film estirable",
      "Versión Base con panel de pulsadores electromecánicos",
      "Versión FRD con pantalla y selector de parámetros JOG",
    ],
    variants: ["Base", "FRD"],
    tags: ["Uso automático"],
  },
  {
    id: "envolvedora-masterwrap",
    name: "Envolvedora de brazo giratorio Masterwrap HD Plus XL",
    category: "maquinaria",
    family: "Envolvedoras",
    image: "/img/envolvedora-masterwrap.jpg",
    summary:
      "Envolvedora de brazo giratorio para cargas pesadas o inestables: el palé permanece fijo y gira el brazo.",
    specs: [
      "Brazo giratorio: el palé permanece fijo",
      "Pantalla gráfica en color de 3,5 pulgadas y selector de parámetros JOG",
      "6 recetas programables",
      "Ciclo de subida y bajada, o sólo subida o sólo bajada",
    ],
    tags: ["Uso automático"],
  },
  {
    id: "envolvedora-robot",
    name: "Robot envolvedor Master Plus",
    category: "maquinaria",
    family: "Envolvedoras",
    image: "/img/envolvedora-robot.jpg",
    summary:
      "Robot autopropulsado para embalaje con film extensible, sin límite de tamaño ni de peso del palé.",
    specs: [
      "Robot autopropulsado para embalaje con film extensible",
      "Panel de control con JOG y pantalla gráfica en color",
      "6 programas memorizables",
      "Regulación de la velocidad de rotación",
    ],
    tags: ["Uso automático"],
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
