
import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '../store'
import Layout from './Layout'
import ScrollToTop from './ScrollToTop'
import SignInPage from './SignIn'
import RecoverPasswordPage from './RecoverPassword'
import ResetPasswordPage from './ResetPassword'
import AcceptInvitationPage from './AcceptInvitation'


export default class App extends React.Component {
  render() {
    return (
      <Provider store={ store }>
        <Router>
          <ScrollToTop>
            <Layout>
              <Route path="/sign_in" component={ SignInPage } />
              <Route path="/recover" component={ RecoverPasswordPage } />
              <Route path="/reset" component={ ResetPasswordPage } />
              <Route path="/confirmation" component={ AcceptInvitationPage } />
            </Layout>
          </ScrollToTop>
        </Router>
      </Provider>
    )
  }
}
