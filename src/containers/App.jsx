import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '../store'
import Layout from './Layout'
import ScrollToTop from './ScrollToTop'
import PrivateRoute from './PrivateRoute'
import SignInPage from './SignIn'
import RecoverPasswordPage from './RecoverPassword'
import ResetPasswordPage from './ResetPassword'
import AcceptInvitationPage from './AcceptInvitation'
import UsersPage from './users/Index'


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
              <PrivateRoute path="/users" component={ UsersPage } />
            </Layout>
          </ScrollToTop>
        </Router>
      </Provider>
    )
  }
}
