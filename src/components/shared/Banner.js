import React from 'react';

const Banner = ({ children }) => {
  return (
    <div className='container-box'>
      <div className='container-content'>{children}</div>
    </div>
  );
};

export default Banner;
