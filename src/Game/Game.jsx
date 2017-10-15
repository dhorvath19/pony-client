import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import http from 'axios';

import wallImg from '../assets/wall.jpg';
import floorImg from '../assets/floor.jpg';
import ponyImg from '../assets/pony.png';
import domokunImg from '../assets/domokun.jpg';
import doorImg from '../assets/door.jpg';
import './game.css';

const API = 'https://ponychallenge.trustpilot.com/pony-challenge';
const DIRECTIONS = {
  NORTH: 'north',
  EAST: 'east',
  SOUTH: 'south',
  WEST: 'west',
};

const mapCoords = (width, location) => [
  (Math.floor(location % width) * 2) + 1,
  (Math.floor(location / width) * 2) + 1,
];

const createTemplate = (width, height, field = true) =>
  new Array((height * 2) + 1).fill(null)
    .map(() => new Array((width * 2) + 1).fill(field));

const createMaze = (response) => {
  const [width, height] = response.size;
  const template = createTemplate(width, height);
  // even dirtier
  response.data.forEach((borders, index) => {
    const [x, y] = mapCoords(width, index);
    template[y][x] = false;
    if (!borders.find(str => str === 'north')) template[y - 1][x] = false;
    if (!borders.find(str => str === 'west')) template[y][x - 1] = false;
  });
  return template;
};

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      DIM: 23,
    };

    this.handleKeys = this.handleKeys.bind(this);
    this.step = this.step.bind(this);
  }

  componentDidMount() {
    const { id } = this.props;
    // if there is no map id then you should re-initiate the game
    if (id === '') {
      this.props.history.push('/');
    } else {
      document.addEventListener('keydown', this.handleKeys, false);

      http.get(`${API}/maze/${id}`)
        .then(({ data }) => {
          const [width, height] = data.size;
          this.setState({
            DIM: Math.min(
              Math.floor(window.innerWidth / ((width * 2) + 1)),
              Math.floor(window.innerHeight / ((height * 2) + 1)),
            ),
            maze: createMaze(data),
            ponyPos: mapCoords(width, data.pony),
            domokunPos: mapCoords(width, data.domokun),
            exitPos: mapCoords(width, data['end-point']),
          });
        });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeys, false);
  }

  handleKeys({ code }) {
    const { maze, ponyPos } = this.state;
    const [x, y] = ponyPos;
    switch (code) {
      case 'ArrowLeft':
        if (!maze[y][x - 1]) this.step(DIRECTIONS.WEST);
        break;
      case 'ArrowRight':
        if (!maze[y][x + 1]) this.step(DIRECTIONS.EAST);
        break;
      case 'ArrowUp':
        if (!maze[y - 1][x]) this.step(DIRECTIONS.NORTH);
        break;
      case 'ArrowDown':
        if (!maze[y + 1][x]) this.step(DIRECTIONS.SOUTH);
        break;
      default:
        return false;
    }
  }

  step(direction) {
    const { id } = this.props;
    http.post(`${API}/maze/${id}`, { direction })
      .then(({ data }) => {
        if (data['hidden-url']) {
          window.location.replace(`https://ponychallenge.trustpilot.com${data['hidden-url']}`);
        }
      })
      .then(() => http.get(`${API}/maze/${id}`))
      .then(({ data }) => {
        const [width] = data.size;
        this.setState({
          ponyPos: mapCoords(width, data.pony),
          domokunPos: mapCoords(width, data.domokun),
        });
      });
  }

  offsetImages(pos, offset = 0) {
    const { DIM } = this.state;
    const [x, y] = pos;
    const top = `${(y * DIM) - offset}px`;
    const left = `${(x * DIM) - offset}px`;
    return { top, left };
  }

  render() {
    const {
      maze,
      ponyPos,
      domokunPos,
      exitPos,
      DIM,
      state,
    } = this.state;

    if (!maze) return <div >Loading..</div >;

    const renderMaze = maze.map(row =>
      (
        <div style={{ height: `${DIM}px` }} >
          {row.map(wall =>
            (wall ?
              <img src={wallImg} height={DIM} width={DIM} alt="[/]" /> :
              <img src={floorImg} height={DIM} width={DIM} alt="   " />))}
        </div >
      ));

    return (
      <div className="game-wrapper" >
        {renderMaze}
        <div className="pony-wrapper" style={this.offsetImages(ponyPos, 85)} >
          <img src={ponyImg} className="pony-image" height={DIM} width={DIM} alt="P" />
        </div >
        <div className="domokun-wrapper" style={this.offsetImages(domokunPos)} >
          <img src={domokunImg} className="domkun-image" height={DIM} width={DIM} alt="D" />
        </div >
        <div className="exit-wrapper" style={this.offsetImages(exitPos)} >
          <img src={doorImg} className="exit-image" height={DIM} width={DIM} alt="E" />
        </div >
      </div >
    );
  }
}

Game.propTypes = {
  id: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
};

export default withRouter(Game);
