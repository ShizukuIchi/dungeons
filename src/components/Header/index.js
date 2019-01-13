import React from 'react';
import { FLAG } from '../../constants';

function Header({ score, title, hp, status }) {
  return (
    <div className="header">
      <div className="left">
        <div>Score</div>
        <div>{formatScore(score)}</div>
      </div>
      <div className="right">
        <div>HP</div>
        <div>
          {Array(hp)
            .fill()
            .map(_ => 'x')}
        </div>
      </div>
      <div>{title}</div>
      <div>{getStatusString(status)}</div>
    </div>
  );
}
function formatScore(score) {
  if (String(score).length < 5) {
    return (
      Array(5 - String(score).length)
        .fill()
        .map(_ => '0')
        .join('') + score
    );
  }
  return score;
}
function getStatusString(status) {
  switch (status) {
    case 'gameOver':
      return 'Game Over';
    case 'flag':
      return FLAG;
    default:
      return '';
  }
}
export default Header;
