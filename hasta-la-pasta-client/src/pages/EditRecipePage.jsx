import { useParams } from "react-router-dom";

export default function EditRecipePage() {
  const { id } = useParams();

  return (
    <main>
      <h1>Edit Recipe Page</h1>
      <p>Recipe ID: {id}</p>
    </main>
  );
}
