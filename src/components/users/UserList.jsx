import React from 'react'
import { Link } from 'react-router-dom'
import * as abilitiesHelper from '../../modules/abilities-helpers'
import * as enumsHelpers from '../../modules/enums-helpers'

import { Button, Tag, Popconfirm } from 'antd'

export default class UserList extends React.Component {
  deactivate(user, event) {
    if (event.preventDefault) {
      event.preventDefault()
    }

    this.props.submitRequest('UPDATE_USER', { user: { active: 0 } }, { id: user.get('id') })
  }

  activate(user, event) {
    if (event.preventDefault) {
      event.preventDefault()
    }

    this.props.submitRequest('UPDATE_USER', { user: { active: 1 } }, { id: user.get('id') })
  }

  render() {
    let rendered_users = []

    this.props.order.forEach(user_id => {
      let user = this.props.hashed.get(user_id)
      var activationButton = ''

      if (abilitiesHelper.isMain() || (abilitiesHelper.isAdmin() && !abilitiesHelper.isAdmin(user))) {
        if (this.props.active) {
          activationButton = (
            <Popconfirm
              title="¿Seguro que quiere desactivar este usuario?"
              onConfirm={this.deactivate.bind(this, user)}
              okText="Sí"
              cancelText="No"
            >
              <Button type="danger">Desactivar</Button>
            </Popconfirm>
          )
        } else {
          activationButton = (
            <Popconfirm
              title="¿Seguro que quiere reactivar este usuario?"
              onConfirm={this.activate.bind(this, user)}
              okText="Sí"
              cancelText="No"
            >
              <Button type="primary">Activar</Button>
            </Popconfirm>
          )
        }
      }

      let tag = ''

      if (abilitiesHelper.isAdmin(user)) {
        tag = <Tag style={{ marginRight: '10px', marginLeft: '5px' }}>{enumsHelpers.role(user.get('role'))}</Tag>
      } else if (!user.get('confirmed_at')) {
        tag = (
          <Tag color="yellow" style={{ marginRight: '10px', marginLeft: '5px' }}>
            Sin confirmar
          </Tag>
        )
      }

      if (
        abilitiesHelper.isMain() ||
        (abilitiesHelper.isAdmin() && !abilitiesHelper.isAdmin(user)) ||
        abilitiesHelper.itsMe(user)
      ) {
        if (user.get('active') === this.props.active) {
          rendered_users.push(
            <tr className="ant-table-row  ant-table-row-level-0" key={'cl-' + user.get('id')}>
              <td>
                <span className="ant-table-row-indent indent-level-0" style={{ paddingLeft: '0px' }}>
                  <h4>
                    {user.get('lastname') + ' ' + user.get('firstname')}
                    <small>{tag}</small>
                  </h4>
                </span>
              </td>
              <td style={{ width: '1%', whiteSpace: 'nowrap' }}>
                <Button>
                  <Link to={'/users/' + user.get('id') + '/edit'}>Editar</Link>
                </Button>
              </td>
              <td style={{ width: '1%', whiteSpace: 'nowrap' }}>{activationButton}</td>
            </tr>
          )
        }
      }
    })

    return (
      <div className="ant-spin-nested-loading">
        <div className="ant-spin-container">
          <div className="ant-table ant-table-scroll-position-left">
            <div className="ant-table-content">
              <div className="ant-table-body">
                <table className="">
                  <tbody className="ant-table-tbody">{rendered_users}</tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
