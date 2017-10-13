import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import http from 'axios';

const API = 'https://ponychallenge.trustpilot.com/pony-challenge';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 15,
      height: 15,
      name: 'Rarity',
    };

    this.changeDimension = this.changeDimension.bind(this);
    this.submit = this.submit.bind(this);
  }

  changeDimension(key, value) {
    if (value >= 15 && value <= 25) {
      this.setState({ [key]: value });
    }
  }

  submit() {
    const { width, height, name } = this.state;
    const mazeParams = {
      'maze-width': width,
      'maze-height': height,
      'maze-player-name': name,
      difficulty: 0,
    };
    http.post(`${API}/maze`, mazeParams)
      .then(({ data }) => {
        this.props.setId(data.maze_id);
        this.props.history.push('/game');
      });
  }

  render() {
    return (
      <div>
        <div>
          Width: {this.state.width}
          <input
            type="range"
            min={15}
            max={25}
            value={this.state.width}
            required
            onChange={event => this.setState({ width: event.target.value })}
          />
        </div>
        <div>
          Height: {this.state.height}
          <input
            type="range"
            min={15}
            max={25}
            value={this.state.height}
            required
            onChange={event => this.setState({ height: event.target.value })}
          />
        </div>
        <div>
          Name:
          <input
            type="text"
            value={this.state.name}
            required
            onChange={event => this.setState({ name: event.target.value })}
          />
        </div>
        <button type="submit" onClick={this.submit}>
          Submit
        </button>
      </div>
    );
  }
}

export default withRouter(Home);
