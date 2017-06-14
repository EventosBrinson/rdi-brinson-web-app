import React from 'react'
import { Link } from 'react-router-dom'
import * as abilitiesHelper from '../../modules/abilities-helpers'
import * as enumsHelpers from '../../modules/enums-helpers'

import { Collapse, Button, Tag } from 'antd';

export default class ClientList extends React.Component {

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
    let rendered_clients = []

    this.props.order.forEach( client_id => {
      let client = this.props.hashed.get(client_id)
      var activationButton = ""

      if(abilitiesHelper.isAdmin()) {
        if(this.props.active) {
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

      if(client.get('active') === this.props.active) {
        rendered_clients.push(
          <Collapse.Panel header={ header } key={ 'cl-' + client.get('id') }>
            { activationButton }
            <Button style={ { float: 'right', marginRight: '10px'} }>
              <Link to={ '/clients/' + client.get('id') + '/edit'}>Editar</Link>
            </Button>
          </Collapse.Panel>
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
