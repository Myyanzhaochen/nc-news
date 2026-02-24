import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function SingleArticle() {
  const { article_id } = useParams();

  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    setIsLoading(true);

    fetch(`https://nc-news-be-6q9q.onrender.com/api/articles/${article_id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch article");
        return res.json();
      })
      .then((data) => {
        setArticle(data.article);
      })
      .catch((err) => setError(err.message));

    fetch(
      `https://nc-news-be-6q9q.onrender.com/api/articles/${article_id}/comments`,
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch comments");
        return res.json();
      })
      .then((data) => {
        setComments(data.comments);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [article_id]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!article) return <p>Article not found</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>{article.title}</h2>
      <p>
        By {article.author} | Topic: {article.topic}
      </p>
      <p>{new Date(article.created_at).toLocaleDateString()}</p>

      <img src={article.article_img_url} alt={article.title} width="400" />

      <p>{article.body}</p>

      <p>Votes: {article.votes}</p>

      <h3>Comments</h3>

      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        comments.map((comment) => (
          <div
            key={comment.comment_id}
            style={{
              border: "1px solid #ccc",
              margin: "1rem 0",
              padding: "1rem",
            }}
          >
            <p>
              <strong>{comment.author}</strong>
            </p>
            <p>{new Date(comment.created_at).toLocaleDateString()}</p>
            <p>{comment.body}</p>
            <p>Votes: {comment.votes}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default SingleArticle;
