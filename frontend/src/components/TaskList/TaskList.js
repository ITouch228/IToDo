import { useState } from "react";
import TaskItem from "../TaskItem/TaskItem";
import "./TaskList.css";

function TaskList({
  lang,
  tasks,
  titles,
  emptyMessages,
  onDeleteTask,
  onToggleComplete,
  onEditTask
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const sortedTasks = [...tasks].sort((a, b) => b.priority - a.priority);

  return (
    <section className="task-section">
      <div className="task-section-header">
        <button
          className="toggle-section-btn"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? "Collapse section" : "Expand section"}
        >
          <svg
            className={`toggle-icon ${isExpanded ? "expanded" : ""}`}
            width="32"
            height="32"
            viewBox="0 0 24 24"
          >
            <path d="M7 10l5 5 5-5z" fill="currentColor" />
          </svg>
        </button>
        <h2 className="section-title">
          {lang === "eng" ? titles["eng"] : titles["ru"]}
        </h2>
      </div>

      {isExpanded ? (
        <>
          {sortedTasks.length > 0 ? (
            <ul className="task-list">
              {sortedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  lang={lang}
                  onDeleteTask={onDeleteTask}
                  onToggleComplete={onToggleComplete}
                  section={titles["eng"]}
                  onEditTask={(task) => onEditTask(task)}
                />
              ))}
            </ul>
          ) : (
            <p className="empty-message">
              {lang === "eng" ? emptyMessages["eng"] : emptyMessages["ru"]}
            </p>
          )}
        </>
      ) : (
        <>
          <p className={`empty-message${titles["eng"] === "Overdue Tasks" ? " overdue" : ""}`}>
            {lang === "eng"
              ? sortedTasks.length === 0
                ? emptyMessages["eng"]
                : `${sortedTasks.length} tasks`
              : sortedTasks.length === 0
              ? emptyMessages["ru"]
              : `${sortedTasks.length} задачи`}
          </p>
        </>
      )}
    </section>
  );
}

export default TaskList;
