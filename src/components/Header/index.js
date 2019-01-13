import React from 'react';

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
      <div>{status === 'gameOver' ? 'Game Over' : ''}</div>
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
export default Header;
