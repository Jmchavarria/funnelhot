📘 funnelhot-pruebaTecnica

Este es el repositorio de la prueba técnica desarrollada para Funnelhot, una plataforma enfocada en la gestión y entrenamiento de asistentes inteligentes. El proyecto implementa un dashboard de asistentes con funcionalidad de entrenamiento y simulación de chat usando Next.js y React. Incluye almacenamiento local, paginación, búsquedas, y una página para entrenar y conversar con un asistente simulado.

🔗 Demo desplegada: https://funnelhotassitant.vercel.app

🧠 Tecnologías principales

Este proyecto está construido con:

Next.js (App Router, React 18+)

TypeScript

Tailwind CSS para estilos

localStorage para persistencia de datos

Hooks personalizados para lógica modular

lucide-react para iconografía

Paginación, búsqueda, modales y menús flotantes

🚀 Características
📌 Lista de asistentes

Crea, edita, elimina y borra todos los assistants.

Búsqueda por nombre, idioma, personalidad, ID.

Paginación y ordenamiento.

Menú contextual (dropdown) por asistente.

Toasts de notificación para acciones importantes.

💾 Entrenamiento de prompts

Guarda prompts reutilizables por asistente.

Usa Ctrl + Enter para guardar rápidamente.

Persistencia local por asistente.

💬 Simulación de chat

Conversación simulada con respuestas aleatorias.

Indicador de escritura (typing).

Guardado de chats individual por asistente.

Reset de conversación con confirmación.

📂 Estructura de carpetas
.
├── app/
│   ├── (routes)/train/[id]/page.tsx     # Página de entrenamiento/chat
│   ├── features/
│   │   ├── assistants/                  # CRUD y lista
│   │   │   └── components/
│   │   │       └── AssistantCard/
│   │   ├── training/                    # Entrenamiento UI + hooks
│   │       ├── components/
│   │       └── hooks/
│   ├── shared/
│   │   └── components/                  # Componentes reutilizables
├── hooks/                                # Floating menu, helpers
├── types/                                # Tipos TypeScript
├── next.config.ts
├── tsconfig.json
└── package.json

📥 Instalación

Clona el repositorio y ejecuta:

git clone https://github.com/Jmchavarria/funnelhot-pruebaTecnica.git
cd funnelhot-pruebaTecnica
pnpm install     # o npm/yarn install
pnpm dev         # iniciar servidor de desarrollo


Abre tu navegador en:

http://localhost:3000

🧩 Módulos y Hooks clave
useAssistants

Controla:

Lista de assistants

Search, sort, pagination

CRUD (create, edit, delete)

Toast actions

useTraining

Encapsula:

Prompts por assistant

Draft local

Guardado persistente

useSimulatedChat

Encapsula:

Chat por assistant

Simulación de texto aleatorio

Guardado local + reset seguro

UI Modularizados

AssistantHeader

TrainingPanel

ChatPanel

🛠 Conceptos implementados
✨ Entrenamiento de prompts

Los prompts se guardan localmente y pueden volver a usarse, lo que simula una “memoria de entrenamiento” por assistant.

📁 Persistencia por assistant

Cada assistant tiene su propio:

Lista de prompts

Draft de texto

Historial de chat

Todo se almacena en localStorage con claves únicas por ID.

🧪 Flow principal de uso

Dashboard: Ver todos los assistants, editarlos o borrarlos.

Entrenar: Guardar prompts usando Ctrl + Enter o botón.

Chat: Simular conversación y guardar el historial.

Reset: Borrar conversación con confirmación.

🎯 Buenas prácticas incluidas

Separación de lógica usando Hooks personalizados

UI modularizada en componentes independientes

Persistencia y restauración de datos en localStorage

Paginación y búsqueda eficientes

Indicadores de interacción (typing, toasts)

📦 Dependencias destacadas

next – Framework React SSR/SSG

react – Biblioteca UI

lucide-react – Iconos modernos y ligeros

tailwindcss – Estilos utilitarios

🧠 Consideraciones y mejorables

✅ Modularización de lógica y presentación
✅ Reutilización de hooks y componentes
⚠️ Chat simulado sin IA real
⚠️ Integración futura con backend o IA externa

🧾 Licencia

Este repositorio es parte de una prueba técnica y no tiene licencia pública (por defecto).

🛜 Despliegue

Puedes desplegar fácilmente en Vercel (hosting recomendado para Next.js).
La app demo está disponible aquí:
🔗 https://funnelhotassitant.vercel.app
