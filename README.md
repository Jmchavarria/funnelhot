# 🧠 Funnelhot – Prueba Técnica

Plataforma de gestión y entrenamiento de asistentes inteligentes desarrollada como prueba técnica para Funnelhot.  
Incluye dashboard de asistentes, sistema de entrenamiento de prompts y simulación de chat por asistente.

🔗 **Demo:** https://funnelhotassitant.vercel.app

---

## 🚀 Tecnologías

- **Next.js (App Router)**
- **React + TypeScript**
- **Tailwind CSS**
- **localStorage** (persistencia local)
- **Hooks personalizados**
- **lucide-react** (iconografía)

---

## ✨ Funcionalidades

### 📋 Gestión de Asistentes
- Crear, editar y eliminar asistentes.
- Búsqueda por nombre, idioma, personalidad e ID.
- Paginación automática.
- Menú flotante contextual por asistente.

### 🧠 Entrenamiento
- Guardado de prompts por asistente.
- Uso rápido con **Ctrl + Enter**.
- Persistencia local por ID.

### 💬 Simulación de Chat
- Conversaciones simuladas con respuestas dinámicas.
- Indicador de escritura (*typing*).
- Historial persistente por asistente.
- Reinicio de conversación con confirmación.

---

## 📂 Estructura del proyecto


![Project structure](./public/readme/tree.png)


---

## ⚙️ Instalación

```bash
git clone https://github.com/Jmchavarria/funnelhot-pruebaTecnica.git
cd funnelhot-pruebaTecnica
pnpm install
pnpm dev


http://localhost:3000


🔑 Hooks principales

| Hook               | Descripción                                 |
| ------------------ | ------------------------------------------- |
| `useAssistants`    | CRUD, búsqueda, paginación y notificaciones |
| `useTraining`      | Manejo de prompts por asistente             |
| `useSimulatedChat` | Chat simulado y persistente                 |



📦 Dependencias destacadas

next – Framework React SSR/SSG

react – Biblioteca de interfaz de usuario

lucide-react – Iconos modernos y ligeros

tailwindcss – Estilos utilitarios


Buenas prácticas

Modularización por features.

Separación clara entre lógica y presentación.

Persistencia local por entidad.

Componentes reutilizables.

UI totalmente responsive.


🧪 Flujo de uso

Crear un asistente.

Entrenarlo con prompts.

Simular conversación.

Reiniciar cuando sea necesario.

🛜 Despliegue

Recomendado con Vercel:

https://funnelhotassitant.vercel.app

