import { useState } from "react";
import { addSetToRoutine } from "../api/routines";
import { useAuth } from "../auth/AuthContext";

export default function SetForm({ routineId, activities, syncRoutine }) {
  const { token } = useAuth();
  const [error, setError] = useState(null);

  const tryAddSet = async (formData) => {
    setError(null);

    const activityId = formData.get("activityId");
    const count = formData.get("count");

    try {
      await addSetToRoutine(token, routineId, {
        activityId: Number(activityId),
        count: Number(count),
      });
      syncRoutine(); // refresh the routine to show new set
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <h3>Add a set</h3>
      <form action={tryAddSet}>
        <label>
          Activity
          <select name="activityId" required>
            <option value="">-- Select an activity --</option>
            {activities.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Count (reps)
          <input type="number" name="count" min="1" required />
        </label>
        <button>Add set</button>
      </form>
      {error && <p role="alert">{error}</p>}
    </>
  );
}