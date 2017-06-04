import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
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
import ProfilePage from './Profile'
import UsersPage from './users/Index'
import NewUserPage from './users/New'
import EditUserPage from './users/Edit'
import ClientsPage from './clients/Index'
import NewClientPage from './clients/New'
import EditClientPage from './clients/Edit'
import ShowClientPage from './clients/Show'
import NewPlacePage from './places/New'
import EditPlacePage from './places/Edit'

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
                <PrivateRoute exact path="/profile" component={ ProfilePage } />
                <PrivateRoute exact path="/users" component={ UsersPage } />
                <PrivateRoute exact path="/users/new" component={ NewUserPage } />
                <PrivateRoute exact path="/users/:id/edit" component={ EditUserPage } />
                <Switch>
                  <PrivateRoute exact path="/clients" component={ ClientsPage } />
                  <PrivateRoute exact path="/clients/new" component={ NewClientPage } />
                  <PrivateRoute exact path="/clients/:id/edit" component={ EditClientPage } />
                  <PrivateRoute exact path="/clients/:id" component={ ShowClientPage } />
                </Switch>
                <Switch>
                  <PrivateRoute exact path="/places/new" component={ NewPlacePage } />
                  <PrivateRoute exact path="/places/:id/edit" component={ EditPlacePage } />
                </Switch>
              </Layout>
            </ScrollToTop>
          </ReduxRouter>
        </Router>
      </Provider>
    )
  }
}
