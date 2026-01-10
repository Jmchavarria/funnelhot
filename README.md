# 🧠 Funnelhot – Prueba Técnica

Plataforma de gestión y entrenamiento de asistentes inteligentes desarrollada como prueba técnica para Funnelhot.  
Incluye dashboard de asistentes, sistema de entrenamiento de prompts y simulación de chat por asistente.

🔗 **Demo:** https://funnelhotassitant.vercel.app

---


---

## 🧩 Características implementadas

- Dashboard de asistentes con CRUD completo.
- Sistema de búsqueda y paginación.
- Menú flotante contextual por asistente.
- Entrenamiento de prompts por asistente con persistencia local.
- Simulación de chat con historial independiente por asistente.
- Indicador visual de escritura (*typing*).
- Toasts de notificación para acciones.
- UI responsive (mobile / desktop).
- Persistencia de datos mediante `localStorage`.

---

## ⏳ Si tuve que priorizar, dejé fuera

- Integración con un backend real o API externa.  
  ➜ Se utilizó `localStorage` para simular persistencia sin depender de infraestructura.

- Conexión a un modelo de IA real (OpenAI, etc.).  
  ➜ El chat se simula con respuestas aleatorias para demostrar el flujo completo de entrenamiento + conversación.

- Autenticación de usuarios.  
  ➜ No era requerida para validar la arquitectura ni el comportamiento principal del sistema.

---

## ⚙️ Decisiones técnicas

| Decisión | Motivo |
|--------|--------|
| Next.js App Router | Estructura moderna y escalable. |
| Hooks personalizados (`useAssistants`, `useTraining`, `useSimulatedChat`) | Separación clara de lógica y UI. |
| Persistencia en `localStorage` | Mantener el proyecto 100% funcional sin backend. |
| Modularización por features | Facilita mantenimiento y lectura del código. |
| Tailwind CSS | Velocidad de desarrollo y diseño consistente. |
| Tipado fuerte con TypeScript | Menos errores y mayor claridad en la arquitectura. |

---

## 🕒 Tiempo aproximado de dedicación

| Tarea | Tiempo |
|------|--------|
| Arquitectura inicial | 1 h |
| Dashboard y CRUD de asistentes | 2 h |
| Entrenamiento de prompts | 1 h |
| Simulación de chat | 1 h |
| Modularización y refactor | 1.5 h |
| Documentación y README | 0.5 h |

**Total aproximado:** **7 horas**


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

