import React from 'react'
import { Link } from 'react-router-dom'
import * as abilitiesHelper from '../../modules/abilities-helpers'
import * as enumsHelpers from '../../modules/enums-helpers'

import { Button, Tag, Popconfirm } from 'antd'

export default class ClientList extends React.Component {
  deactivate(client, event) {
    if (event.preventDefault) {
      event.preventDefault()
    }

    this.props.submitRequest('UPDATE_CLIENT', { client: { active: 0 } }, { id: client.get('id') })
  }

  activate(client, event) {
    if (event.preventDefault) {
      event.preventDefault()
    }

    this.props.submitRequest('UPDATE_CLIENT', { client: { active: 1 } }, { id: client.get('id') })
  }

  render() {
    let rendered_clients = []

    this.props.order.forEach(client_id => {
      let client = this.props.hashed.get(client_id)
      var activationButton = ''

      if (abilitiesHelper.isMain() || (abilitiesHelper.isAdmin() && !abilitiesHelper.isAdmin(client))) {
        if (this.props.active) {
          activationButton = (
            <Popconfirm
              title="¿Seguro que quiere desactivar este cliente?"
              onConfirm={this.deactivate.bind(this, client)}
              okText="Sí"
              cancelText="No"
            >
              <Button type="danger">Desactivar</Button>
            </Popconfirm>
          )
        } else {
          activationButton = (
            <Popconfirm
              title="¿Seguro que quiere reactivar este cliente?"
              onConfirm={this.activate.bind(this, client)}
              okText="Sí"
              cancelText="No"
            >
              <Button type="primary">Activar</Button>
            </Popconfirm>
          )
        }
      }

      if (client.get('active') === this.props.active) {
        rendered_clients.push(
          <tr className="ant-table-row  ant-table-row-level-0" key={'cl-' + client.get('id')}>
            <td>
              <span className="ant-table-row-indent indent-level-0" style={{ paddingLeft: '0px' }}>
                <Link to={'/clients/' + client.get('id')}>
                  {client.get('lastname') + ' ' + client.get('firstname')}
                  <Tag style={{ marginLeft: '5px' }}>{enumsHelpers.rentType(client.get('rent_type'))}</Tag>
                </Link>
              </span>
            </td>
            <td style={{ width: '1%', whiteSpace: 'nowrap' }}>
              <Button>
                <Link to={'/clients/' + client.get('id') + '/edit'}>Editar</Link>
              </Button>
            </td>
            <td style={{ width: '1%', whiteSpace: 'nowrap' }}>{activationButton}</td>
          </tr>
        )
      }
    })

    return (
      <div className="ant-spin-nested-loading">
        <div className="ant-spin-container">
          <div className="ant-table ant-table-scroll-position-left">
            <div className="ant-table-content">
              <div className="ant-table-body">
                <table className="">
                  <tbody className="ant-table-tbody">{rendered_clients}</tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
