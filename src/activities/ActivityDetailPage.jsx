import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";
import { getActivity, deleteActivity } from "../api/activities";

export default function ActivityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [activity, setActivity] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const data = await getActivity(id);
        setActivity(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchActivity();
  }, [id]);

  const tryDelete = async () => {
    setError(null);
    try {
      await deleteActivity(token, id);
      navigate("/activities");
    } catch (e) {
      setError(e.message);
    }
  };

  if (!activity) return <p>Loading...</p>;

  return (
    <>
      <h1>{activity.name}</h1>
      <p>{activity.description}</p>
      {activity.creatorName && <p>Created by: {activity.creatorName}</p>}
      {token && <button onClick={tryDelete}>Delete</button>}
      {error && <p role="alert">{error}</p>}
    </>
  );
}
