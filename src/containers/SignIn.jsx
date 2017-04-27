import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import * as actionCreators from '../action-creators'

class SignIn extends React.Component {

  render() {
    return (
      <form>
        <h2>
          Sign In
        </h2>
        <div>
          <label>Email/Username</label>
          <input name='credential' type='text'/>
        </div>
        <div>
          <label>Password</label>
          <input name='password' type='password'/>
        </div>
        <div>
          <button type="submit">Log In</button>
        </div>
      </form>
    )
  }
}

function mapStateToProps(state) {
  return state
}

export default withRouter(connect(mapStateToProps, actionCreators)(SignIn))