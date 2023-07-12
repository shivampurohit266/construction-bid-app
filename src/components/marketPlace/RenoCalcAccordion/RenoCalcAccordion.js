import React, { useState } from 'react';
import './styles.scss';

const cn = (...params) =>
  params
    .reduce((classes, current) => {
      if (current && typeof current === 'string') {
        return `${classes} ${current}`;
      } else {
        return classes;
      }
    }, '')
    .trimStart();

const AccordionItem = ({ children, title }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <div className='accord-box'>
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className='accord-heading'
        >
          <div className='accord__container'>
            <div className='accord-heading-content'>{title} </div>
            <button
              aria-label='Toggle answer'
              className={cn(
                'accord-item__toggle',
                isExpanded
                  ? 'accord-item__toggle--expanded'
                  : 'accord-item__toggle--collapsed'
              )}
            >
              {isExpanded ? '⌄' : '⌃'}
            </button>
          </div>
        </div>
        {isExpanded ? <div className='accord-content'>{children}</div> : null}
      </div>
    </>
  );
};
export default AccordionItem;
