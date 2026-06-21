"use client";
import './Landing.css';

export default function Landing({ onLaunchApp }) {
  return (
    <div className="landing-page">
      <div className="landing-container">
        <div className="landing-bg"></div>
        
        <nav className="landing-nav">
          <div className="logo">
            <span>🌿</span>
          </div>
          
          <div className="nav-center-links">
            <a href="#">Home</a>
            <a href="#">Plogs</a>
            <a href="#">Shorts</a>
            <a href="#">Contact Us</a>
          </div>
          
          <div className="nav-actions">
            <button className="icon-btn">🔍</button>
            <button className="login-btn">Log In</button>
          </div>
        </nav>

        <div className="landing-hero">
          <div className="phone-mockup">
            <div className="phone-notch"></div>
            
            <div className="phone-inner">
              <div className="check-icon">✓</div>
              
              <div className="play-overlay">
                <span className="play-icon">▶</span>
              </div>
              
              <h2>Net Zero</h2>
              
              <button className="start-btn" onClick={onLaunchApp}>
                Start Tracking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
