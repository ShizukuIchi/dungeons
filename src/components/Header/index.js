import React from 'react';
import { FLAG, STATUS, TITLE } from '../../constants';

function Header({ score, auto, hp, status }) {
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
      <div>{auto ? `${TITLE} (auto)` : TITLE}</div>
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
    case STATUS.GAME_OVER:
      return 'Game Over';
    case STATUS.FLAG:
      return FLAG;
    default:
      return '';
  }
}
export default Header;
