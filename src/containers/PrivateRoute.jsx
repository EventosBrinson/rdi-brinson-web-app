import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Route, Redirect } from 'react-router-dom'
import * as actionCreators from '../action-creators'

class PrivateRoute extends React.Component {

  constructor(props) {
    super(props)

    this.authenticated = this.authenticated.bind(this)
  }

  authenticated() {
    return (this.props.session_status === 'SIGNED_IN' || this.props.session_status === 'FIRST_SIGNING_IN')
  }

  render() {
    let { component: Component, ...rest } = this.props

    return (
      <Route {...rest} render={ props => (
        this.authenticated() ? (
          <Component {...props}/>
        ) : (
          <Redirect to={{
            pathname: '/sign_in',
            state: { from: props.location }
          }}/>
        )
      )}/>
    )
  }
}

function mapStateToProps(state) {
  return {
    session_status: state.get('session_status')
  }
}

export default withRouter(connect(mapStateToProps, actionCreators)(PrivateRoute))
