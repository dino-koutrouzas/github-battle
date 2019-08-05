import React from 'react'
import Nav from './Nav'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ThemeProvider } from '../contexts/theme'

const Battle = React.lazy(() => import('./Battle'))
const Results = React.lazy(() => import('./Results'))
const Popular = React.lazy(() => import('./Popular'))

import Loading from './Loading'


class App extends React.Component {
  state = {
    theme: 'light',
    toggleTheme: () => {
      this.setState(({theme}) => ({
        theme: theme === 'light' ? 'dark' : 'light'
      }))
    }
  }

  render() {
    return (
      <Router>
        <ThemeProvider value={this.state}>
          <div className={this.state.theme}>
            <div className="container">
              <Nav />
              <React.Suspense fallback={<Loading />}>
                <Switch>
                  <Route exact path="/" component={Popular} />
                  <Route exact path="/battle" component={Battle} />
                  <Route path="/battle/results" component={Results} />
                  <Route render={() => <h1>404</h1>} />
                </Switch>
              </React.Suspense>
            </div>
          </div>
        </ThemeProvider>
      </Router>
    );
  }
}

export default App;
