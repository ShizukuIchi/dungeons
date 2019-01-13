import React, { Component } from 'react';
import './App.css';
import { mazeDir } from './maze';
import Map from './components/Map';
import Header from './components/Header';

class App extends Component {
  state = {
    player: {
      x: Math.floor(Math.random() * 8),
      y: Math.floor(Math.random() * 8),
    },
    monster: {
      x: Math.floor(Math.random() * 8) + 8,
      y: Math.floor(Math.random() * 8) + 8,
    },
    // player: { x: 0, y: 0 },
    // monster: { x: 8, y: 0 },
    items: [],
    key: '',
    score: 0,
    hp: 5,
    status: 'start',
  };
  componentDidMount() {
    window.addEventListener('keypress', this.changeKey);
  }
  changeKey = ({ key }) => {
    if (key === 'Enter') {
      this.action();
    } else if ('wasdef'.includes(key)) this.setState({ key });
  };
  action() {
    const pos = { ...this.state.player };
    switch (this.state.key) {
      case 'w':
        if (checkWall(pos, 0)) {
          pos.y -= 1;
        } else {
          alert('Boom!');
        }
        break;
      case 's':
        if (checkWall(pos, 1)) {
          pos.y += 1;
        } else {
          alert('Boom!');
        }
        break;
      case 'a':
        if (checkWall(pos, 2)) {
          pos.x -= 1;
        } else {
          alert('Boom!');
        }
        break;
      case 'd':
        if (checkWall(pos, 3)) {
          pos.x += 1;
        } else {
          alert('Boom!');
        }
        break;
      case 'e':
        return this.pick();
      case 'f':
        return this.attack();
      default:
    }
    const monster = this.dfs(this.state.monster, 0, 42, pos);
    let hp = this.state.hp;
    if (
      this.state.monster.x === this.state.player.x &&
      this.state.monster.y === this.state.player.y
    ) {
      if (hp > 2) {
        hp -= 2;
      } else {
        this.setState({
          player: pos,
          key: '',
          hp: 0,
          monster: monster ? monster : this.state.monster,
          status: 'gameOver',
        });
        return;
      }
    }

    this.setState({
      player: pos,
      key: '',
      hp,
      monster: monster ? monster : this.state.monster,
    });
  }
  attack() {
    if (
      this.state.player.x === this.state.monster.x &&
      this.state.player.y === this.state.monster.y
    ) {
      const monster = {
        x: Math.floor(Math.random() * 16),
        y: Math.floor(Math.random() * 16),
      };
      this.setState({
        monster,
        items: [...this.state.items, { ...this.state.player }],
        score: this.state.score + 1,
      });
    } else {
      alert('Boom!');
    }
  }
  pick() {
    let itemIndex = -1;
    this.state.items.forEach(({ x, y }, i) => {
      if (x === this.state.player.x && y === this.state.player.y) {
        itemIndex = i;
      }
    });
    if (itemIndex === -1) {
      alert('Boom!');
      return;
    }
    const items = this.state.items.filter((_, i) => i !== itemIndex);
    let hp = this.state.hp;
    hp = hp === 5 ? 5 : hp + 1;
    this.setState({
      items,
      hp,
    });
  }
  renderItems() {
    return this.state.items.map((pos, i) => <Item key={i} {...pos} c="i" />);
  }
  renderMonster() {
    let c = 'M';
    if (
      this.state.player.x === this.state.monster.x &&
      this.state.player.y === this.state.monster.y
    )
      c = 'B';
    return <Item c={c} {...this.state.monster} />;
  }
  renderPlayer() {
    let c = 'O';
    const item = this.state.items.find(
      pos => pos.x === this.state.player.x && pos.y === this.state.player.y,
    );
    if (item) c = 'G';
    return <Item c={c} {...this.state.player} />;
  }
  dfs = (pos, depth, last, playerPos) => {
    if (depth === 5) return false;
    if (playerPos.x === pos.x && playerPos.y === pos.y) return pos;
    for (let dir = 0; dir < 4; dir++) {
      if ((last ^ 1) === dir) continue;
      if (checkWall(pos, dir)) {
        let newPos = { ...pos };
        switch (dir) {
          case 0:
            newPos.y -= 1;
            break;
          case 1:
            newPos.y += 1;
            break;
          case 2:
            newPos.x -= 1;
            break;
          case 3:
            newPos.x += 1;
            break;
          default:
        }
        if (this.dfs(newPos, depth + 1, dir, playerPos)) {
          return newPos;
        }
      }
    }
    return false;
  };
  render() {
    if (this.state.status === 'gameOver') {
      window.removeEventListener('keypress', this.changeKey);
    }
    return (
      <div className="App" ref={r => (this.game = r)}>
        <Header
          title="Dungeons v1.0.1"
          score={this.state.score}
          hp={this.state.hp}
          status={this.state.status}
        />
        {this.renderItems()}
        {this.renderPlayer()}
        {this.renderMonster()}
        <Map />
        <div className="key">{`[>] action: ${this.state.key}`}</div>
      </div>
    );
  }
}

const Item = ({ x, y, c }) => (
  <div
    style={{ transform: `translate(${x * 50}px,${y * 50}px)` }}
    className="item"
  >
    {c}
  </div>
);

function checkWall(pos, dir) {
  if (mazeDir[pos.x + pos.y * 16][dir]) {
    return true;
  } else {
    return false;
  }
}
export default App;
