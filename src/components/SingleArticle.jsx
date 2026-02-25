import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BASE_URL = "https://nc-news-be-6q9q.onrender.com";
const loggedInUser = "cooljmessy";

function SingleArticle() {
  const { article_id } = useParams();

  // ARTICLE STATE
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // COMMENTS STATE
  const [comments, setComments] = useState([]);

  // VOTING STATE
  const [voteError, setVoteError] = useState(null);
  const [voteChange, setVoteChange] = useState(0);

  // POST COMMENT STATE
  const [newComment, setNewComment] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [postError, setPostError] = useState(null);

  // DELETE STATE
  const [deleteError, setDeleteError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // =========================
  // FETCH ARTICLE + COMMENTS
  // =========================
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    Promise.all([
      fetch(`${BASE_URL}/api/articles/${article_id}`),
      fetch(`${BASE_URL}/api/articles/${article_id}/comments`),
    ])
      .then(async ([articleRes, commentsRes]) => {
        if (!articleRes.ok) throw new Error("Failed to fetch article");
        if (!commentsRes.ok) throw new Error("Failed to fetch comments");

        const articleData = await articleRes.json();
        const commentsData = await commentsRes.json();

        setArticle(articleData.article);
        setComments(commentsData.comments);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [article_id]);

  // =========================
  // HANDLE VOTE
  // =========================
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

  // =========================
  // HANDLE POST COMMENT
  // =========================
  function handleSubmit(e) {
    e.preventDefault();

    if (!newComment.trim()) return;

    setIsPosting(true);
    setPostError(null);

    fetch(`${BASE_URL}/api/articles/${article_id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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

  // =========================
  // HANDLE DELETE COMMENT
  // =========================
  function handleDelete(comment_id) {
    setDeleteError(null);
    setDeletingId(comment_id);

    fetch(`${BASE_URL}/api/comments/${comment_id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Delete failed");

        setComments((current) =>
          current.filter((comment) => comment.comment_id !== comment_id),
        );

        setDeletingId(null);
      })
      .catch(() => {
        setDeleteError("Delete failed — please try again.");
        setDeletingId(null);
      });
  }

  // =========================
  // RENDER STATES
  // =========================
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

      <button onClick={() => handleVote(1)}>+</button>
      <button onClick={() => handleVote(-1)}>-</button>

      {voteError && <p style={{ color: "red" }}>{voteError}</p>}

      <hr />

      <h3>Add Comment</h3>

      <form onSubmit={handleSubmit}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows="4"
          cols="50"
        />
        <br />
        <button type="submit" disabled={isPosting}>
          {isPosting ? "Posting..." : "Post Comment"}
        </button>
      </form>

      {postError && <p style={{ color: "red" }}>{postError}</p>}

      <hr />

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

            {comment.author === loggedInUser && (
              <button
                onClick={() => handleDelete(comment.comment_id)}
                disabled={deletingId === comment.comment_id}
              >
                {deletingId === comment.comment_id ? "Deleting..." : "Delete"}
              </button>
            )}
          </div>
        ))
      )}

      {deleteError && <p style={{ color: "red" }}>{deleteError}</p>}
    </div>
  );
}

export default SingleArticle;
