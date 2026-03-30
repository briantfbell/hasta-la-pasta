DROP TABLE IF EXISTS recipe_ingredients;
DROP TABLE IF EXISTS steps;
DROP TABLE IF EXISTS recipes;
DROP TABLE IF EXISTS ingredients;
DROP TABLE IF EXISTS pasta_types;

CREATE TABLE pasta_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  prep_time INT,
  cook_time INT,
  servings INT,
  image_url TEXT,
  pasta_type_id INT REFERENCES pasta_types(id) ON DELETE SET NULL
);

CREATE TABLE ingredients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  default_unit VARCHAR(50),
  category VARCHAR(50)
);

CREATE TABLE recipe_ingredients (
  id SERIAL PRIMARY KEY,
  recipe_id INT REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id INT REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity DECIMAL(10, 2),
  unit VARCHAR(50)
);

CREATE TABLE steps (
  id SERIAL PRIMARY KEY,
  recipe_id INT REFERENCES recipes(id) ON DELETE CASCADE,
  step_number INT NOT NULL,
  instruction TEXT NOT NULL
);