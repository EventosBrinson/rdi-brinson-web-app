import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import * as actionCreators from '../../action-creators'
import Immutable from 'immutable'

class Edit extends React.Component {

  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.processSubmit = this.processSubmit.bind(this)
    this.setUpUser = this.setUpUser.bind(this)

    this.user = Immutable.Map()
    this.setUpUser(props)
  }

  componentWillReceiveProps(nextProps) {
    this.setUpUser(nextProps)
  }

  setUpUser(props) {
    this.user_id = props.match.params.id

    if(props.session_status === 'SIGNED_IN') {
      if(props.users && (props.users.getIn(['get_user_statuses', this.user_id]) === 'READY' || props.users.get('get_users_status') === 'READY')) {
        this.user = props.users.getIn(['hashed', this.user_id])
      } else if(props.user.get('id') === this.user_id) {
        this.user = props.user
      } else if(!props.users || props.users.getIn(['get_user_statuses', this.user_id]) !== 'GETTING'){
        this.props.submitRequest('GET_USER', this.user_id)
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

    this.props.submitRequest('UPDATE_USER', { id: this.user_id, user: data })
  }

  render() {
    let form = this.props.user_form || Immutable.Map()

    return (
      <form onSubmit={ this.processSubmit }>
        <h2>
          Ediar usuario
        </h2>
        <div>
          <label>Email</label>
          <input name='email' type='email' value={ form.get('email') || this.user.get('email') || '' } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Nombre de usuario</label>
          <input name='username' type='text' value={ form.get('username') || this.user.get('username') || '' } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Nombres(s)</label>
          <input name='firstname' type='text' value={ form.get('firstname') || this.user.get('firstname') || '' } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Apellido(s)</label>
          <input name='lastname' type='text' value={ form.get('lastname') || this.user.get('lastname') || '' } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Role</label>
          <select name='role' value={ form.get('role') || this.user.get('role') || '' } onChange={ this.handleChange }>
            <option value="admin">Administrador</option>
            <option value="user">Usuario</option>
          </select>
        </div>
        <div>
          <button type="submit">Actializar</button>
        </div>
      </form>
    )
  }
}

function mapStateToProps(state) {
  return {
    user_form: state.getIn(['forms', 'user_form']),
    users: state.get('users'),
    user: state.get('user'),
    session_status: state.get('session_status'),
    state: state
  }
}

export default withRouter(connect(mapStateToProps, actionCreators)(Edit))
