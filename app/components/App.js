const React = require('react');
const Battle = require('./Battle');
const Results = require('./Results');
const Popular = require('./Popular');
const Home = require('./Home');
const ReactRouter = require('react-router-dom');
const Router = ReactRouter.BrowserRouter;
const Route = ReactRouter.Route;
const Nav = require('./Nav');
const Switch = ReactRouter.Switch;

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="container">
          <Nav />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/battle" component={Battle} />
            <Route path="/battle/results" component={Results} />
            <Route path="/popular" component={Popular} />
            <Route render={() => <p>404 Not Found</p>} />
          </Switch>
        </div>
      </Router>
    );
  }
}

module.exports = App;
