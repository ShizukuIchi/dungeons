import React from 'react';

function Header({ score, title, hp }) {
  return (
    <div className="header">
      <div className="left">
        <div>Score</div>
        <div>{score}</div>
      </div>
      <div className="right">
        <div>HP</div>
        <div>
          {Array(hp)
            .fill()
            .map(_ => 'x')}
        </div>
      </div>
      {title}
    </div>
  );
}

export default Header;
