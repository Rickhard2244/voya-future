"use client";

export function LoginHeader() {
  return (
    <nav className="topnav" style={{
      background: '#fff',
      borderBottom: '1px solid #ddd',
      padding: '20px 150px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <a className="xerox-logo" href="/" style={{
        fontSize: '2.2rem',
        fontWeight: '900',
        color: '#e31837',
        fontStyle: 'italic',
        letterSpacing: '-0.04em',
        textDecoration: 'none',
        lineHeight: '1',
        fontFamily: 'Arial, sans-serif'
      }}>
        xerox<sup style={{
          fontSize: '0.4em',
          fontWeight: '400',
          verticalAlign: 'super',
          fontStyle: 'normal',
          letterSpacing: '0'
        }}>™</sup>
      </a>
      <div style={{ textAlign: 'right' }}>
        <a style={{
          display: 'block',
          fontSize: '0.8rem',
          color: '#c00',
          textDecoration: 'none',
          marginBottom: '2px'
        }} href="#" onClick={(e) => { e.preventDefault(); }}>
          Contact Us
        </a>
        <span style={{ fontSize: '0.92rem', color: '#222', fontWeight: '400' }}>
          Xerox 401(k) Savings Plan
        </span>
      </div>
    </nav>
  );
}
