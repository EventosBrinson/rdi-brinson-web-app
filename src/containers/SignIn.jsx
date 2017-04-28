import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import * as actionCreators from '../action-creators'
import Immutable from 'immutable'

class SignIn extends React.Component {

  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.processSignIn = this.processSignIn.bind(this)
  }

  handleChange(e) {
    this.props.changeForm('sign_in_form', e.target.name, e.target.value)
  }

  processSignIn(e) {
    if (e.preventDefault) e.preventDefault()

    let data = (this.props.sign_in_form || Immutable.Map()).toJS()

    this.props.submitRequest('SIGN_IN', data)
  }

  render() {
    let form = this.props.sign_in_form || Immutable.Map()

    return (
      <form onSubmit={ this.processSignIn }>
        <h2>
          Sign In
        </h2>
        <div>
          <label>Email/Username</label>
          <input name='credential' type='text' value={ form.get('credential') || '' } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Password</label>
          <input name='password' type='password' value={ form.get('password') || '' } onChange={ this.handleChange }/>
        </div>
        <div>
          <button type="submit">Sign In</button>
        </div>
      </form>
    )
  }
}

function mapStateToProps(state) {
  return {
    sign_in_form: state.getIn(['forms', 'sign_in_form'])
  }
}

export default withRouter(connect(mapStateToProps, actionCreators)(SignIn))