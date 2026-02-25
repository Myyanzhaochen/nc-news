import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const BASE_URL = "https://nc-news-be-6q9q.onrender.com";

function ArticleList() {
  const { topic } = useParams();

  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    let url = `${BASE_URL}/api/articles`;

    if (topic) {
      url += `?topic=${topic}`;
    }

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch articles");
        return res.json();
      })
      .then((data) => {
        setArticles(data.articles);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [topic]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {topic && <h2>Topic: {topic}</h2>}

      {articles.map((article) => (
        <div
          key={article.article_id}
          style={{
            border: "1px solid #ccc",
            margin: "1rem",
            padding: "1rem",
          }}
        >
          <img src={article.article_img_url} alt={article.title} width="200" />

          <h2>
            <Link to={`/articles/${article.article_id}`}>{article.title}</Link>
          </h2>

          <p>
            By {article.author} | Topic: {article.topic}
          </p>

          <p>
            Votes: {article.votes} | Comments: {article.comment_count}
          </p>

          <p>{new Date(article.created_at).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}

export default ArticleList;
