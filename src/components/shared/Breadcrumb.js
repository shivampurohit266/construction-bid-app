import React from 'react';

const Breadcrumb = (props) => {
  return (
    <>
      <div className='sidebar-toggle'></div>
      <nav aria-label='breadcrumb'>
        <ol className='breadcrumb'>{props.children}</ol>
      </nav>
    </>
  );
};

export default Breadcrumb;
