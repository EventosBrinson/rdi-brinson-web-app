import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '../store'
import ReduxRouter from './ReduxRouter'
import Layout from './Layout'
import ScrollToTop from './ScrollToTop'
import PrivateRoute from './PrivateRoute'
import SignInPage from './SignIn'
import RecoverPasswordPage from './RecoverPassword'
import ResetPasswordPage from './ResetPassword'
import AcceptInvitationPage from './AcceptInvitation'
import UsersPage from './users/Index'
import NewUserPage from './users/New'
import EditUserPage from './users/Edit'

export default class App extends React.Component {
  render() {
    return (
      <Provider store={ store }>
        <Router>
          <ReduxRouter>
            <ScrollToTop>
              <Layout>
                <Route path="/sign_in" component={ SignInPage } />
                <Route path="/recover" component={ RecoverPasswordPage } />
                <Route path="/reset" component={ ResetPasswordPage } />
                <Route path="/confirmation" component={ AcceptInvitationPage } />
                <PrivateRoute exact path="/users" component={ UsersPage } />
                <PrivateRoute exact path="/users/new" component={ NewUserPage } />
                <PrivateRoute exact path="/users/:id/edit" component={ EditUserPage } />
              </Layout>
            </ScrollToTop>
          </ReduxRouter>
        </Router>
      </Provider>
    )
  }
}
