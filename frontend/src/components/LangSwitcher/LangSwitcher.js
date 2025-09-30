import "./LangSwitcher.css";

const LangSwitcher = ({ lang, toggleLanguage }) => {
  return (
    <div className="language-switcher">
      <span className={`language-label ${lang === "ru" ? "active" : ""}`}>
        RU
      </span>

      <button className="language-toggle" onClick={toggleLanguage}>
        <span className={`toggle-handle ${lang === "eng" ? "eng" : ""}`} />
      </button>

      <span className={`language-label ${lang === "eng" ? "active" : ""}`}>
        ENG
      </span>
    </div>
  );
};

export default LangSwitcher;
