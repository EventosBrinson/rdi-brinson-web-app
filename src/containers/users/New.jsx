import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import * as actionCreators from '../../action-creators'
import Immutable from 'immutable'

class New extends React.Component {

  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.processSubmit = this.processSubmit.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.session_status === 'SIGNED_IN') {
      let form = nextProps.user_form || Immutable.Map()

      if(form.get('role') === undefined) {
        nextProps.mergeForm('user_form', {
          role: form.get('role') || 'admin'
        })
      }
    }
  }

  handleChange(event) {
    this.props.changeForm('user_form', event.target.name, event.target.value)
  }

  processSubmit(event) {
    if (event.preventDefault) {
      event.preventDefault()
    }

    let data = (this.props.user_form || Immutable.Map()).toJS()

    this.props.submitRequest('CREATE_USER', data)
  }

  render() {
    let form = this.props.user_form || Immutable.Map()

    return (
      <form onSubmit={ this.processSubmit }>
        <h2>
          Nuevo usuario
        </h2>
        <div>
          <label>Email</label>
          <input name='email' type='email' value={ form.get('email') || '' } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Nombre de usuario</label>
          <input name='username' type='text' value={ form.get('username') || '' } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Nombres(s)</label>
          <input name='firstname' type='text' value={ form.get('firstname') || '' } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Apellido(s)</label>
          <input name='lastname' type='text' value={ form.get('lastname') || '' } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Role</label>
          <select name='role' value={ form.get('role') || '' } onChange={ this.handleChange }>
            <option value="admin">Administrador</option>
            <option value="user">Usuario</option>
          </select>
        </div>
        <div>
          <button type="submit">Crear</button>
        </div>
      </form>
    )
  }
}

function mapStateToProps(state) {
  return {
    user_form: state.getIn(['forms', 'user_form']),
    session_status: state.get('session_status')
  }
}

export default withRouter(connect(mapStateToProps, actionCreators)(New))
