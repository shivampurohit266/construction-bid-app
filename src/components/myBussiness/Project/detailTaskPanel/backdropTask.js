import React from 'react';
import './backdropTask.css';

const BackDrop = (props) => <div className='backdrop' onClick={props.close} />;

export default BackDrop;
