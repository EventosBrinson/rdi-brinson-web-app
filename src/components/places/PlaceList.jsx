import React from 'react'
import { Link } from 'react-router-dom'
import * as abilitiesHelper from '../../modules/abilities-helpers'
import * as castHelpers from '../../modules/cast-helpers'

import { Button, Popconfirm } from 'antd'

export default class PlaceList extends React.Component {
  deactivate(place, event) {
    if (event.preventDefault) {
      event.preventDefault()
    }

    this.props.submitRequest('UPDATE_PLACE', { place: { active: 0 } }, { id: place.get('id') })
  }

  activate(place, event) {
    if (event.preventDefault) {
      event.preventDefault()
    }

    this.props.submitRequest('UPDATE_PLACE', { place: { active: 1 } }, { id: place.get('id') })
  }

  render() {
    let rendered_places = []

    this.props.order.forEach(place_id => {
      let place = this.props.hashed.get(place_id)
      var activationButton = ''

      if (abilitiesHelper.isMain() || (abilitiesHelper.isAdmin() && !abilitiesHelper.isAdmin(place))) {
        if (this.props.active) {
          activationButton = (
            <Popconfirm
              title="¿Seguro que quiere desactivar este placee?"
              onConfirm={this.deactivate.bind(this, place)}
              okText="Sí"
              cancelText="No"
            >
              <Button type="danger">Desactivar</Button>
            </Popconfirm>
          )
        } else {
          activationButton = (
            <Popconfirm
              title="¿Seguro que quiere reactivar este placee?"
              onConfirm={this.activate.bind(this, place)}
              okText="Sí"
              cancelText="No"
            >
              <Button type="primary">Activar</Button>
            </Popconfirm>
          )
        }
      }

      if (place.get('active') === this.props.active) {
        rendered_places.push(
          <tr className="ant-table-row  ant-table-row-level-0" key={'cl-' + place.get('id')}>
            <td>
              <span className="ant-table-row-indent indent-level-0" style={{ paddingLeft: '0px' }}>
                <Link to={'/clients/' + place.get('client_id')}>{place.get('name')}</Link>
                <div>{castHelpers.address(place)}</div>
              </span>
            </td>
            <td style={{ width: '1%', whiteSpace: 'nowrap' }}>
              <Button>
                <Link to={'/places/' + place.get('id') + '/edit'}>Editar</Link>
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
                  <tbody className="ant-table-tbody">{rendered_places}</tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
