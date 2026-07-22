export interface CelebrityMatch {
  fullName: string;
  occupation: string;
  photoUrl: string;
}

export const MBTI_CELEBRITIES: Record<string, CelebrityMatch[]> = {
  INTJ: [
    { fullName: "Elon Musk", occupation: "Empresario / Tecnólogo", photoUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop" },
    { fullName: "Michelle Obama", occupation: "Abogada / Escritora", photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop" },
    { fullName: "Christopher Nolan", occupation: "Director de Cine", photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" },
    { fullName: "Stephen Hawking", occupation: "Físico Teórico", photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop" },
    { fullName: "Natalie Portman", occupation: "Actriz", photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" },
    { fullName: "Arnold Schwarzenegger", occupation: "Actor / Político", photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop" }
  ],
  INTP: [
    { fullName: "Albert Einstein", occupation: "Físico Teórico", photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" },
    { fullName: "Bill Gates", occupation: "Cofundador de Microsoft", photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop" },
    { fullName: "Marie Curie", occupation: "Científica / Física", photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop" },
    { fullName: "René Descartes", occupation: "Filósofo / Matemático", photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop" },
    { fullName: "Elliot Page", occupation: "Actor", photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop" },
    { fullName: "Sigourney Weaver", occupation: "Actriz", photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop" }
  ],
  ENTJ: [
    { fullName: "Steve Jobs", occupation: "Cofundador de Apple", photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop" },
    { fullName: "Margaret Thatcher", occupation: "Primera Ministra", photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop" },
    { fullName: "Harrison Ford", occupation: "Actor", photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop" },
    { fullName: "Charlize Theron", occupation: "Actriz", photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" },
    { fullName: "Gordon Ramsay", occupation: "Chef Profesional", photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" },
    { fullName: "Adele", occupation: "Cantante / Compositora", photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop" }
  ],
  ENTP: [
    { fullName: "Robert Downey Jr.", occupation: "Actor", photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop" },
    { fullName: "Mark Twain", occupation: "Escritor / Humorista", photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop" },
    { fullName: "Tom Hanks", occupation: "Actor", photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" },
    { fullName: "Thomas Edison", occupation: "Inventor / Científico", photoUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop" },
    { fullName: "Celine Dion", occupation: "Cantante", photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" },
    { fullName: "Weird Al Yankovic", occupation: "Cantante / Parodista", photoUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop" }
  ],
  INFJ: [
    { fullName: "Martin Luther King Jr.", occupation: "Líder de Derechos Civiles", photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop" },
    { fullName: "Nelson Mandela", occupation: "Activista / Político", photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop" },
    { fullName: "Lady Gaga", occupation: "Cantante / Actriz", photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop" },
    { fullName: "Nicole Kidman", occupation: "Actriz", photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" },
    { fullName: "Johann Wolfgang von Goethe", occupation: "Escritor", photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" },
    { fullName: "Benedict Cumberbatch", occupation: "Actor", photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop" }
  ],
  INFP: [
    { fullName: "Keanu Reeves", occupation: "Actor", photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop" },
    { fullName: "William Shakespeare", occupation: "Dramaturgo / Poeta", photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" },
    { fullName: "Audrey Hepburn", occupation: "Actriz / Humanitaria", photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop" },
    { fullName: "Johnny Depp", occupation: "Actor", photoUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop" },
    { fullName: "Princess Diana", occupation: "Filántropa / Realeza", photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop" },
    { fullName: "Vincent van Gogh", occupation: "Pintor Posimpresionista", photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop" }
  ],
  ENFJ: [
    { fullName: "Barack Obama", occupation: "Político / Expresidente", photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" },
    { fullName: "Oprah Winfrey", occupation: "Presentadora / Productora", photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop" },
    { fullName: "John Cusack", occupation: "Actor", photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop" },
    { fullName: "Jennifer Lawrence", occupation: "Actriz", photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" },
    { fullName: "Bono (U2)", occupation: "Músico / Filántropo", photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop" },
    { fullName: "Maya Angelou", occupation: "Poeta / Activista", photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop" }
  ],
  ENFP: [
    { fullName: "Quentin Tarantino", occupation: "Director de Cine", photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop" },
    { fullName: "Robin Williams", occupation: "Actor / Comediante", photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" },
    { fullName: "Walt Disney", occupation: "Animador / Productor", photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop" },
    { fullName: "Kelly Clarkson", occupation: "Cantante / Compositora", photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" },
    { fullName: "Salvador Dalí", occupation: "Pintor Surrealista", photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop" },
    { fullName: "Drew Barrymore", occupation: "Actriz / Productora", photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop" }
  ],
  ISTJ: [
    { fullName: "George Washington", occupation: "Militar / Político", photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop" },
    { fullName: "Angela Merkel", occupation: "Ex Canciller Alemana", photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop" },
    { fullName: "Jeff Bezos", occupation: "Fundador de Amazon", photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop" },
    { fullName: "Robert De Niro", occupation: "Actor", photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" },
    { fullName: "Queen Elizabeth II", occupation: "Monarca Británica", photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop" },
    { fullName: "Sigmund Freud", occupation: "Neurologo / Psicoanalista", photoUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop" }
  ],
  ISFJ: [
    { fullName: "Beyoncé", occupation: "Cantante / Compositora", photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" },
    { fullName: "Mother Teresa", occupation: "Santa / Activista", photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop" },
    { fullName: "Vin Diesel", occupation: "Actor", photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop" },
    { fullName: "Anne Hathaway", occupation: "Actriz", photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop" },
    { fullName: "Selena Gomez", occupation: "Actriz / Cantante", photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop" },
    { fullName: "Tiger Woods", occupation: "Golfista Profesional", photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop" }
  ],
  ESTJ: [
    { fullName: "Hillary Clinton", occupation: "Abogada / Política", photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop" },
    { fullName: "John D. Rockefeller", occupation: "Industrial / Magnate", photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" },
    { fullName: "Alec Baldwin", occupation: "Actor", photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop" },
    { fullName: "Sonia Sotomayor", occupation: "Jueza de la Corte Suprema", photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop" },
    { fullName: "Judge Judy", occupation: "Abogada / Conductora", photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" },
    { fullName: "Frank Sinatra", occupation: "Cantante / Actor", photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop" }
  ],
  ESFJ: [
    { fullName: "Taylor Swift", occupation: "Cantante / Compositora", photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" },
    { fullName: "Bill Clinton", occupation: "Político / Expresidente", photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop" },
    { fullName: "Jennifer Lopez", occupation: "Actriz / Cantante", photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop" },
    { fullName: "Steve Harvey", occupation: "Presentador / Comediante", photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" },
    { fullName: "Penelope Cruz", occupation: "Actriz", photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop" },
    { fullName: "Hugh Jackman", occupation: "Actor / Cantante", photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop" }
  ],
  ISTP: [
    { fullName: "Tom Cruise", occupation: "Actor", photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop" },
    { fullName: "Clint Eastwood", occupation: "Actor / Director", photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop" },
    { fullName: "Michael Jordan", occupation: "Basquetbolista Profesional", photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" },
    { fullName: "Scarlett Johansson", occupation: "Actriz", photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" },
    { fullName: "Bear Grylls", occupation: "Aventurero / Conductor", photoUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop" },
    { fullName: "Milla Jovovich", occupation: "Actriz", photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop" }
  ],
  ISFP: [
    { fullName: "Michael Jackson", occupation: "Músico / Cantante", photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop" },
    { fullName: "Frida Kahlo", occupation: "Pintora / Artista", photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop" },
    { fullName: "Lana Del Rey", occupation: "Cantante / Compositora", photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop" },
    { fullName: "Brad Pitt", occupation: "Actor", photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop" },
    { fullName: "David Beckham", occupation: "Futbolista Profesional", photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" },
    { fullName: "Ryan Gosling", occupation: "Actor", photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop" }
  ],
  ESTP: [
    { fullName: "Donald Trump", occupation: "Empresario / Político", photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop" },
    { fullName: "Madonna", occupation: "Cantante / Compositora", photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" },
    { fullName: "Winston Churchill", occupation: "Primer Ministro", photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" },
    { fullName: "Bruce Willis", occupation: "Actor", photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop" },
    { fullName: "Eddie Murphy", occupation: "Actor / Comediante", photoUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop" },
    { fullName: "Mike Tyson", occupation: "Boxeador Profesional", photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop" }
  ],
  ESFP: [
    { fullName: "Marilyn Monroe", occupation: "Actriz / Modelo", photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop" },
    { fullName: "Elvis Presley", occupation: "Cantautor / Actor", photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop" },
    { fullName: "Will Smith", occupation: "Actor / Rapero", photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop" },
    { fullName: "Serena Williams", occupation: "Tenista Profesional", photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop" },
    { fullName: "Cardi B", occupation: "Rapera / Cantautora", photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop" },
    { fullName: "Cristiano Ronaldo", occupation: "Futbolista Profesional", photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" }
  ]
};
