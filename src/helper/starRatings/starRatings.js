import React from 'react';
const style = {
  display: 'inline-block',
  margin: '0 0.3rem 0 0',
};
export const createStars = (count) => {
  switch (count) {
    case 1:
      return (
        <ul id='stars'>
          <li className='star' style={style}>
            <i className='fa fa-star' />
          </li>
        </ul>
      );

    case 2:
      return (
        <ul id='stars'>
          <li className='star' style={style}>
            <i className='fa fa-star' />
          </li>
          <li className='star' style={style}>
            <i className='fa fa-star' />
          </li>
        </ul>
      );

    case 3:
      return (
        <ul id='stars'>
          <li className='star' style={style}>
            <i className='fa fa-star' />
          </li>
          <li className='star' style={style}>
            <i className='fa fa-star' />
          </li>
          <li className='star' style={style}>
            <i className='fa fa-star' />
          </li>
        </ul>
      );
    case 4:
      return (
        <ul id='stars'>
          <li className='star' style={style}>
            <i className='fa fa-star' />
          </li>
          <li className='star' style={style}>
            <i className='fa fa-star' />
          </li>
          <li className='star' style={style}>
            <i className='fa fa-star' />
          </li>
          <li className='star' style={style}>
            <i className='fa fa-star' />
          </li>
        </ul>
      );
    case 5:
      return (
        <ul id='stars'>
          <li className='star' style={style}>
            <i className='fa fa-star' />
          </li>
          <li className='star' style={style}>
            <i className='fa fa-star' />
          </li>
          <li className='star' style={style}>
            <i className='fa fa-star' />
          </li>
          <li className='star' style={style}>
            <i className='fa fa-star' />
          </li>
          <li className='star' style={style}>
            <i className='fa fa-star' />
          </li>
        </ul>
      );
    default:
      break;
  }
};
