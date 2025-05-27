// RatingStars.tsx

import React from 'react';

interface RatingStarsProps {
  rating: number;
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        style={{ color: i <= rating ? 'gold' : 'lightgray' }}
      >
        {i <= rating ? '★' : '☆'}
      </span>
    );
  }
  return <div>{stars}</div>;
};

export default RatingStars;