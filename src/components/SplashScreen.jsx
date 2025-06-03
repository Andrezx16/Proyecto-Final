import React, { useEffect } from 'react';
import '../css/SplashScreen.css';

const SplashScreen = ({ onFinish }) => {
  const text = "Quirkly";

  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);
  
  return (
    <div className="splash-screen">
      <div className="circle-wrapper">
        <div className="rotating-circle"></div>
        <div className="circle">
          <h1 className="circle-text">
            {text.split("").map((char, index) => (
              <span
                key={index}
                className="letter"
                style={{ animationDelay: `${index * 0.3}s` }}
              >
                {char}
              </span>
            ))}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
