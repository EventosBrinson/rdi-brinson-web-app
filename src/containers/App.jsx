
import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '../store'
import ScrollToTop from '../components/ScrollToTop'
import SignInPage from '../containers/SignIn'

export default class App extends React.Component {
  render() {
    return (
      <Provider store={ store }>
        <Router>
          <ScrollToTop>
            <div>
              <Route path="/sign_in" component={ SignInPage } />
            </div>
          </ScrollToTop>
        </Router>
      </Provider>
    )
  }
}
