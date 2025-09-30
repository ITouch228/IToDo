import "./TaskItem.css";
import { useState } from "react";

function TaskItem({ task, lang, onDeleteTask, onToggleComplete }) {
  const [isCompleted, setIsCompleted] = useState(task.is_completed || false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    if (!window.confirm("Уверены, что хотите удалить?")) return;
    setIsDeleting(true);
    setTimeout(() => {
      onDeleteTask(task);
    }, 2000);
  };

  const handleCheckboxChange = () => {
    const newCompletedState = !isCompleted;
    setIsCompleted(newCompletedState);
    setTimeout(() => {
      onToggleComplete(task.id, newCompletedState);
    }, 2000);
    if (newCompletedState) {
      setTimeout(() => {
        setIsDeleting(true);
      }, 1000);
    }
  };

  return (
    <li
      className={`task-item ${
        task.priority === 1 ? "low" : task.priority === 2 ? "medium" : "high"
      } ${isCompleted ? "completed" : ""} ${isDeleting ? "fade-out" : ""}`}
    >
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        {task.deadline && (
          <span className="task-deadline">
            {lang === "eng" ? "Due:" : "До:"} {task.deadline}
          </span>
        )}
      </div>
      <p className="task-description">
        {task.description?.substring(0, 10)}
        {task.description?.length > 10 ? "..." : ""}
      </p>
      <div className="task-actions">
        <button className="btn small">
          {lang === "eng" ? "Edit" : "Изменить"}
        </button>
        <button
          onClick={handleDelete}
          className="btn small danger"
          disabled={isDeleting}
        >
          {isDeleting
            ? lang === "eng"
              ? "Deleting..."
              : "Удаление..."
            : lang === "eng"
            ? "Delete"
            : "Удалить"}
        </button>

        <label className="custom-checkbox">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={handleCheckboxChange}
            disabled={isDeleting}
          />
          <span className="checkmark"></span>
        </label>
      </div>
    </li>
  );
}

export default TaskItem;
