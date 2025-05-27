import React from 'react';
import './three.css';

export default function Three(props) {
  const textLines = props.texta.split('<br>');

  return (
    <div className="image-wrapper">
      <img className='imgall2' src={props.img} alt={textLines[0]} />
      <div className="text-overlay">
        {textLines.map((line, index) => (
          <p key={index} className='text-1'>{line}</p>
        ))}
        <button className='btn-2'>{props.button}</button>
      </div>
    </div>
  );
}