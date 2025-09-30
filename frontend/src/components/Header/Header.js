import { useState, useEffect, useRef, useCallback } from "react";
import "./Header.css";
import logo from "../../assets/logo.png";
import guest from "../../assets/guest.png";
import LangSwitcher from "../LangSwitcher/LangSwitcher";
import { FiMenu, FiX } from "react-icons/fi";

function Header({
  user,
  lang,
  toggleLanguage,
  isLoggedIn,
  onLoginClick,
  onLogoutClick,
  onNewTaskClick,
  appContainerRef,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const menuRef = useRef(null);

  const minSwipeDistance = 50;

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const toggleDesktopMenu = useCallback(() => {
    setIsDesktopMenuOpen((prev) => !prev);
  }, []);

  const onTouchStart = useCallback((e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const onTouchMove = useCallback((e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    // Для мобильного меню
    if (window.innerWidth <= 768) {
      if (isLeftSwipe && !isMobileMenuOpen) {
        setIsMobileMenuOpen(true);
      }
      if (isRightSwipe && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    }
    // Для десктопного меню
    else {
      if (isLeftSwipe && !isDesktopMenuOpen) {
        setIsDesktopMenuOpen(true);
      }
      if (isRightSwipe && isDesktopMenuOpen) {
        setIsDesktopMenuOpen(false);
      }
    }
  }, [touchStart, touchEnd, isMobileMenuOpen, isDesktopMenuOpen]);

  useEffect(() => {
    const menu = menuRef.current;

    if (appContainerRef) {
      appContainerRef.addEventListener("touchstart", onTouchStart, {
        passive: true,
      });
      appContainerRef.addEventListener("touchmove", onTouchMove, {
        passive: true,
      });
      appContainerRef.addEventListener("touchend", onTouchEnd, {
        passive: true,
      });
    }

    if (menu) {
      menu.addEventListener("touchstart", onTouchStart, { passive: true });
      menu.addEventListener("touchmove", onTouchMove, { passive: true });
      menu.addEventListener("touchend", onTouchEnd, { passive: true });
    }

    return () => {
      if (appContainerRef) {
        appContainerRef.removeEventListener("touchstart", onTouchStart);
        appContainerRef.removeEventListener("touchmove", onTouchMove);
        appContainerRef.removeEventListener("touchend", onTouchEnd);
      }
      if (menu) {
        menu.removeEventListener("touchstart", onTouchStart);
        menu.removeEventListener("touchmove", onTouchMove);
        menu.removeEventListener("touchend", onTouchEnd);
      }
    };
  }, [onTouchStart, onTouchMove, onTouchEnd, appContainerRef]);

  return (
    <header className="header">
      <div className="header-content">
        <button
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label={lang === "eng" ? "Toggle menu" : "Открыть меню"}
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        <div className="header-logo">
          <img src={logo} alt="IToDo Logo" className="logo-img" />
          <h1 className="logo-text">IToDo</h1>
        </div>

        <button
          className="desktop-menu-btn"
          onClick={toggleDesktopMenu}
          aria-label={lang === "eng" ? "Toggle menu" : "Открыть меню"}
        >
          {isDesktopMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        <div className="header-actions">
          {isLoggedIn && (
            <button onClick={onNewTaskClick} className="btn new-task-btn">
              +
            </button>
          )}
        </div>

        <div
          className={`mobile-menu ${isMobileMenuOpen ? "mobile-open" : ""}`}
          ref={menuRef}
        >
          {isLoggedIn ? (
            <>
              <div className="user-container">
                <img
                  className="user-image-mobile"
                  src={guest}
                  alt="guest logo"
                />
                <span className="user-username">{user?.username}</span>
                <button className="btn logout-btn" onClick={onLogoutClick}>
                  {lang === "eng" ? "Logout" : "Выйти"}
                </button>
              </div>
            </>
          ) : (
            <>
              <button className="btn login-btn" onClick={onLoginClick}>
                {lang === "eng" ? "Login" : "Логин"}
              </button>
            </>
          )}

          <LangSwitcher lang={lang} toggleLanguage={toggleLanguage} />
        </div>

        <div
          className={`desktop-menu ${isDesktopMenuOpen ? "desktop-open" : ""}`}
          ref={menuRef}
        >
          <button className="modal-close" onClick={() => toggleDesktopMenu()}>
            ×
          </button>

          {isLoggedIn ? (
            <div className="user-container">
              <img className="user-image" src={guest} alt="guest logo" />
              <span className="user-username">{user?.username}</span>
              <button className="btn logout-btn" onClick={onLogoutClick}>
                {lang === "eng" ? "Logout" : "Выйти"}
              </button>
            </div>
          ) : (
            <div className="user-container">
              <button className="btn login-btn" onClick={onLoginClick}>
                {lang === "eng" ? "Login" : "Логин"}
              </button>
            </div>
          )}

          <LangSwitcher
            className="langswitcher"
            lang={lang}
            toggleLanguage={toggleLanguage}
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
