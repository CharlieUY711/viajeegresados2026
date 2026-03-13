export const es = {
  lang: "es",
  langName: "Español",

  // ─── App general ────────────────────────────────────────────────────────────
  app: {
    name: "ViajeGrad",
    tagline: "Egreso 2025",
    countdown: "Cuenta regresiva:",
    daysLeft: "días restantes",
    copyright: "© 2025 ViajeGrad. Todos los derechos reservados.",
  },

  // ─── Nav ─────────────────────────────────────────────────────────────────────
  nav: {
    dashboard:    "Inicio",
    events:       "Eventos",
    finance:      "Finanzas",
    commissions:  "Comisiones",
    gallery:      "Galería",
    documents:    "Documentos",
    games:        "Juegos",
    profile:      "Mi Perfil",
  },

  // ─── Page titles ─────────────────────────────────────────────────────────────
  pages: {
    dashboard:   { title: "Inicio",        desc: "¡Bienvenido/a! Esto es lo que está pasando." },
    events:      { title: "Eventos",       desc: "Gestioná los eventos del viaje de egresados." },
    finance:     { title: "Finanzas",      desc: "Controlá ingresos, gastos y el progreso de la recaudación." },
    commissions: { title: "Comisiones",    desc: "Organizá grupos de trabajo y tareas." },
    gallery:     { title: "Galería",       desc: "Compartí fotos y recuerdos del grupo." },
    documents:   { title: "Documentos",    desc: "Accedé a archivos y recursos compartidos." },
    games:       { title: "Juegos y Rifas",desc: "¡Competí, predecí y divertite!" },
    profile:     { title: "Mi Perfil",     desc: "Gestioná tu cuenta y preferencias." },
  },

  // ─── Topnav ──────────────────────────────────────────────────────────────────
  topnav: {
    search: "Buscar…",
    role: {
      admin:  "administrador",
      member: "miembro",
    },
  },

  // ─── Auth ─────────────────────────────────────────────────────────────────────
  auth: {
    welcome: "Bienvenido/a",
    signInPrompt: "Iniciá sesión en tu cuenta para continuar.",
    email: "Correo electrónico",
    emailPlaceholder: "vos@ejemplo.com",
    password: "Contraseña",
    passwordPlaceholder: "••••••••",
    signIn: "Iniciar sesión",
    noAccount: "¿No tenés cuenta?",
    contactOrganizer: "Contactá al organizador del viaje",
    stats: {
      families:  "Familias",
      events:    "Eventos planificados",
      raised:    "Recaudado hasta hoy",
      days:      "Días para el viaje",
    },
    hero: {
      line1: "Planificá el viaje",
      line2: "de sus vidas.",
      desc:  "Coordiná recaudación, eventos, finanzas y recuerdos — todo en un solo lugar para el viaje de egresados de tu hijo/a.",
    },
    errors: {
      invalid: "Credenciales inválidas. Verificá tu correo y contraseña.",
    },
  },

  // ─── Dashboard ────────────────────────────────────────────────────────────────
  dashboard: {
    stats: {
      totalRaised:    "Total Recaudado",
      goal:           "Meta",
      progress:       "Progreso",
      remaining:      "restantes",
      events:         "Eventos",
      upcomingEvents: "próximos",
      families:       "Familias",
      confirmed:      "Todas confirmadas",
    },
    fundraising: {
      title:    "Progreso de Recaudación",
      subtitle: "Seguimiento de aportes hacia la meta del viaje",
      raised:   "recaudado",
      still:    "faltan para alcanzar la meta.",
    },
    upcoming: {
      title:    "Próximos Eventos",
      subtitle: "Los 4 eventos más cercanos",
    },
    activity: {
      title:    "Actividad Reciente",
      subtitle: "Últimas actualizaciones del grupo",
    },
    photos: {
      title:    "Últimas Fotos",
      subtitle: "Recuerdos compartidos recientemente",
      viewAll:  "Ver todas →",
    },
    activityVerbs: {
      uploaded:    "subió",
      added:       "agregó",
      created:     "creó el evento",
      joined:      "se unió a",
      uploaded_doc:"subió el documento",
      photos:      "fotos",
      income:      "de ingreso",
    },
  },

  // ─── Events ───────────────────────────────────────────────────────────────────
  events: {
    newEvent:      "Nuevo Evento",
    searchPlaceholder: "Buscar eventos…",
    allStatuses:   "Todos los estados",
    statuses: {
      upcoming:  "Próximo",
      ongoing:   "En curso",
      completed: "Finalizado",
      cancelled: "Cancelado",
    },
    categories: {
      fundraising: "Recaudación",
      social:      "Social",
      meeting:     "Reunión",
      trip:        "Viaje",
    },
    fields: {
      title:           "Título",
      titlePlaceholder:"Nombre del evento",
      description:     "Descripción",
      descPlaceholder: "Describí el evento…",
      dateTime:        "Fecha y hora",
      category:        "Categoría",
      location:        "Lugar",
      locationPlaceholder: "Ej: Salón del colegio",
      maxParticipants: "Máx. participantes",
      maxPlaceholder:  "Sin límite",
      until:           "Hasta",
    },
    participants: "participantes",
    full:          "completo",
    createModal:   "Crear Evento",
    editModal:     "Editar Evento",
    saveChanges:   "Guardar cambios",
    create:        "Crear Evento",
    cancel:        "Cancelar",
    empty: {
      title: "Sin eventos",
      desc:  "Creá tu primer evento o ajustá los filtros.",
    },
    toast: {
      created: "Evento creado correctamente.",
      updated: "Evento actualizado.",
      deleted: "Evento eliminado.",
    },
  },

  // ─── Finance ──────────────────────────────────────────────────────────────────
  finance: {
    stats: {
      income:   "Ingresos Totales",
      expenses: "Gastos Totales",
      net:      "Saldo Neto",
      vsLastMonth: "vs mes anterior",
      acrossEvents: "En todos los eventos",
      goalReached: "de la meta alcanzada",
    },
    progress: {
      title:    "Progreso hacia la Meta",
      still:    "aún se necesitan para alcanzar la meta.",
    },
    table: {
      title:       "Resumen por Evento",
      subtitle:    "Ingresos, gastos y saldo por actividad",
      event:       "Evento / Actividad",
      income:      "Ingresos",
      expenses:    "Gastos",
      net:         "Saldo",
      responsible: "Responsable",
      date:        "Fecha",
      total:       "TOTAL",
    },
    addTransaction:  "Agregar Movimiento",
    export:          "Exportar",
    modal: {
      title:          "Agregar Movimiento",
      type:           "Tipo",
      income:         "Ingreso",
      expense:        "Gasto",
      amount:         "Monto ($)",
      amountPlaceholder: "0,00",
      description:    "Descripción",
      descPlaceholder: "¿Para qué es?",
      event:          "Evento",
      general:        "General",
      date:           "Fecha",
      responsible:    "Persona responsable",
      respPlaceholder: "Nombre del responsable",
      add:            "Agregar Movimiento",
      cancel:         "Cancelar",
    },
  },

  // ─── Commissions ─────────────────────────────────────────────────────────────
  commissions: {
    newCommission: "Nueva Comisión",
    members:       "miembros",
    tasks:         "Tareas",
    addTask:       "+ Agregar tarea",
    lead:          "Líder",
    complete:      "completado",
    taskStatuses: {
      pending:     "Pendiente",
      in_progress: "En progreso",
      completed:   "Completado",
    },
    empty: {
      title: "Sin comisiones",
      desc:  "Creá la primera comisión de trabajo.",
    },
  },

  // ─── Gallery ─────────────────────────────────────────────────────────────────
  gallery: {
    allPhotos:     "Todas las fotos",
    upload:        "Subir fotos",
    photos:        "fotos",
    empty: {
      title: "Sin fotos todavía",
      desc:  "Subí la primera foto para comenzar.",
    },
  },

  // ─── Documents ────────────────────────────────────────────────────────────────
  documents: {
    upload:          "Subir archivo",
    searchPlaceholder: "Buscar documentos…",
    allCategories:   "Todas las categorías",
    stats: {
      total:    "Archivos totales",
      contracts:"Contratos",
      consents: "Autorizaciones",
      reports:  "Informes",
    },
    categories: {
      all:      "Todas las categorías",
      contract: "Contrato",
      report:   "Informe",
      budget:   "Presupuesto",
      consent:  "Autorización",
      other:    "Otro",
    },
    by:   "Por",
    empty: {
      title: "Sin documentos",
      desc:  "Subí un archivo o ajustá la búsqueda.",
    },
  },

  // ─── Games ────────────────────────────────────────────────────────────────────
  games: {
    leaderboard: "🏆 Clasificación",
    pools:       "🎲 Rifas y Apuestas",
    podium: {
      title:    "Podio",
    },
    rankings: {
      title:    "Clasificación completa",
      points:   "puntos",
      events:   "eventos",
      poolsWon: "rifas ganadas",
    },
    pool: {
      createPool:   "Crear Rifa",
      entryFee:     "Precio de entrada",
      deadline:     "Fecha límite",
      participants: "participantes",
      prize:        "Premio",
      join:         "Unirse",
      closed:       "Cerrado",
      types: {
        prediction: "Predicción",
        raffle:     "Rifa",
        challenge:  "Desafío",
      },
      statuses: {
        open:     "Abierto",
        closed:   "Cerrado",
        finished: "Finalizado",
      },
    },
  },

  // ─── Profile ──────────────────────────────────────────────────────────────────
  profile: {
    points:       "puntos",
    events:       "eventos",
    photos:       "fotos",
    commissions:  "Comisiones:",
    sections: {
      personal:   { title: "Información personal",  subtitle: "Actualizá tus datos de perfil" },
      notifications: { title: "Notificaciones", subtitle: "Elegí qué actualizaciones recibís" },
      security:   { title: "Seguridad",         subtitle: "Administrá tu contraseña y cuenta" },
    },
    fields: {
      fullName:   "Nombre completo",
      email:      "Correo electrónico",
    },
    save:         "Guardar cambios",
    saved:        "¡Guardado!",
    changePassword: "Cambiar contraseña",
    signOut:      "Cerrar sesión",
    dangerZone:   "Zona de riesgo",
    notifications: {
      new_events:       "Nuevos eventos creados",
      finance_updates:  "Actualizaciones de finanzas",
      gallery_uploads:  "Nuevas fotos subidas",
      game_results:     "Resultados de juegos y rifas",
    },
  },

  // ─── Common ───────────────────────────────────────────────────────────────────
  common: {
    roles: {
      admin:  "administrador",
      member: "miembro",
    },
    save:     "Guardar",
    cancel:   "Cancelar",
    delete:   "Eliminar",
    edit:     "Editar",
    add:      "Agregar",
    close:    "Cerrar",
    download: "Descargar",
    upload:   "Subir",
    create:   "Crear",
    search:   "Buscar",
    filter:   "Filtrar",
    all:      "Todos",
    loading:  "Cargando…",
    noData:   "Sin datos",
    by:       "por",
    of:       "de",
    and:      "y",
  },
};

export type Translations = typeof es;
