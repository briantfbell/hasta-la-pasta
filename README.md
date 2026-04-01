# Hasta la Pasta

A no-nonsense pasta recipe web app. No ads. No life stories. Just ingredients and steps.

---

## Purpose

Hasta la Pasta is an application focused exclusively on pasta.
Users can browse recipes, filter by meat type and sauce type, view detailed ingredient lists and step-by-step instructions, and add or edit their own recipes.
The goal is simplicity. Put the app on a tablet, and have it sit on your kitchen counter while you cook.

---

## Tech Stack

- **Frontend:** React (Vite), React Router v6, CSS Modules
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Testing:** Jest, Supertest

---

## ERD

```
pasta_types: id, name, description
recipes: id, name, prep_time, cook_time, servings, image_url, pasta_type_id FK, meat_type, sauce_type
ingredients: id, name, default_unit, category
recipe_ingredients: id, recipe_id FK, ingredient_id FK, quantity, unit
steps: id, recipe_id FK, step_number, instruction
```

---

## Installation & Setup

### Prerequisites

- Node.js
- PostgreSQL
- npm

---

### 1. Clone the Repository

```bash
git clone https://github.com/briantfbell/hasta-la-pasta.git
cd hasta-la-pasta
```

---

### 2. Set Up the Database

```bash
sudo -u postgres createdb hasta_la_pasta
sudo -u postgres psql hasta_la_pasta < server/db/schema.sql
sudo -u postgres psql hasta_la_pasta < server/db/seed.sql
```

If `meat_type` and `sauce_type` columns are not yet in your recipes table, run:

```sql
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS meat_type VARCHAR(50);
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS sauce_type VARCHAR(50);
```

---

### 3. Set Up the Server

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` and set your database connection string:

```
DATABASE_URL=postgres://localhost:5432/hasta_la_pasta
PORT=3001
```

Start the server:

```bash
npm run dev     # development (nodemon)
npm start       # production
```

The API will be available at `http://localhost:3001`.

---

### 4. Set Up the Client

```bash
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

I will likely add a Docker aspect in the future.

---

## API Endpoints

| Method | Endpoint                       | Description                                    |
| ------ | ------------------------------ | ---------------------------------------------- |
| GET    | `/api/recipes`                 | Get all recipes                                |
| GET    | `/api/recipes/:id`             | Get a single recipe with ingredients and steps |
| POST   | `/api/recipes`                 | Create a new recipe                            |
| PUT    | `/api/recipes/:id`             | Update a recipe                                |
| DELETE | `/api/recipes/:id`             | Delete a recipe                                |
| GET    | `/api/recipes/:id/ingredients` | Get ingredients for a recipe                   |
| GET    | `/api/ingredients`             | Get all ingredients                            |
| GET    | `/api/ingredients/:id`         | Get a single ingredient                        |
| POST   | `/api/ingredients`             | Add a new ingredient                           |
| PUT    | `/api/ingredients/:id`         | Update an ingredient                           |
| DELETE | `/api/ingredients/:id`         | Delete an ingredient                           |
| GET    | `/api/ingredients/:id/recipes` | Get all recipes using an ingredient            |
| GET    | `/api/pasta-types`             | Get all pasta types                            |
| GET    | `/api/pasta-types/:id`         | Get a single pasta type                        |
| POST   | `/api/pasta-types`             | Add a new pasta type                           |
| PUT    | `/api/pasta-types/:id`         | Update a pasta type                            |
| DELETE | `/api/pasta-types/:id`         | Delete a pasta type                            |
| GET    | `/api/pasta-types/:id/recipes` | Get all recipes for a pasta type               |

---

## Features

- Browse all pasta recipes on the home page
- Filter recipes by meat type (beef, pork, chicken, vegetarian, etc.) and sauce type (tomato, cream, oil, etc.)
- View full recipe detail: ingredients with quantities, numbered steps, and metadata
- Add new recipes with custom ingredients and steps
- Edit or delete existing recipes

---

## Notes

- Photo upload is planned but not yet implemented; image URLs can be added manually
