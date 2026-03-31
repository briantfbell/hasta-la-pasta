import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import AddRecipePage from "./pages/AddRecipePage";
import EditRecipePage from "./pages/EditRecipePage";

function App() {
  return (
    <BrowserRouter>
      <img
        src="/images/4000x559_Banner_Final.png"
        alt="Hasta la Pasta"
        style={{
          width: "100%",
          display: "block",
        }}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipes/new" element={<AddRecipePage />} />
        <Route path="/recipes/:id" element={<RecipeDetailPage />} />
        <Route path="/recipes/:id/edit" element={<EditRecipePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
