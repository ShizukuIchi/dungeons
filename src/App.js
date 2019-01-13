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
    // monster: { x: 0, y: 5 },
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
      this.setState({ key: '' });
    } else if ('wsadefq'.includes(key)) this.setState({ key });
  };
  action() {
    this.monsterAttack();
    switch (this.state.key) {
      case 'e':
        this.pick();
        break;
      case 'f':
        this.attack();
        break;
      case 'w':
      case 's':
      case 'a':
      case 'd':
        this.movePlayer();
        break;
      default:
    }
    this.moveMonster();
  }
  monsterAttack() {
    const { hp, monster, player, key } = this.state;
    if (monster.x !== player.x || monster.y !== player.y || key === 'f') return;
    if (hp > 2) {
      this.setState({
        hp: hp - 2,
      });
    } else {
      this.setState({
        hp: 0,
        status: 'gameOver',
      });
    }
  }
  moveMonster() {
    const monster = dfs(this.state.monster, 0, 42, this.state.player);
    if (monster) this.setState({ monster });
  }
  movePlayer() {
    const { player, key } = this.state;
    const pos = { ...player };
    const dir = 'wsad'.indexOf(key);
    if (!checkWall(pos, dir)) return alert('Boom!');
    switch (dir) {
      case 0:
        pos.y -= 1;
        break;
      case 1:
        pos.y += 1;
        break;
      case 2:
        pos.x -= 1;
        break;
      case 3:
        pos.x += 1;
        break;
      default:
    }
    this.setState({ player: pos });
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
function dfs(pos, depth, last, playerPos) {
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
      if (dfs(newPos, depth + 1, dir, playerPos)) {
        return newPos;
      }
    }
  }
  return false;
}

export default App;
