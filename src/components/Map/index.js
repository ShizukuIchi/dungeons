import React from 'react';
import './style.css';
import { mazeDir } from '../../maze';

const Map = () => {
  return (
    <div className="map">
      {mazeDir.map((dir, i) => (
        <div
          key={i}
          className="block"
          style={{
            borderTopColor: dir[0] ? 'transparent' : 'white',
            borderBottomColor: dir[1] ? 'transparent' : 'white',
            borderLeftColor: dir[2] ? 'transparent' : 'white',
            borderRightColor: dir[3] ? 'transparent' : 'white',
          }}
        />
      ))}
    </div>
  );
};

export default Map;
