import { useState, useEffect } from "react";
import { Link } from "react-router";
import { getRoutines } from "../api/routines";
import { useAuth } from "../auth/AuthContext";
import RoutineForm from "./RoutineForm";

export default function RoutinesPage() {
  const { token } = useAuth();
  const [routines, setRoutines] = useState([]);

  const syncRoutines = async () => {
    const data = await getRoutines();
    setRoutines(data);
  };

  useEffect(() => {
    syncRoutines();
  }, []);

  return (
    <>
      <h1>Routines</h1>
      {token && <RoutineForm syncRoutines={syncRoutines} />}
      <ul>
        {routines.map((routine) => (
          <li key={routine.id}>
            <Link to={`/routines/${routine.id}`}>{routine.name}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}