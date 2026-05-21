"use client";

export function VoyaHeader() {
  return (
    <>
      <style>{`
        .voya-topnav {
          background: #fff;
          padding: 14px 18px 12px;
          display: flex;
          justify-content: center;
          border-bottom: 1px solid #ddd;
        }
        .voya-topnav a {
          width: 100%;
          max-width: 1200px;
          padding: 0 24px;
          display: flex;
        }
        .voya-logo-img {
          height: 38px;
          width: auto;
          display: block;
        }
      `}</style>
      <nav className="voya-topnav">
        <a href="/" style={{ textDecoration: "none" }}>
          <img className="voya-logo-img" src="/download.png" alt="Voya" />
        </a>
      </nav>
    </>
  );
}
