import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import * as actionCreators from '../action-creators'
import SignOutButton from '../components/SignOutButton'
import Immutable from 'immutable'
import * as abilitiesHelper from '../modules/abilities-helpers'

import { Row, Col, Menu, Icon, Dropdown } from 'antd'

class MasterLayout extends React.Component {
  render() {
    let user = this.props.user || Immutable.Map()

    const menu = (
      <Menu>
        <Menu.Item>
          <SignOutButton requestFunction={this.props.submitRequest}>Cerrar sesión</SignOutButton>
        </Menu.Item>
      </Menu>
    )

    var userui = null

    if (this.props.session_status === 'SIGNED_IN') {
      userui = (
        <Row type="flex" justify="center" align="middle">
          <Col xs={24} sm={20} md={16} lg={12} xl={12}>
            <Menu mode="horizontal">
              <Menu.Item>
                <Link to="/">
                  <Icon type="home" />
                  Inicio
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link to="/users">
                  <Icon type="user" />
                  Usuarios
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link to="/clients">
                  <Icon type="team" />
                  Clientes
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link to="/places">
                  <Icon type="environment-o" />
                  Lugares
                </Link>
              </Menu.Item>
              <Dropdown overlay={menu}>
                <Link to="/profile" className="ant-dropdown-link" style={{ float: 'right', marginRight: '20px' }}>
                  {user.get('username')}
                  <Icon type="down" />
                </Link>
              </Dropdown>
            </Menu>
            {this.props.children}
            <Row>
              <pre>
                {false && (abilitiesHelper.isStaff() || process.env.NODE_ENV === 'development')
                  ? JSON.stringify(this.props.state, null, 2)
                  : ''}
              </pre>
            </Row>
          </Col>
        </Row>
      )
    } else if (this.props.session_status === 'NOT_SIGNED_IN') {
      userui = (
        <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
          {this.props.children}
          <pre>{process.env.NODE_ENV === 'development' ? JSON.stringify(this.props.state, null, 2) : ''}</pre>
        </div>
      )
    }

    return userui
  }
}

function mapStateToProps(state) {
  return {
    user: state.get('user'),
    session_status: state.get('session_status'),
    state: state
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    actionCreators
  )(MasterLayout)
)
