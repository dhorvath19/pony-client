import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import http from 'axios';

const API = 'https://ponychallenge.trustpilot.com/pony-challenge';

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    if (this.props.id === '') this.props.history.push('/');

    http.get(`${API}/maze/${this.props.id}`)
      .then(({ data }) => {
        console.log(data);
        //  this.setState({ maze: data });
      });
  }

  render() {
    return (
      <div>
        {this.state.maze}
      </div>
    );
  }
}

Game.propTypes = {
  id: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(Game);
