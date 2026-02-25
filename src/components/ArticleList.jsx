import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BASE_URL = "https://nc-news-be-6q9q.onrender.com";

function ArticleList() {
  const { topic } = useParams();

  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const sort_by = searchParams.get("sort_by") || "created_at";
  const order = searchParams.get("order") || "desc";

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    let url = `${BASE_URL}/api/articles?sort_by=${sort_by}&order=${order}`;

    if (topic) {
      url += `&topic=${topic}`;
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
  }, [topic, sort_by, order]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {topic && <h2>Topic: {topic}</h2>}

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Sort by:
          <select
            value={sort_by}
            onChange={(e) =>
              setSearchParams({
                sort_by: e.target.value,
                order: order,
              })
            }
          >
            <option value="created_at">Date</option>
            <option value="votes">Votes</option>
            <option value="comment_count">Comment Count</option>
          </select>
        </label>

        <label style={{ marginLeft: "1rem" }}>
          Order:
          <select
            value={order}
            onChange={(e) =>
              setSearchParams({
                sort_by: sort_by,
                order: e.target.value,
              })
            }
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </label>
      </div>

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
