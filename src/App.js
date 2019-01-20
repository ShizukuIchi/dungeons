import React, { Component } from 'react';
import './App.css';
import { mazeDir } from './maze';
import Map from './components/Map';
import Header from './components/Header';
import { MAX_DEPTH, MAX_HP, FLAG_SCORE, STATUS } from './constants';

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
    hp: MAX_HP,
    status: STATUS.START,
    auto: false,
  };
  componentDidMount() {
    window.addEventListener('keypress', this.changeKey);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
    this.clearListener();
  }
  clearListener() {
    window.removeEventListener('keypress', this.changeKey);
  }
  changeKey = ({ key }) => {
    if (key === 'r' && this.state.status !== STATUS.GAME_OVER) {
      if (this.state.auto) {
        this.noauto();
        this.setState({ auto: false });
      } else {
        this.auto();
        this.setState({ auto: true });
      }
    }
    if (this.state.auto) return;
    if (key === 'Enter') {
      this.action();
      this.setState({ key: '' });
    } else if ('wsadefq'.includes(key)) this.setState({ key });
  };
  autoAction = () => {
    this.movePlayerAuto();
    this.moveMonster();
    this.actionAuto();
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
    this.checkScore();
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
        status: STATUS.GAME_OVER,
      });
      this.clearListener();
    }
  }
  moveMonster() {
    const monster = dfs(
      this.state.monster,
      0,
      42,
      this.state.player,
      MAX_DEPTH
    );
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
  movePlayerAuto() {
    const player = dfs(this.state.player, 0, 42, this.state.monster, 999);
    this.setState({ player });
  }
  actionAuto() {
    const { player, monster } = this.state;
    if (player.x === monster.x && player.y === monster.y) {
      this.attack();
      this.pick();
    }
  }
  auto = () => {
    this.interval = setInterval(this.autoAction, 10);
  };
  noauto = () => {
    clearInterval(this.interval);
  };
  attack() {
    const { monster, player, score, items } = this.state;
    if (player.x === monster.x && player.y === monster.y) {
      this.setState(
        {
          monster: {
            x: Math.floor(Math.random() * 16),
            y: Math.floor(Math.random() * 16),
          },
          items: [...items, { ...player }],
          score: score + 1,
        },
        this.checkScore
      );
    } else {
      alert('Boom!');
    }
  }
  checkScore() {
    if (this.state.score === FLAG_SCORE) {
      this.setState({ status: STATUS.FLAG });
    }
  }
  pick() {
    const { items, player, hp } = this.state;
    let itemIndex = -1;
    items.forEach(({ x, y }, i) => {
      if (x === player.x && y === player.y) {
        itemIndex = i;
      }
    });
    if (itemIndex === -1) {
      alert('Boom!');
      return;
    }
    this.setState({
      items: items.filter((_, i) => i !== itemIndex),
      hp: hp <= MAX_HP ? MAX_HP : hp + 1,
    });
  }
  renderItems() {
    return this.state.items.map((pos, i) => <Item key={i} {...pos} c="i" />);
  }
  renderMonster() {
    const { player, monster } = this.state;
    let c = 'M';
    if (player.x === monster.x && player.y === monster.y) c = 'B';
    return <Item c={c} {...monster} />;
  }
  renderPlayer() {
    const { player, items } = this.state;
    let c = 'O';
    if (items.find(pos => pos.x === player.x && pos.y === player.y)) c = 'G';
    return <Item c={c} {...player} />;
  }
  render() {
    return (
      <div className="App" ref={r => (this.game = r)}>
        <Header {...this.state} />
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
function dfs(pos, depth, last, desPos, maxDepth) {
  if (depth === maxDepth) return false;
  if (desPos.x === pos.x && desPos.y === pos.y) return pos;
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
      if (dfs(newPos, depth + 1, dir, desPos, maxDepth)) {
        return newPos;
      }
    }
  }
  return false;
}

export default App;
