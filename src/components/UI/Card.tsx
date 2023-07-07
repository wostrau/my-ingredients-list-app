import React, { ReactNode } from 'react';

import './Card.css';

const Card: React.FC<{ children: ReactNode }> = (props) => {
  return <div className='card'>{props.children}</div>;
};

export default Card;
