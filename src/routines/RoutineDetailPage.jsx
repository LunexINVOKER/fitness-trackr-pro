import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";
import { getRoutine, deleteRoutine, deleteSet } from "../api/routines";
import { getActivities } from "../api/activities";
import SetForm from "./SetForm";

export default function RoutineDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [routine, setRoutine] = useState(null);
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);

  const fetchRoutine = async () => {
    try {
      const data = await getRoutine(id);
      setRoutine(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchRoutine();
  }, [id]);

  // Fetch activities for the "add set" dropdown
  useEffect(() => {
    const fetchActivities = async () => {
      const data = await getActivities();
      setActivities(data);
    };
    fetchActivities();
  }, []);

  const tryDeleteRoutine = async () => {
    setError(null);
    try {
      await deleteRoutine(token, id);
      navigate("/routines");
    } catch (e) {
      setError(e.message);
    }
  };

  const tryDeleteSet = async (setId) => {
    try {
      await deleteSet(token, setId);
      fetchRoutine(); // refresh routine to update sets list
    } catch (e) {
      setError(e.message);
    }
  };

  if (!routine) return <p>Loading...</p>;

  const sets = routine.activities || [];

  return (
    <>
      <h1>{routine.name}</h1>
      <p>Goal: {routine.goal}</p>
      {routine.creatorName && <p>Created by: {routine.creatorName}</p>}

      {token && <button onClick={tryDeleteRoutine}>Delete routine</button>}
      {error && <p role="alert">{error}</p>}

      <h2>Sets</h2>
      {sets.length === 0 ? (
        <p>No sets yet. Add one below!</p>
      ) : (
        <ul>
          {sets.map((set) => (
            <li key={set.id}>
              <p>
                {set.name} — Count: {set.count}
                {" "}(Reps: {set.count})
              </p>
              {token && (
                <button onClick={() => tryDeleteSet(set.id)}>
                  Delete set
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {token && (
        <SetForm
          routineId={id}
          activities={activities}
          syncRoutine={fetchRoutine}
        />
      )}
    </>
  );
}