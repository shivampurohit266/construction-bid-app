import React from 'react';
import './backdrop.css';

const BackDrop = (props) => <div className='backdrop' onClick={props.close} />;

export default BackDrop;
