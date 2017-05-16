import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom' 
import * as actionCreators from '../action-creators'
import SignOutButton from '../components/SignOutButton'

class Layout extends React.Component {

  render() {
    return (
      <div>
        <Link to="/">Inicio</Link>
        |
        <Link to="/sign_in">Iniciar sesión</Link>
        |
        <Link to="/users">Usuarios</Link>
        |
        <SignOutButton requestFunction={ this.props.submitRequest }>Sign Out</SignOutButton>
        { this.props.children }
        <pre>
          { JSON.stringify(this.props.state, null, 2) }
        </pre>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    state: state
  }
}

export default withRouter(connect(mapStateToProps, actionCreators)(Layout))
