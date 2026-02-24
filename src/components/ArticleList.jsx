import { useEffect, useState } from "react";

function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://nc-news-be-6q9q.onrender.com/api/articles")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch articles");
        }
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
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
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
          <h2>{article.title}</h2>
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
