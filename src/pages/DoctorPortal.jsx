import React, { useState, useEffect } from 'react';

const AnimatedCounter = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // If value is a string that contains non-numeric characters (like '98%'), 
    // we extract the number, animate it, and append the string part back.
    const numericMatch = String(value).match(/(\d+)/);
    const textValue = String(value);
    
    if (!numericMatch) {
      setCount(value); // If no number, just display as is
      return;
    }

    const targetNumber = parseInt(numericMatch[0], 10);
    const prefix = textValue.substring(0, numericMatch.index);
    const suffix = textValue.substring(numericMatch.index + numericMatch[0].length);

    let startTimestamp = null;
    const duration = 1500;
    
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - (1 - progress) * (1 - progress);
      const currentVal = Math.floor(easeProgress * targetNumber);
      
      setCount(`${prefix}${currentVal}${suffix}`);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [value]);

  return <>{count}</>;
};

export default AnimatedCounter;
