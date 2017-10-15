import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
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

    this.submit = this.submit.bind(this);
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
      <div >
        <div >
          Width: {this.state.width}
          <input
            type="range"
            min={15}
            max={25}
            value={this.state.width}
            required
            onChange={event => this.setState({ width: parseInt(event.target.value, 10) })}
          />
        </div >
        <div >
          Height: {this.state.height}
          <input
            type="range"
            min={15}
            max={25}
            value={this.state.height}
            required
            onChange={event => this.setState({ height: parseInt(event.target.value, 10) })}
          />
        </div >
        <div >
          Name:
          <input
            type="text"
            value={this.state.name}
            required
            onChange={event => this.setState({ name: event.target.value })}
          />
        </div >
        <button type="submit" onClick={this.submit} >
          Submit
        </button >
      </div >
    );
  }
}

Home.propTypes = {
  setId: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
};

export default withRouter(Home);
