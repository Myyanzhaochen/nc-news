import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const loggedInUser = "cooljmessy";
const BASE_URL = "https://nc-news-be-6q9q.onrender.com";

function SingleArticle() {
  const { article_id } = useParams();

  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [voteError, setVoteError] = useState(null);
  const [voteChange, setVoteChange] = useState(0);

  const [newComment, setNewComment] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [postError, setPostError] = useState(null);

  useEffect(() => {
    setIsLoading(true);

    fetch(`${BASE_URL}/api/articles/${article_id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch article");
        return res.json();
      })
      .then((data) => {
        setArticle(data.article);
      })
      .catch((err) => setError(err.message));

    fetch(`${BASE_URL}/api/articles/${article_id}/comments`)
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

  function handleVote(change) {
    setVoteError(null);
    setVoteChange((current) => current + change);

    fetch(`${BASE_URL}/api/articles/${article_id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inc_votes: change }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Vote failed");
      })
      .catch(() => {
        setVoteChange((current) => current - change);
        setVoteError("Vote failed — please try again.");
      });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!newComment.trim()) return;

    setIsPosting(true);
    setPostError(null);

    fetch(`${BASE_URL}/api/articles/${article_id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: loggedInUser,
        body: newComment,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to post comment");
        return res.json();
      })
      .then((data) => {
        setComments((current) => [data.comment, ...current]);
        setNewComment("");
        setIsPosting(false);
      })
      .catch(() => {
        setPostError("Comment failed to post");
        setIsPosting(false);
      });
  }

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

      <p>Votes: {article.votes + voteChange}</p>

      <div>
        <button onClick={() => handleVote(1)}>+</button>
        <button onClick={() => handleVote(-1)}>-</button>
      </div>

      {voteError && <p style={{ color: "red" }}>{voteError}</p>}

      <h3>Add Comment</h3>

      <form onSubmit={handleSubmit}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write your comment..."
        />
        <br />
        <button type="submit" disabled={isPosting}>
          {isPosting ? "Posting..." : "Post Comment"}
        </button>
        {postError && <p style={{ color: "red" }}>{postError}</p>}
      </form>

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
