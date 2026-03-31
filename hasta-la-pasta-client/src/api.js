const BASE_URL = "http://localhost:3001/api";

async function handleResponse(res) {
  if (!res.ok) {
    let errorMessage = "Request failed";

    try {
      const errorData = await res.json();
      errorMessage = errorData.error || errorMessage;
    } catch {
      // ignore JSON parse failure
    }

    throw new Error(errorMessage);
  }

  return res.json();
}

export async function getRecipes() {
  const res = await fetch(`${BASE_URL}/recipes`);
  return handleResponse(res);
}

export async function getRecipe(id) {
  const res = await fetch(`${BASE_URL}/recipes/${id}`);
  return handleResponse(res);
}

export async function getPastaTypes() {
  const res = await fetch(`${BASE_URL}/pasta-types`);
  return handleResponse(res);
}

export async function createRecipe(data) {
  const res = await fetch(`${BASE_URL}/recipes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateRecipe(id, data) {
  const res = await fetch(`${BASE_URL}/recipes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteRecipe(id) {
  const res = await fetch(`${BASE_URL}/recipes/${id}`, {
    method: "DELETE",
  });
  return handleResponse(res);
}
