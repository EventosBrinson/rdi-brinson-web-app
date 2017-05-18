import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import * as actionCreators from '../../action-creators'
import Immutable from 'immutable'

class Index extends React.Component {

  componentDidMount() {
    if(this.props.users.get('get_users_status') === undefined) {
      this.props.submitRequest('GET_USERS') 
    }
  }

  render() {
    let users = this.props.hashed_users || Immutable.List()
    let rendered_users = []

    users.forEach( user => {
      rendered_users.push(
        <tr key={ user.get('id') }>
          <td>{ user.get('username') }</td>
          <td>{ user.get('firstname') }</td>
          <td>{ user.get('lastname') }</td>
          <td>{ user.get('email') }</td>
          <td>{ user.get('active') ? 'Si' : 'No' }</td>
          <td>{ user.get('active_since') }</td>
          <td><Link to={'/users/' + user.get('id')+ '/edit'}>Edit</Link></td>
        </tr>
      )
    })

    return (
      <div>
        <h3>Usuarios</h3>
        <table>
          <thead>
            <tr>
              <th>Nombre de usuario</th>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>Email</th>
              <th>Activo</th>
              <th>Activo desde</th>
              <th />
            </tr>
          </thead>
          <tbody>
            { rendered_users }
          </tbody>
        </table>
        <br />
        <Link to="/users/new">Crear nuevo</Link>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    users: state.get('users') || Immutable.Map(),
    hashed_users: state.getIn(['users', 'ordered'])
  }
}

export default withRouter(connect(mapStateToProps, actionCreators)(Index))
