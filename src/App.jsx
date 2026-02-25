import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ArticleList from "./components/ArticleList";
import SingleArticle from "./components/SingleArticle";
import NotFound from "./components/NotFound";

function App() {
  return (
    <BrowserRouter>
      <h1>Northcoders News</h1>

      <nav style={{ marginBottom: "1rem" }}>
        <Link to="/">Home</Link> | <Link to="/topics/coding">Coding</Link> |{" "}
        <Link to="/topics/football">Football</Link> |{" "}
        <Link to="/topics/cooking">Cooking</Link>
      </nav>

      <Routes>
        <Route path="/" element={<ArticleList />} />
        <Route path="/articles/:article_id" element={<SingleArticle />} />
        <Route path="/topics/:topic" element={<ArticleList />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
