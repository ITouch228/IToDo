import React, { useState, useEffect } from "react";
import "./LoginModal.css";

function LoginModal({ lang, error, onClose, onLogin, onSwitchToRegister }) {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(credentials);
  };

  useEffect(() => {
    setTimeout(() => {
      setIsModalOpen(true);
    }, 100);
  }, []);

  return (
    <div className={`login-modal-overlay ${isModalOpen ? "modal-open" : ""}`}>
      <div className={`login-modal-content`}>
        <button
          className="modal-close"
          onClick={() => {
            setIsModalOpen(false);
            setTimeout(onClose, 400);
          }}
        >
          ×
        </button>
        <h2 className="modal-title">{lang === "eng" ? "Login" : "Логин"}</h2>
        <h4 className="modal-title">{error}</h4>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">{lang === "eng" ? "Email" : "Почта"}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
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
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="btn secondary"
              onClick={() => {
                setIsModalOpen(false);
                setTimeout(onSwitchToRegister, 400);
              }}
            >
              {lang === "eng"
                ? "Don't have an account? Register"
                : "Нет аккаунта? Регистрация"}
            </button>
            <button type="submit" className="btn primary">
              {lang === "eng" ? "Login" : "Логин"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
