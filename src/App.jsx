import { BrowserRouter, Routes, Route } from "react-router-dom";
import ArticleList from "./components/ArticleList";

function App() {
  return (
    <BrowserRouter>
      <h1>Northcoders News</h1>
      <Routes>
        <Route path="/" element={<ArticleList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
