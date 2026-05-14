'use client';

import React, { useState, useEffect } from 'react';

const GDPCounter = () => {
  const [value, setValue] = useState(2153);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((prev) => prev + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>{value.toLocaleString()}</>
  );
};

export default GDPCounter;
