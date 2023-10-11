import React, { useState } from 'react';

function ScrollToTopButton() {
  const [showButton, setShowButton] = useState(false);

  const handleScroll = () => {
    const scrollTop = window.pageYOffset;
    if (scrollTop > 300) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  window.addEventListener('scroll', handleScroll);

  return (
    <button
      className={showButton ? 'show-button' : 'hide-button'}
      onClick={handleClick}
    >
      <span className="top-btn material-icons-outlined">arrow_upward</span>
    </button>
  );
}

export default ScrollToTopButton;