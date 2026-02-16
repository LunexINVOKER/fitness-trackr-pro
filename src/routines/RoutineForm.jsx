import { useState } from "react";
import { createRoutine } from "../api/routines";
import { useAuth } from "../auth/AuthContext";

export default function RoutineForm({ syncRoutines }) {
  const { token } = useAuth();
  const [error, setError] = useState(null);

  const tryCreateRoutine = async (formData) => {
    setError(null);

    const name = formData.get("name");
    const goal = formData.get("goal");

    try {
      await createRoutine(token, { name, goal, isPublic: true });
      syncRoutines();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <h2>Create a new routine</h2>
      <form action={tryCreateRoutine}>
        <label>
          Name
          <input type="text" name="name" required />
        </label>
        <label>
          Goal
          <input type="text" name="goal" required />
        </label>
        <button>Create routine</button>
      </form>
      {error && <p role="alert">{error}</p>}
    </>
  );
}