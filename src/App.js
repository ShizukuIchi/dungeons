import React, { Component } from 'react';
import './App.css';
import { mazeDir } from './maze';
import Map from './components/Map';
import Header from './components/Header';

class App extends Component {
  state = {
    player: { x: 10, y: 0 },
    monster: { x: 2, y: 2 },
    items: [],
    key: '',
    score: 0,
    hp: 5,
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
    if (pos.x >= 0 && pos.x < 16 && pos.y >= 0 && pos.y < 16) {
      this.setState({
        player: pos,
        key: '',
      });
    } else {
      alert('Boom!');
    }
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
    return (
      <div className="App" ref={r => (this.game = r)}>
        <Header
          title="Dungeons v1.0.1"
          score={this.state.score}
          hp={this.state.hp}
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
