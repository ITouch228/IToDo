import React, { useState, useEffect, useMemo, useRef } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import LoginModal from "./components/LoginModal/LoginModal";
import RegisterModal from "./components/RegisterModal/RegisterModal";
import NewTaskModal from "./components/NewTaskModal/NewTaskModal";
import EditTaskModal from "./components/EditTaskModal/EditTaskModal";
import TaskList from "./components/TaskList/TaskList";
import { login, register, getCurrentUser } from "./api/auth";
import { createTask, editTask, deleteTask, getTasks, completeTask } from "./api/tasks";
import axios from "axios";
import { formatDateTime } from "./utils/dateUtils";

function App() {
  const [authModal, setAuthModal] = useState(null); // 'login' или 'register'
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lang, setLang] = useState("eng");

  const [overdueTasks, setOverdueTasks] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  const appRef = useRef(null);

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        const lang = localStorage.getItem("lang");
        if (lang) {
          setLang(lang);
        }

        const token = localStorage.getItem("access_token");
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const userData = await getCurrentUser();
          setUser(userData);
          const tasks = await getTasks();
          setTasks(tasks);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("access_token");
        delete axios.defaults.headers.common["Authorization"];
      } finally {
        setTimeout(() => setIsLoading(false), 1000);
      }
    };

    const updateTasksFromDb = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        let tasks = await getTasks();
        setTasks(tasks);
      }
    };

    loadUser();
    const interval = setInterval(updateTasksFromDb, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    let currentDate = new Date();
    setUpcomingTasks([]);
    setTodayTasks([]);
    setOverdueTasks([]);
    setCompletedTasks([]);

    tasks.forEach((task) => {
      if (!task.is_completed) {
        if (!task.deadline) {
          setUpcomingTasks((prev) => [...prev, task]);
        } else if (task.deadline < formatDateTime(currentDate)) {
          setOverdueTasks((prev) => [...prev, task]);
        } else if (
          task.deadline.slice(0, 10) ===
          formatDateTime(currentDate).slice(0, 10)
        ) {
          setTodayTasks((prev) => [...prev, task]);
        } else {
          setUpcomingTasks((prev) => [...prev, task]);
        }
      } else {
        setCompletedTasks((prev) => [...prev, task]);
      }
    });
  }, [tasks]);

  const toggleLanguage = () => {
    setLang((prevLang) => (prevLang === "ru" ? "eng" : "ru"));
    localStorage.setItem("lang", lang === "ru" ? "eng" : "ru");
  };

  const handleCreateTask = async (task) => {
    try {
      setError(null);
      task = await createTask(task);
      setTasks((prev) => [...prev, task]);
      setShowNewTaskModal(false);
    } catch (err) {
      alert(err);
      setError(
        err.response?.data?.message || "Create task failed. Please try again."
      );
    }
  };

  const handleEditTask = async (task) => {
    try {
      setError(null);
      task = await editTask(task);
      setTasks((prev) => prev.map(el => el.id === task.id ? task : el));
      setShowEditTaskModal(false);
    } catch (err) {
      alert(err);
      setError(
        err.response?.data?.message || "Edit task failed. Please try again."
      );
    }
  };

  const handleDeleteTask = async (task) => {
    try {
      setError(null);
      await deleteTask(task);
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
    } catch (err) {
      alert(err);
      setError(
        err.response?.data?.message || "Create task failed. Please try again."
      );
    }
  };

  const handleToggleComplete = async (taskId, newState) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, is_completed: newState } : task
      )
    );
    completeTask(taskId, newState);
  };

  const handleLogin = async (credentials) => {
    try {
      setError(null);
      const data = await login(credentials);

      localStorage.setItem("access_token", data.access_token);

      const tasks = await getTasks();
      setTasks(tasks);
      setIsLoggedIn(true);
      setUser(data.user);
      setAuthModal(null);
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  const handleRegister = async (userData) => {
    try {
      setError(null);
      await register(userData);

      setError("Registration successful! Please login");
      setAuthModal("login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("authData");
    setIsLoggedIn(false);
    setTasks([]);
    setUser(null);
  };

  useMemo(() => {
    setUpcomingTasks([]);
    setTodayTasks([]);
    setOverdueTasks([]);
    setCompletedTasks([]);

    const currentDate = new Date();

    tasks.forEach((task) => {
      if (!task.is_completed) {
        if (!task.deadline) {
          setUpcomingTasks((prev) => [...prev, task]);
        } else if (task.deadline < formatDateTime(currentDate)) {
          setOverdueTasks((prev) => [...prev, task]);
        } else if (
          task.deadline.slice(0, 10) ===
          formatDateTime(currentDate).slice(0, 10)
        ) {
          setTodayTasks((prev) => [...prev, task]);
        } else {
          setUpcomingTasks((prev) => [...prev, task]);
        }
      } else {
        setCompletedTasks((prev) => [...prev, task]);
      }
    });
  }, [tasks]);

  if (isLoading) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          zIndex: 50,
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            border: "5px solid #f3f3f3",
            borderTop: "5px solid #3b82f6",
            animation: "spin 1s linear infinite",
          }}
        ></div>

        <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      </div>
    );
  }

  return (
    <div className="app-container" ref={appRef}>
      <Header
        user={user}
        lang={lang}
        toggleLanguage={toggleLanguage}
        isLoggedIn={isLoggedIn}
        onLoginClick={() => setAuthModal("login")}
        onLogoutClick={handleLogout}
        onNewTaskClick={() => setShowNewTaskModal(true)}
        appContainerRef={appRef.current}
      />

      {showNewTaskModal === true && (
        <NewTaskModal
          lang={lang}
          error={error}
          onClose={() => setShowNewTaskModal(false)}
          onCreateTask={handleCreateTask}
        />
      )}

      {showEditTaskModal === true && (
        <EditTaskModal
          task={editingTask}
          lang={lang}
          error={error}
          onClose={() => setShowEditTaskModal(false)}
          onEditTask={handleEditTask}
        />
      )}

      {authModal === "login" && (
        <LoginModal
          lang={lang}
          error={error}
          onClose={() => setAuthModal(null)}
          onLogin={handleLogin}
          onSwitchToRegister={() => setAuthModal("register")}
        />
      )}

      {authModal === "register" && (
        <RegisterModal
          lang={lang}
          error={error}
          setError={setError}
          onClose={() => setAuthModal(null)}
          onRegister={handleRegister}
          onSwitchToLogin={() => setAuthModal("login")}
        />
      )}

      <main className="main-content">
        <TaskList
          lang={lang}
          tasks={overdueTasks}
          titles={{ eng: "Overdue Tasks", ru: "Просроченные задачи" }}
          emptyMessages={{
            eng: "No overdue tasks",
            ru: "Нет просроченных задач",
          }}
          onDeleteTask={handleDeleteTask}
          onToggleComplete={handleToggleComplete}
          onEditTask={(task) => {
            setEditingTask(task);
            setShowEditTaskModal(true);
          }}
        />
        <TaskList
          lang={lang}
          tasks={todayTasks}
          titles={{ eng: "Today's Tasks", ru: "Сегодняшние задачи" }}
          emptyMessages={{
            eng: "No tasks for today",
            ru: "Нет задач на сегодня",
          }}
          onDeleteTask={handleDeleteTask}
          onToggleComplete={handleToggleComplete}
          onEditTask={(task) => {
            setEditingTask(task);
            setShowEditTaskModal(true);
          }}
        />
        <TaskList
          lang={lang}
          tasks={upcomingTasks}
          titles={{ eng: "Upcoming Tasks", ru: "Предстоящие задачи" }}
          emptyMessages={{
            eng: "No upcoming tasks",
            ru: "Нет предстоящих задач",
          }}
          onDeleteTask={handleDeleteTask}
          onToggleComplete={handleToggleComplete}
          onEditTask={(task) => {
            setEditingTask(task);
            setShowEditTaskModal(true);
          }}
        />
        <TaskList
          lang={lang}
          tasks={completedTasks}
          titles={{ eng: "Completed Tasks", ru: "Выполненные задачи" }}
          emptyMessages={{
            eng: "No completed tasks",
            ru: "Нет выполненных задач",
          }}
          onDeleteTask={handleDeleteTask}
          onToggleComplete={handleToggleComplete}
          onEditTask={(task) => {
            setEditingTask(task);
            setShowEditTaskModal(true);
          }}
        />
      </main>
    </div>
  );
}

export default App;
