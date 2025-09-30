import React, { useState, useEffect } from "react";
import "./NewTaskModal.css";
import { formatDateTime } from "../../utils/dateUtils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import ru from "date-fns/locale/ru";
import eng from "date-fns/locale/en-US";

function NewTaskModal({ lang, error, onClose, onCreateTask }) {
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    deadline: null,
    priority: "2",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (lang === "ru") {
    registerLocale("ru", ru);
  } else {
    registerLocale("eng", eng);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setTaskData((prev) => ({
      ...prev,
      deadline: date,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsModalOpen(false);
    setTimeout(() => {
      onCreateTask({
        ...taskData,
        priority: Number(taskData.priority),
        deadline: taskData.deadline ? formatDateTime(taskData.deadline) : null,
      });
    }, 400);
  };

  useEffect(() => {
    setTimeout(() => {
      setIsModalOpen(true);
    }, 100);
  }, []);

  return (
    <div className={`newtask-modal-overlay ${isModalOpen ? "modal-open" : ""}`}>
      <div className="newtask-modal-content">
        <button
          className="modal-close"
          onClick={() => {
            setIsModalOpen(false);
            setTimeout(onClose, 400);
          }}
        >
          ×
        </button>
        <h2 className="modal-title">
          {lang === "eng" ? "Create Task" : "Создать задачу"}
        </h2>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">
              {lang === "eng" ? "Title" : "Название"}
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={taskData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">
              {lang === "eng" ? "Description" : "Описание"}
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={taskData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>{lang === "eng" ? "Deadline" : "Срок выполнения"}</label>
            <DatePicker
              selected={taskData.deadline}
              onChange={handleDateChange}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={1}
              dateFormat="dd-MM-yyyy HH:mm"
              locale={lang === "ru" ? ru : null}
              minDate={new Date()}
              className="date-picker-input"
              placeholderText={
                lang === "eng"
                  ? "Select date and time"
                  : "Выберите дату и время"
              }
              isClearable
            />
          </div>

          <div className="form-group">
            <label>{lang === "eng" ? "Priority" : "Приоритет"}</label>
            <div className="priority-options">
              {["low", "medium", "high"].map((level, index) => (
                <label key={index + 1} className="priority-option">
                  <input
                    type="radio"
                    name="priority"
                    value={index + 1}
                    checked={taskData.priority === (index + 1).toString()}
                    onChange={handleChange}
                  />
                  <span className={`priority-badge ${level}`}>
                    {lang === "eng"
                      ? level.charAt(0).toUpperCase() + level.slice(1)
                      : level === "low"
                      ? "Низкий"
                      : level === "medium"
                      ? "Средний"
                      : "Высокий"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn secondary"
              onClick={() => {
                setIsModalOpen(false);
                setTimeout(onClose, 400);
              }}
            >
              {lang === "eng" ? "Cancel" : "Отмена"}
            </button>
            <button type="submit" className="btn primary">
              {lang === "eng" ? "Create Task" : "Создать задачу"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewTaskModal;
