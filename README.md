# 🧠 Funnelhot – Prueba Técnica

Plataforma de gestión y entrenamiento de asistentes inteligentes desarrollada como prueba técnica para Funnelhot.

Incluye dashboard de asistentes, sistema de entrenamiento de prompts y simulación de chat por asistente.

🔗 **Demo:** https://funnelhotassitant.vercel.app

---

## 🚀 Tecnologías

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- localStorage
- Hooks personalizados
- lucide-react

---

## ✨ Funcionalidades

### 📋 Gestión de Asistentes
- Crear, editar y eliminar asistentes.
- Búsqueda por nombre, idioma, personalidad e ID.
- Paginación automática.
- Menú flotante por asistente.

### 🧠 Entrenamiento
- Guardado de prompts por asistente.
- Uso rápido con **Ctrl + Enter**.
- Persistencia local por ID.

### 💬 Simulación de Chat
- Conversaciones simuladas.
- Indicador de escritura.
- Historial persistente por asistente.
- Reset con confirmación.

---

## 📂 Estructura

app/
├── (routes)/train/[id]/page.tsx # Página de entrenamiento
├── features/
│ ├── assistants/
│ └── training/
├── shared/components/
├── hooks/
└── types/


---

## ⚙️ Instalación

```bash
git clone https://github.com/Jmchavarria/funnelhot-pruebaTecnica.git
cd funnelhot-pruebaTecnica
pnpm install
pnpm dev

Abrir en navegador:
http://localhost:3000


Hooks Principales

| Hook               | Descripción                        |
| ------------------ | ---------------------------------- |
| `useAssistants`    | CRUD, búsqueda, paginación, toasts |
| `useTraining`      | Manejo de prompts por asistente    |
| `useSimulatedChat` | Chat simulado y persistente        |


Buenas Prácticas

Modularización por feature.

Separación lógica / UI.

Persistencia local por entidad.

Componentes reutilizables.

UI responsive.


🧪 Flujo de uso

Crear asistente.

Entrenar con prompts.

Simular conversación.

Reiniciar cuando sea necesario.



🛜 Deploy

Recomendado en Vercel:

https://funnelhotassitant.vercel.app


---

### 📌 ¿Cómo usarlo?

1. Entra a tu repo.
2. Abre el archivo `README.md`.
3. Borra el contenido.
4. Pega este bloque.
5. Guarda cambios.

GitHub lo renderiza automáticamente con diseño profesional.

---

Esto es exactamente el formato que usan repos grandes y empresas.
