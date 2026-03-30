-- Pasta Types
INSERT INTO pasta_types (name, description) VALUES
  ('Spaghetti', 'Long, thin, cylindrical pasta'),
  ('Rigatoni', 'Large, ridged tube-shaped pasta'),
  ('Fettuccine', 'Flat, thick ribbon pasta'),
  ('Penne', 'Cylindrical pasta cut on the diagonal'),
  ('Bucatini', 'Thick hollow pasta, like spaghetti with a hole through the middle');

-- Ingredients
INSERT INTO ingredients (name, default_unit, category) VALUES
  ('guanciale', 'grams', 'meat'),
  ('pancetta', 'grams', 'meat'),
  ('ground beef', 'grams', 'meat'),
  ('ground pork', 'grams', 'meat'),
  ('eggs', 'count', 'dairy'),
  ('egg yolks', 'count', 'dairy'),
  ('pecorino romano', 'grams', 'cheese'),
  ('parmesan', 'grams', 'cheese'),
  ('heavy cream', 'ml', 'dairy'),
  ('whole milk', 'ml', 'dairy'),
  ('butter', 'tbsp', 'dairy'),
  ('crushed tomatoes', 'grams', 'sauce'),
  ('tomato paste', 'tbsp', 'sauce'),
  ('olive oil', 'tbsp', 'other'),
  ('garlic', 'cloves', 'other'),
  ('onion', 'count', 'other'),
  ('carrot', 'count', 'other'),
  ('celery stalks', 'count', 'other'),
  ('dry white wine', 'ml', 'other'),
  ('black pepper', 'tsp', 'other'),
  ('salt', 'tsp', 'other'),
  ('chili flakes', 'tsp', 'other'),
  ('basil', 'leaves', 'other'),
  ('anchovy fillets', 'count', 'other'),
  ('capers', 'tbsp', 'other'),
  ('black olives', 'grams', 'other');

-- -----------------------------------------------
-- Recipe 1: Spaghetti Carbonara
-- -----------------------------------------------
INSERT INTO recipes (name, prep_time, cook_time, servings, image_url, pasta_type_id)
VALUES ('Spaghetti Carbonara', 10, 20, 2, null,
  (SELECT id FROM pasta_types WHERE name = 'Spaghetti'));

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT r.id, i.id, v.quantity, v.unit
FROM recipes r
JOIN (VALUES
  ('guanciale',      150, 'grams'),
  ('egg yolks',      4,   'count'),
  ('eggs',           1,   'count'),
  ('pecorino romano', 50, 'grams'),
  ('black pepper',   1,   'tsp')
) AS v(name, quantity, unit) ON true
JOIN ingredients i ON i.name = v.name
WHERE r.name = 'Spaghetti Carbonara';

INSERT INTO steps (recipe_id, step_number, instruction)
SELECT r.id, v.step_number, v.instruction
FROM recipes r
JOIN (VALUES
  (1, 'Bring a large pot of generously salted water to a boil. Cook spaghetti until al dente.'),
  (2, 'Cut guanciale into small cubes and cook in a pan over medium heat until crispy. Keep the rendered fat in the pan.'),
  (3, 'In a bowl, whisk egg yolks, whole egg, and pecorino together. Season heavily with black pepper.'),
  (4, 'Before draining, reserve 1 cup of pasta cooking water.'),
  (5, 'Drain pasta and add directly to the pan with guanciale. Remove pan from heat.'),
  (6, 'Pour in the egg mixture and toss vigorously, adding pasta water a splash at a time to create a creamy sauce. Do not return to the burner or the eggs will scramble.')
) AS v(step_number, instruction) ON true
WHERE r.name = 'Spaghetti Carbonara';

-- -----------------------------------------------
-- Recipe 2: Bucatini all''Amatriciana
-- -----------------------------------------------
INSERT INTO recipes (name, prep_time, cook_time, servings, image_url, pasta_type_id)
VALUES ('Bucatini all''Amatriciana', 10, 25, 4, null,
  (SELECT id FROM pasta_types WHERE name = 'Bucatini'));

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT r.id, i.id, v.quantity, v.unit
FROM recipes r
JOIN (VALUES
  ('guanciale',       200, 'grams'),
  ('crushed tomatoes', 400, 'grams'),
  ('pecorino romano',  60, 'grams'),
  ('dry white wine',   60, 'ml'),
  ('chili flakes',    0.5, 'tsp'),
  ('black pepper',      1, 'tsp')
) AS v(name, quantity, unit) ON true
JOIN ingredients i ON i.name = v.name
WHERE r.name = 'Bucatini all''Amatriciana';

INSERT INTO steps (recipe_id, step_number, instruction)
SELECT r.id, v.step_number, v.instruction
FROM recipes r
JOIN (VALUES
  (1, 'Cut guanciale into thick strips and cook in a large pan over medium heat until the fat renders and edges crisp up.'),
  (2, 'Add chili flakes and cook 30 seconds, then deglaze with white wine. Let it reduce by half.'),
  (3, 'Add crushed tomatoes and simmer uncovered for 15 minutes until thickened.'),
  (4, 'Cook bucatini in heavily salted boiling water until al dente. Reserve 1 cup pasta water before draining.'),
  (5, 'Add drained pasta to the sauce and toss over medium heat for 1-2 minutes, adding pasta water as needed.'),
  (6, 'Plate and finish generously with grated pecorino romano.')
) AS v(step_number, instruction) ON true
WHERE r.name = 'Bucatini all''Amatriciana';

-- -----------------------------------------------
-- Recipe 3: Rigatoni alla Bolognese
-- -----------------------------------------------
INSERT INTO recipes (name, prep_time, cook_time, servings, image_url, pasta_type_id)
VALUES ('Rigatoni alla Bolognese', 20, 120, 6, null,
  (SELECT id FROM pasta_types WHERE name = 'Rigatoni'));

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT r.id, i.id, v.quantity, v.unit
FROM recipes r
JOIN (VALUES
  ('ground beef',    300, 'grams'),
  ('ground pork',    200, 'grams'),
  ('onion',            1, 'count'),
  ('carrot',           1, 'count'),
  ('celery stalks',    2, 'count'),
  ('crushed tomatoes', 400, 'grams'),
  ('dry white wine', 120, 'ml'),
  ('whole milk',     120, 'ml'),
  ('olive oil',        2, 'tbsp'),
  ('butter',           1, 'tbsp'),
  ('parmesan',        60, 'grams')
) AS v(name, quantity, unit) ON true
JOIN ingredients i ON i.name = v.name
WHERE r.name = 'Rigatoni alla Bolognese';

INSERT INTO steps (recipe_id, step_number, instruction)
SELECT r.id, v.step_number, v.instruction
FROM recipes r
JOIN (VALUES
  (1, 'Finely dice onion, carrot, and celery. Cook in olive oil and butter over low heat for 10 minutes until soft.'),
  (2, 'Raise heat to medium-high and add ground beef and pork. Break apart and cook until all liquid has evaporated and meat begins to brown.'),
  (3, 'Pour in white wine and stir until fully absorbed.'),
  (4, 'Add crushed tomatoes, stir to combine, and reduce heat to the lowest setting.'),
  (5, 'Simmer uncovered for at least 90 minutes, stirring occasionally.'),
  (6, 'Stir in whole milk in the last 10 minutes of cooking to round out the acidity.'),
  (7, 'Cook rigatoni until al dente. Toss with sauce and a ladleful of pasta water. Finish with parmesan.')
) AS v(step_number, instruction) ON true
WHERE r.name = 'Rigatoni alla Bolognese';