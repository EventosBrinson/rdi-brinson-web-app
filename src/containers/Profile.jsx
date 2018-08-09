import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import * as actionCreators from '../action-creators'
import Immutable from 'immutable'

class Profile extends React.Component {
  render() {
    let user = this.props.user

    return (
      <div>
        <h3>
          {user.get('firstname') + ' ' + user.get('lastname')} <small>{user.get('role')}</small>
        </h3>
        <p>
          {user.get('username')} - {user.get('email')}
        </p>
        <Link to={'/users/' + user.get('id') + '/edit'}>Editar</Link>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.get('user') || Immutable.Map()
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    actionCreators
  )(Profile)
)
