import React, { Component } from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
} from 'react-router-dom';
import Home from './Home/Home';
import Game from './Game/Game';

class Router extends Component {
  constructor() {
    super();

    this.state = {
      id: '',
    };

    this.setId = this.setId.bind(this);
  }

  setId(id) {
    this.setState({ id });
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/game" render={() => <Game id={this.state.id} />} />
          <Route render={() => <Home setId={this.setId} />} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default Router;
