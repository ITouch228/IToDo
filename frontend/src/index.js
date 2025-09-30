import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
// import "./index.css";

// Получаем корневой DOM-элемент
const container = document.getElementById("root");

// Создаем корень React
const root = createRoot(container);

// Рендерим приложение
root.render(<App />);
