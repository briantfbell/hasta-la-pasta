const BASE_URL = "http://localhost:3001/api";

export async function getRecipes() {
  const res = await fetch(`${BASE_URL}/recipes`);
  return res.json();
}

export async function getRecipe(id) {
  const res = await fetch(`${BASE_URL}/recipes/${id}`);
  return res.json();
}

export async function getPastaTypes() {
  const res = await fetch(`${BASE_URL}/pasta-types`);
  return res.json();
}

export async function createRecipe(data) {
  const res = await fetch(`${BASE_URL}/recipes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateRecipe(id, data) {
  const res = await fetch(`${BASE_URL}/recipes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteRecipe(id) {
  const res = await fetch(`${BASE_URL}/recipes/${id}`, {
    method: "DELETE",
  });
  return res.json();
}
