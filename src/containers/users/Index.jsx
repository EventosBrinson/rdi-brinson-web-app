import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import * as actionCreators from '../../action-creators'
import Immutable from 'immutable'
import UserList from '../../components/users/UserList'

import { Tabs, Button } from 'antd'


class Index extends React.Component {

  componentDidMount() {
    this.getUsers(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.getUsers(nextProps)
  }

  getUsers(props) {
    if(props.session_status === 'SIGNED_IN' && props.users.get('get_users_status') === undefined) {
      props.submitRequest('GET_USERS') 
    }
  }

  render() {
    return (
      <div style={{ marginTop: '20px'}}>
        <Button>
          <Link to="/users/new">
            Crear nuevo
          </Link>
        </Button>
        <Tabs>
          <Tabs.TabPane tab="Activos" key="1">
            <UserList active={ true } 
                      order={ this.props.order || Immutable.List() }
                      hashed={ this.props.hashed || Immutable.Map() }
                      submitRequest={ this.props.submitRequest }/>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Inactivos" key="2">
            <UserList active={ false } 
                      order={ this.props.order || Immutable.List() }
                      hashed={ this.props.hashed || Immutable.Map()}
                      submitRequest={ this.props.submitRequest }/>
          </Tabs.TabPane>
        </Tabs>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    users: state.get('users') || Immutable.Map(),
    hashed: state.getIn(['users', 'hashed']),
    order: state.getIn(['users', 'order']),
    session_status: state.get('session_status')
  }
}

export default withRouter(connect(mapStateToProps, actionCreators)(Index))
