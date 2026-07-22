import { QuizQuestion } from '../types';

export const VIBE_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    questionText: "¿Cómo preferís arrancar tu sábado a la mañana?",
    category: "Música",
    options: [
      { id: "1a", text: "Café y vinilos a bajo volumen", subtext: "Intimidad sonora" },
      { id: "1b", text: "Playlist enérgica y desayuno completo", subtext: "Arranque arriba" },
      { id: "1c", text: "Silencio total o sonidos de naturaleza", subtext: "Foco y meditación" },
      { id: "1d", text: "Podcast interesante mientras ordeno", subtext: "Mente inquieta" }
    ]
  },
  {
    id: 2,
    questionText: "Si tuvieras que elegir una paleta de colores para tu habitación:",
    category: "Cine",
    options: [
      { id: "2a", text: "Tonos tierra y luces cálidas bajas", subtext: "Refugio orgánico" },
      { id: "2b", text: "Colores pasteles y estética retro", subtext: "Estilo nostálgico" },
      { id: "2c", text: "Negro, grises y luces de neón", subtext: "Inspiración cyberpunk" },
      { id: "2d", text: "Blanco minimalista y plantas de interior", subtext: "Calma pura" }
    ]
  },
  {
    id: 3,
    questionText: "¿Qué preferís un viernes a la noche?",
    category: "Series",
    options: [
      { id: "3a", text: "Casa, luces bajas", subtext: "MÚSICA Y ALGO RICO" },
      { id: "3b", text: "Show en vivo", subtext: "CON AMIGOS Y RITMO" },
      { id: "3c", text: "Cena larga", subtext: "CONVERSACIONES PROFUNDAS" },
      { id: "3d", text: "Gaming o serie", subtext: "DESCONEXIÓN TOTAL" }
    ]
  },
  {
    id: 4,
    questionText: "Elegí una prenda de vestir indispensable en tu guardarropa:",
    category: "Ropa",
    options: [
      { id: "4a", text: "Buzo oversize de algodón peinado", subtext: "Comodidad ante todo" },
      { id: "4b", text: "Chaqueta de cuero vintage", subtext: "Carácter y nostalgia" },
      { id: "4c", text: "Zapatillas de diseño moderno", subtext: "Detalle urbano" },
      { id: "4d", text: "Prenda de lino de tonos claros", subtext: "Frescura fluida" }
    ]
  },
  {
    id: 5,
    questionText: "¿Qué tipo de lectura o narrativa te atrapa más?",
    category: "Libros",
    options: [
      { id: "5a", text: "Novela de realismo mágico o ficción poética", subtext: "Viaje imaginativo" },
      { id: "5b", text: "Biografía de un artista o ensayo cultural", subtext: "Aprender del pasado" },
      { id: "5c", text: "Thriller psicológico o policial oscuro", subtext: "Tensión constante" },
      { id: "5d", text: "Novela gráfica de diseño experimental", subtext: "Arte visual" }
    ]
  },
  {
    id: 6,
    questionText: "¿Qué destino te da más paz para una escapada?",
    category: "Destino",
    options: [
      { id: "6a", text: "Cabaña solitaria en el bosque o montaña", subtext: "Desconexión natural" },
      { id: "6b", text: "Ciudad histórica con cafeterías y librerías", subtext: "Paseo bohemio" },
      { id: "6c", text: "Playa desértica con sonido del mar constante", subtext: "Calma infinita" },
      { id: "6d", text: "Metrópolis repleta de muestras de arte y música", subtext: "Estímulo creativo" }
    ]
  },
  {
    id: 7,
    questionText: "Si tuvieras que definir tu ritmo hoy en día, sería:",
    category: "General",
    options: [
      { id: "7a", text: "Lento, analógico e introspectivo", subtext: "Paso a paso" },
      { id: "7b", text: "Rápido, dinámico y enfocado en proyectos", subtext: "En movimiento" },
      { id: "7c", text: "Ecléctico, cambiante según el día", subtext: "Multifacético" },
      { id: "7d", text: "Tranquilo, fluyendo con la corriente", subtext: "Sin presiones" }
    ]
  }
];
