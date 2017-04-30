import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import * as actionCreators from '../action-creators'
import Immutable from 'immutable'

class RecoverPassword extends React.Component {

  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.processSubmit = this.processSubmit.bind(this)
  }

  handleChange(event) {
    this.props.changeForm('recover_password_form', event.target.name, event.target.value)
  }

  processSubmit(event) {
    if (event.preventDefault) {
      event.preventDefault()
    }

    let data = (this.props.recover_password_form || Immutable.Map()).toJS()

    this.props.submitRequest('REQUEST_RESET_PASSWORD', data)
  }

  render() {
    let form = this.props.recover_password_form || Immutable.Map()

    return (
      <form onSubmit={ this.processSubmit }>
        <h2>
          Recover password
        </h2>
        <div>
          <label>Email/Username</label>
          <input name='credential' type='text' value={ form.get('credential') || '' } onChange={ this.handleChange } />
        </div>
        <div>
          <button type="submit">Recover</button>
        </div>
      </form>
    )
  }
}

function mapStateToProps(state) {
  return {
    recover_password_form: state.getIn(['forms', 'recover_password_form']),
    session_status: state.get('session_status')
  }
}

export default withRouter(connect(mapStateToProps, actionCreators)(RecoverPassword))
