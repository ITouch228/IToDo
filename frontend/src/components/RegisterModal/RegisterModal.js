import React, { useState, useEffect } from "react";
import "./RegisterModal.css";

function RegisterModal({
  lang,
  error,
  setError,
  onClose,
  onRegister,
  onSwitchToLogin,
}) {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userData.password !== userData.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }
    onRegister({
      username: userData.username,
      email: userData.email,
      password: userData.password,
    });
  };

  useEffect(() => {
    setTimeout(() => {
      setIsModalOpen(true);
    }, 100);
  }, []);

  return (
    <div
      className={`register-modal-overlay ${isModalOpen ? "modal-open" : ""}`}
    >
      <div className="register-modal-content">
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
          {lang === "eng" ? "Register" : "Регистрация"}
        </h2>
        <h4 className="modal-title">{error}</h4>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">
              {lang === "eng" ? "Username" : "Имя"}
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={userData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">{lang === "eng" ? "Email" : "Почта"}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">
              {lang === "eng" ? "Password" : "Пароль"}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              minLength="6"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">
              {lang === "eng" ? "Confirm Password" : "Повторный пароль"}
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={userData.confirmPassword}
              onChange={handleChange}
              minLength="6"
              required
            />
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="btn secondary"
              onClick={() => {
                setIsModalOpen(false);
                setTimeout(onSwitchToLogin, 400);
              }}
            >
              {lang === "eng"
                ? "Already have an account? Login"
                : "Есть аккаунт? Логин"}
            </button>
            <button type="submit" className="btn primary">
              {lang === "eng" ? "Register" : "Регистрация"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterModal;
