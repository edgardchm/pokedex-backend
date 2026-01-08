# Pokedex Backend - Nest.js + PostgreSQL + TypeORM

Backend completo para una Pokedex construido con Nest.js, PostgreSQL y TypeORM.

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- npm o yarn
- PostgreSQL (Railway o local)

## 🚀 Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Configuración de PostgreSQL (Railway)
DB_HOST=switchback.proxy.rlwy.net
DB_PORT=15576
DB_USER=postgres
DB_PASSWORD=tu_password_aqui
DB_NAME=railway
DB_SSL=true

# Puerto de la aplicación
PORT=3000
```

### 3. Ejecutar la aplicación

```bash
# Modo desarrollo
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

La aplicación estará disponible en `http://localhost:3000`

## 📚 Variables de Entorno

### Variables de Base de Datos

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DB_HOST` | Host de PostgreSQL | `switchback.proxy.rlwy.net` |
| `DB_PORT` | Puerto de PostgreSQL | `15576` |
| `DB_USER` | Usuario de la base de datos | `postgres` |
| `DB_PASSWORD` | Contraseña de la base de datos | `******` |
| `DB_NAME` | Nombre de la base de datos | `railway` |
| `DB_SSL` | Habilitar conexión SSL | `true` |

### Variables de Aplicación

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `PORT` | Puerto del servidor | `3000` |

## 🔒 Configuración SSL con PostgreSQL (Railway)

Railway requiere conexiones SSL para PostgreSQL. La configuración SSL está configurada en `app.module.ts`:

```typescript
ssl: process.env.DB_SSL === 'true' ? {
  rejectUnauthorized: false,
} : false,
```

### ¿Por qué `rejectUnauthorized: false`?

- Railway usa certificados SSL autofirmados
- `rejectUnauthorized: false` permite la conexión sin validar el certificado
- Es seguro en este contexto porque la conexión sigue siendo encriptada
- En producción con certificados válidos, puedes usar `rejectUnauthorized: true`

## 🧪 Probar la Conexión Localmente

### Opción 1: Usar Railway directamente

1. Asegúrate de tener las credenciales correctas en tu `.env`
2. Ejecuta `npm run start:dev`
3. Verifica los logs para confirmar la conexión

### Opción 2: Probar con PostgreSQL local

1. Instala PostgreSQL localmente
2. Crea una base de datos:
   ```sql
   CREATE DATABASE pokedex;
   ```
3. Actualiza tu `.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=tu_password_local
   DB_NAME=pokedex
   DB_SSL=false
   ```
4. Ejecuta `npm run start:dev`

### Verificar conexión

Si la conexión es exitosa, verás en los logs:
```
🚀 Aplicación corriendo en: http://localhost:3000
```

Si hay errores, verifica:
- Las credenciales en `.env`
- Que PostgreSQL esté corriendo
- Que el puerto no esté bloqueado por firewall

## 📡 Endpoints REST

### Endpoints de Pokemon

#### GET /pokemon
Obtiene todos los pokemons con sus tipos.

**Respuesta:**
```json
[
  {
    "id": 1,
    "name": "Pikachu",
    "height": 0.4,
    "weight": 6.0,
    "base_experience": 112,
    "sprite_url": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    "created_at": "2024-01-01T00:00:00.000Z",
    "types": [
      {
        "id": 1,
        "name": "electric"
      }
    ]
  }
]
```

### GET /pokemon/:id
Obtiene un pokemon específico por ID.

**Parámetros:**
- `id` (number): ID del pokemon

**Respuesta:**
```json
{
  "id": 1,
  "name": "Pikachu",
  "height": 0.4,
  "weight": 6.0,
  "base_experience": 112,
  "sprite_url": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
  "created_at": "2024-01-01T00:00:00.000Z",
  "types": [
    {
      "id": 1,
      "name": "electric"
    }
  ]
}
```

### POST /pokemon
Crea un nuevo pokemon. Puedes usar `typeIds` o `typeNames` (o ambos).

**Body (con typeIds):**
```json
{
  "name": "Pikachu",
  "height": 0.4,
  "weight": 6.0,
  "base_experience": 112,
  "sprite_url": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
  "typeIds": [1, 2]
}
```

**Body (con typeNames - más fácil, crea tipos automáticamente):**
```json
{
  "name": "Pikachu",
  "height": 0.4,
  "weight": 6.0,
  "base_experience": 112,
  "sprite_url": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
  "typeNames": ["electric"]
}
```

**Respuesta:**
```json
{
  "id": 1,
  "name": "Pikachu",
  "height": 0.4,
  "weight": 6.0,
  "base_experience": 112,
  "sprite_url": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
  "created_at": "2024-01-01T00:00:00.000Z",
  "types": [
    {
      "id": 1,
      "name": "electric"
    },
    {
      "id": 2,
      "name": "normal"
    }
  ]
}
```

### Endpoints de Type

#### GET /type
Obtiene todos los tipos.

**Respuesta:**
```json
[
  {
    "id": 1,
    "name": "electric"
  },
  {
    "id": 2,
    "name": "fire"
  }
]
```

#### GET /type/:id
Obtiene un tipo específico por ID.

**Parámetros:**
- `id` (number): ID del tipo

**Respuesta:**
```json
{
  "id": 1,
  "name": "electric"
}
```

#### POST /type
Crea un nuevo tipo.

**Body:**
```json
{
  "name": "electric"
}
```

**Respuesta:**
```json
{
  "id": 1,
  "name": "electric"
}
```

## 🗄️ Modelo de Datos

### Pokemon
- `id` (PK, auto-increment)
- `name` (string)
- `height` (decimal)
- `weight` (decimal)
- `base_experience` (number)
- `sprite_url` (string)
- `created_at` (timestamp)

### Type
- `id` (PK, auto-increment)
- `name` (string, unique)

### Relación
- **Pokemon ↔ Type**: Muchos a muchos
- Tabla intermedia: `pokemon_types`

## 📁 Estructura del Proyecto

```
src/
├── entities/
│   ├── pokemon.entity.ts
│   └── type.entity.ts
├── pokemon/
│   ├── dto/
│   │   └── create-pokemon.dto.ts
│   ├── pokemon.controller.ts
│   ├── pokemon.service.ts
│   └── pokemon.module.ts
├── app.module.ts
└── main.ts
```

## 🔧 Comandos Disponibles

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod

# Testing
npm run test
npm run test:e2e

# Linting
npm run lint
```

## ⚠️ Notas Importantes

1. **Synchronize**: En `app.module.ts`, `synchronize: true` está habilitado para desarrollo. En producción, desactívalo y usa migraciones.

2. **Validación**: Los DTOs usan `class-validator` para validar los datos de entrada.

3. **CORS**: CORS está habilitado. Ajusta según tus necesidades de seguridad.

4. **Seguridad**: Nunca commitees el archivo `.env` con credenciales reales.

## 📝 Ejemplo de Uso con cURL

### Poblar las tablas (Recomendado)

```bash
# 1. Crear tipos primero
curl -X POST http://localhost:3000/type \
  -H "Content-Type: application/json" \
  -d '{"name": "electric"}'

curl -X POST http://localhost:3000/type \
  -H "Content-Type: application/json" \
  -d '{"name": "fire"}'

# 2. Crear pokemon con nombres de tipos (más fácil - crea tipos automáticamente)
curl -X POST http://localhost:3000/pokemon \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pikachu",
    "height": 0.4,
    "weight": 6.0,
    "base_experience": 112,
    "sprite_url": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    "typeNames": ["electric"]
  }'

# O crear pokemon con IDs de tipos
curl -X POST http://localhost:3000/pokemon \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Charizard",
    "height": 1.7,
    "weight": 90.5,
    "base_experience": 267,
    "sprite_url": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
    "typeIds": [2, 3]
  }'
```

### Consultar datos

```bash
# Obtener todos los pokemons
curl http://localhost:3000/pokemon

# Obtener un pokemon por ID
curl http://localhost:3000/pokemon/1

# Obtener todos los tipos
curl http://localhost:3000/type

# Obtener un tipo por ID
curl http://localhost:3000/type/1
```

> 💡 **Tip**: Revisa el archivo `EJEMPLOS_POBLAR_DATOS.md` para más ejemplos detallados.

