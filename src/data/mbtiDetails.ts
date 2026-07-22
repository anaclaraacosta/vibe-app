export interface MbtiProfile {
  code: string;
  name: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
}

export const MBTI_PROFILES: Record<string, MbtiProfile> = {
  INTJ: {
    code: "INTJ",
    name: "El Arquitecto (The Architect)",
    description: "Pensadores estratégicos e intuitivos con un plan para cada detalle. Son analíticos, independientes y valoran el conocimiento lógico sobre las normas convencionales.",
    strengths: ["Pensamiento Estratégico", "Independencia Racional", "Determinación", "Innovación Teórica"],
    weaknesses: ["Tendencia al Desdén", "Distancia Emocional", "Perfeccionismo Extremo", "Impaciencia con Reglas"]
  },
  INTP: {
    code: "INTP",
    name: "El Lógico (The Logician)",
    description: "Inventores curiosos con una sed insaciable de conocimiento. Analizan constantemente patrones, valoran la precisión intelectual y aman las ideas especulativas.",
    strengths: ["Análisis Analítico", "Pensamiento Original", "Mente Abierta", "Gran Curiosidad"],
    weaknesses: ["Desconexión Práctica", "Dificultad Social", "Insatisfacción Constante", "Dudas Paralizantes"]
  },
  ENTJ: {
    code: "ENTJ",
    name: "El Comandante (The Commander)",
    description: "Líderes audaces y decididos que siempre encuentran o crean un camino. Tienen gran carisma, capacidad de planificación y eficiencia organizativa.",
    strengths: ["Liderazgo Decidido", "Planificación Eficiente", "Carisma Inspirador", "Autoconfianza"],
    weaknesses: ["Testarudez", "Intolerancia al Error", "Falta de Tacto", "Dificultad de Empatía"]
  },
  ENTP: {
    code: "ENTP",
    name: "El Innovador (The Debater)",
    description: "Pensadores rápidos y curiosos que no pueden resistirse a un reto intelectual. Son ingeniosos, adoran redefinir reglas y explorar nuevas ideas disruptivas.",
    strengths: ["Ingenio Rápido", "Gran Creatividad", "Resolución de Problemas", "Energía Comunicativa"],
    weaknesses: ["Falta de Foco", "Poco Respeto al Orden", "Intolerancia a Tareas Rutinarias", "Tendencia a Discutir"]
  },
  INFJ: {
    code: "INFJ",
    name: "El Consejero (The Advocate)",
    description: "Idealistas místicos y silenciosos, pero con convicciones morales firmes. Son empáticos, compasivos y buscan dar un significado profundo a sus vidas y relaciones.",
    strengths: ["Empatía Profunda", "Creatividad Conceptual", "Convicción Moral", "Intuición Humana"],
    weaknesses: ["Vulnerabilidad al Burnout", "Sensibilidad a Críticas", "Reservados al Extremo", "Expectativas Irrealistas"]
  },
  INFP: {
    code: "INFP",
    name: "El Mediador (The Mediator)",
    description: "Almas poéticas, amables y altruistas que siempre buscan el bien común. Son sumamente creativos, leales a sus ideales y valoran la autenticidad personal.",
    strengths: ["Empatía Profunda", "Idealismo Genuino", "Gran Creatividad", "Mente Abierta y Flexible"],
    weaknesses: ["Idealismo Irrealista", "Tendencia al Aislamiento", "Autocrítica Excesiva", "Sensibilidad al Conflicto"]
  },
  ENFJ: {
    code: "ENFJ",
    name: "El Protagonista (The Protagonist)",
    description: "Líderes carismáticos que inspiran y cautivan a su audiencia. Son sumamente cooperativos, altruistas y se preocupan por el desarrollo social del grupo.",
    strengths: ["Carisma Inspirador", "Altruismo Sincero", "Gran Empatía", "Liderazgo de Unión"],
    weaknesses: ["Sobreprotección", "Búsqueda de Aprobación", "Fluctuaciones de Ánimo", "Dificultad para Decir No"]
  },
  ENFP: {
    code: "ENFP",
    name: "El Activista (The Campaigner)",
    description: "Espíritus libres entusiastas, creativos y sociales. Siempre encuentran motivos para celebrar y conectan con la emoción humana con facilidad.",
    strengths: ["Energía Contagiosa", "Creatividad Brillante", "Habilidades Sociales", "Espontaneidad Alegre"],
    weaknesses: ["Dificultad para Enfocarse", "Desorganización Práctica", "Necesidad de Aprobación", "Hiperreflexión Emocional"]
  },
  ISTJ: {
    code: "ISTJ",
    name: "El Inspector (The Logistician)",
    description: "Personas prácticas, basadas en hechos, cuya confiabilidad es incuestionable. Valoran la estructura, las reglas claras y la lealtad familiar.",
    strengths: ["Gran Responsabilidad", "Honestidad Directa", "Cumplimiento del Deber", "Metodicidad"],
    weaknesses: ["Terquedad", "Dificultad ante Cambios", "Rigidez Normativa", "Dificultad de Conexión Afectiva"]
  },
  ISFJ: {
    code: "ISFJ",
    name: "El Defensor (The Defender)",
    description: "Protectores muy dedicados y cálidos, siempre listos para cuidar de sus seres queridos. Tienen un fuerte sentido del deber y aprecio por las costumbres.",
    strengths: ["Gran Lealtad", "Cuidado Detallista", "Espíritu Colaborativo", "Sentido Práctico"],
    weaknesses: ["Timidez Social", "Sobrecarga de Tareas", "Resistencia al Cambio", "Tomarse Críticas Personalmente"]
  },
  ESTJ: {
    code: "ESTJ",
    name: "El Ejecutivo (The Executive)",
    description: "Administradores excelentes, insuperables al gestionar cosas o personas. Son organizados, directos y creen firmemente en el orden social.",
    strengths: ["Gran Capacidad Organizativa", "Confiabilidad de Hecho", "Claridad al Explicar", "Dedicación Plena"],
    weaknesses: ["Falta de Flexibilidad", "Dificultad para Relajarse", "Falta de Tacto", "Fuerte Enfoque en Status Quo"]
  },
  ESFJ: {
    code: "ESFJ",
    name: "El Cónsul (The Consul)",
    description: "Personas extremadamente sociales, populares y de gran corazón. Siempre buscan ayudar, mantener la armonía grupal y respetar las costumbres.",
    strengths: ["Sentido de Comunidad", "Lealtad a Amigos", "Cálido y Amigable", "Excelente Mediador"],
    weaknesses: ["Inseguridad de Status", "Resistencia a la Crítica", "Sensibilidad al Rechazo", "Preocupación Excesiva"]
  },
  ISTP: {
    code: "ISTP",
    name: "El Virtuoso (The Virtuoso)",
    description: "Experimentadores audaces y prácticos, maestros en el uso de herramientas. Son calmados, observadores silenciosos y resolutivos ante emergencias.",
    strengths: ["Gran Sentido Práctico", "Adaptabilidad Instantánea", "Resolución de Crisis", "Mente Abierta"],
    weaknesses: ["Reservado al Extremo", "Indiferencia de Normas", "Aburrimiento Rápido", "Toma de Riesgos Excesiva"]
  },
  ISFP: {
    code: "ISFP",
    name: "El Aventurero (The Adventurer)",
    description: "Artistas flexibles y encantadores, listos para explorar y experimentar algo nuevo. Disfrutan de la armonía visual y viven en el presente.",
    strengths: ["Gran Sensibilidad Estética", "Calidez Humana", "Imaginación Creativa", "Espíritu Libre"],
    weaknesses: ["Poca Planificación", "Fluctuación de Ánimo", "Aversión a la Rutina", "Sensibilidad Extrema"]
  },
  ESTP: {
    code: "ESTP",
    name: "El Emprendedor (The Entrepreneur)",
    description: "Personas enérgicas y perceptivas que disfrutan de vivir al límite. Resuelven problemas en caliente, aman la acción y la estimulación sensorial.",
    strengths: ["Gran Audacia", "Acción Inmediata", "Observación Aguda", "Persuasión Social"],
    weaknesses: ["Impaciencia", "Aversión al Futuro Largo", "Poca Sensibilidad", "Riesgos Físicos Constantes"]
  },
  ESFP: {
    code: "ESFP",
    name: "El Animador (The Entertainer)",
    description: "Personas espontáneas, enérgicas y entusiastas. La vida nunca es aburrida a su alrededor; disfrutan la atención y gozan de los sentidos corporales.",
    strengths: ["Audacia y Estilo", "Excelentes Relaciones", "Optimismo Contagioso", "Practicidad Alegre"],
    weaknesses: ["Falta de Enfoque Profundo", "Dificultad de Planificar", "Sensibilidad a la Crítica", "Consumismo Material"]
  }
};
