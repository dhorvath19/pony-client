import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import http from 'axios';

const API = 'https://ponychallenge.trustpilot.com/pony-challenge';

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    if (this.props.id === '') this.props.history.push('/');

    http.get(`${API}/maze/${this.props.id}/print`)
      .then(({ data }) => this.setState({ maze: data }));
  }

  render() {
    return (
      <div>
        {this.props.id}
        {this.state.maze}
      </div>
    );
  }
}

export default withRouter(Game);
