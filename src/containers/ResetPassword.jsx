import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import * as actionCreators from '../action-creators'
import Immutable from 'immutable'
import queryString from 'query-string'

class ResetPassword extends React.Component {

  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.processSubmit = this.processSubmit.bind(this)
  }

  handleChange(event) {
    this.props.changeForm('reset_password_form', event.target.name, event.target.value)
  }

  processSubmit(event) {
    if (event.preventDefault) {
      event.preventDefault()
    }

    let data = (this.props.reset_password_form || Immutable.Map()).toJS()
    let params = queryString.parse(this.props.location.search)

    data.token = params.token

    this.props.submitRequest('RESET_PASSWORD', data)
  }

  render() {
    let form = this.props.reset_password_form || Immutable.Map()

    return (
      <form onSubmit={ this.processSubmit }>
        <h2>
          Change password
        </h2>
        <div>
          <label>New Password</label>
          <input name='password' type='password' value={ form.get('password') || '' } onChange={ this.handleChange }/>
        </div>
        <div>
          <button type="submit">Change</button>
        </div>
      </form>
    )
  }
}

function mapStateToProps(state) {
  return {
    reset_password_form: state.getIn(['forms', 'reset_password_form']),
    session_status: state.get('session_status')
  }
}

export default withRouter(connect(mapStateToProps, actionCreators)(ResetPassword))
