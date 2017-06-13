import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import * as actionCreators from '../../action-creators'
import Immutable from 'immutable'
import * as enumsHelpers from '../../modules/enums-helpers'

import { Tabs, Button } from 'antd'
const TabPane = Tabs.TabPane

import { Collapse } from 'antd';
const Panel = Collapse.Panel;

import { Tag } from 'antd';

class Index extends React.Component {

  constructor(props) {
    super(props)

    this.renderClients = this.renderClients.bind(this)
  }

  componentDidMount() {
    this.getClients(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.getClients(nextProps)
  }

  getClients(props) {
    if(props.session_status === 'SIGNED_IN' && props.clients.get('get_clients_status') !== 'READY') {
      props.submitRequest('GET_CLIENTS') 
    }
  }

  deactivate(client, event) {
    if(event.preventDefault) {
      event.preventDefault()
    }

    this.props.submitRequest('UPDATE_CLIENT', { id: client.get('id'), client: { active: 0 } })
  }

  activate(client, event) {
    if(event.preventDefault) {
      event.preventDefault()
    }

    this.props.submitRequest('UPDATE_CLIENT', { id: client.get('id'), client: { active: 1 } })
  }

  render() {
    return (
      <div style={ { marginTop: '20px'} }>
        <Button>
          <Link to="/clients/new">
            Crear nuevo
          </Link>
        </Button>
        <Tabs>
          <TabPane tab="Activos" key="1">
            { this.renderClients(true) }
          </TabPane>
          <TabPane tab="Inactivos" key="2">
            { this.renderClients(false) }
          </TabPane>
        </Tabs>
      </div>
    )
  }

  renderClients(active) {
    let clients_order = this.props.order || Immutable.List()
    let clients = this.props.hashed || Immutable.Map()
    let rendered_clients = []
    let user = this.props.user || Immutable.Map()

    clients_order.forEach( client_id => {
      let client = clients.get(client_id)
      var activationButton = ""

      if(user.get('role') === 'admin' || user.get('role') === 'staff') {
        if(active) {
          activationButton = (
            <Button type="danger" style={ { float: 'right'} } onClick={ this.deactivate.bind(this, client) }>
              Desactivar
            </Button>
          )
        } else {
          activationButton = (
            <Button type="primary" style={ { float: 'right'} } onClick={ this.activate.bind(this, client) }>
              Activar
            </Button>
          )
        }
      }

      let header = (
        <Link to={ '/clients/' + client.get('id') }>
          { client.get('lastname') + ' ' + client.get('firstname') }
          <Tag style={ { marginLeft: '5px'} }>{ enumsHelpers.rentType(client.get('rent_type')) }</Tag>
        </Link>
      )

      if(client.get('active') === active) {
        rendered_clients.push(
          <Panel header={ header } key={ 'cl-' + client.get('id') }>
            { activationButton }
            <Button style={ { float: 'right', marginRight: '10px'} }>
              <Link to={ '/clients/' + client.get('id') + '/edit'}>Editar</Link>
            </Button>
          </Panel>
        )
      }
    })

    return (
      <Collapse bordered={false}>
       { rendered_clients }
      </Collapse>
    )
  }
}

function mapStateToProps(state) {
  return {
    clients: state.get('clients') || Immutable.Map(),
    hashed: state.getIn(['clients', 'hashed']),
    order: state.getIn(['clients', 'order']),
    session_status: state.get('session_status'),
    user: state.get('user')
  }
}

export default withRouter(connect(mapStateToProps, actionCreators)(Index))
