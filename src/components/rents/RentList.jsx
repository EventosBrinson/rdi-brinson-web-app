import React from 'react'
import { Link } from 'react-router-dom'
import * as abilitiesHelper from '../../modules/abilities-helpers'
import * as castHelpers from '../../modules/cast-helpers'
import * as enumsHelpers from '../../modules/enums-helpers'
import moment from 'moment'

moment.locale('es');

import { Button, Popconfirm, Row, Card, Tag, Steps, Icon, Popover } from 'antd'

export default class RentList extends React.Component {

  updateRent(rent, status, event) {
    if(event.preventDefault) {
      event.preventDefault()
    }

    this.props.submitRequest('UPDATE_RENT', { rent: { status: status }}, { id: rent.get('id') })
  }

  render() {
    let renderedRents = []

    this.props.order.forEach( rent_id => {
      let rent = this.props.hashed.get(rent_id)
      var cancelButton = undefined
      var actionButton = undefined
      var additionalButton = undefined
      var tag = undefined

      if((abilitiesHelper.isAdmin() || (rent.get('status') === 'reserved' || rent.get('status') === 'on_route')) && (rent.get('status') !== 'canceled' && rent.get('status') !== 'finalized')) {
        cancelButton = (
          <Popconfirm title="¿Seguro que deceas cancelar esta renta?" onConfirm={ this.updateRent.bind(this, rent, 'canceled') } okText="Sí" cancelText="No">
            <Button type="danger">
              Cancelar
            </Button>
          </Popconfirm>
        )
      }

      switch(rent.get('status')) {
        case 'reserved':
          additionalButton = (
            <Button type="dashed">
              <Link to={ '/rents/' + rent.get('id') + '/edit' }>Editar</Link>
            </Button>
          )
          actionButton = (
            <Popconfirm title="¿Seguro que deceas poner esta renta en ruta?" onConfirm={ this.updateRent.bind(this, rent, 'on_route') } okText="Sí" cancelText="No">
              <Button type="primary">
                En ruta<Icon type="right" />
              </Button>
            </Popconfirm>
          )
          tag = (
            <Tag color="#2DB7F5" style={{ margin: '2px 0px 0px 0px' }}>
              { enumsHelpers.rentStatus(rent.get('status')) }
            </Tag>
          )
          break
        case 'on_route':
          actionButton = (
            <Popconfirm title="¿Seguro que deceas establecer esta renta como entregada?" onConfirm={ this.updateRent.bind(this, rent, 'delivered') } okText="Sí" cancelText="No">
              <Button type="primary">
                Entregada<Icon type="right" />
              </Button>
            </Popconfirm>
          )
          tag = (
            <Tag color="white" style={{ margin: '2px 0px 0px 0px', color: '#FF8C28', border: '2px solid #FF8C28' }}>
              { enumsHelpers.rentStatus(rent.get('status')) }
            </Tag>
          )
          break
        case 'delivered':
          actionButton = (
            <Popconfirm title="¿Seguro que deceas establecer esta renta como en recolección?" onConfirm={ this.updateRent.bind(this, rent, 'on_pick_up') } okText="Sí" cancelText="No">
              <Button type="primary">
                En recolección<Icon type="right" />
              </Button>
            </Popconfirm>
          )
          tag = (
            <Tag color="#7148b2" style={{ margin: '2px 0px 0px 0px' }}>
              { enumsHelpers.rentStatus(rent.get('status')) }
            </Tag>
          )
          break
        case 'on_pick_up':
          additionalButton = (
            <Popconfirm title="¿Seguro que deceas establecer esta renta como pendiente de recolección?" onConfirm={ this.updateRent.bind(this, rent, 'pending') } okText="Sí" cancelText="No">
              <Button type="dashed">
                Pendiente de recolección<Icon type="right" />
              </Button>
            </Popconfirm>
          )
          actionButton = (
            <Popconfirm title="¿Seguro que deceas finalizar esta renta?" onConfirm={ this.updateRent.bind(this, rent, 'finalized') } okText="Sí" cancelText="No">
              <Button type="primary">
                Finalizar<Icon type="right" />
              </Button>
            </Popconfirm>
          )
          tag = (
            <Tag color="white" style={{ margin: '2px 0px 0px 0px', color: '#CCC71A', border: '2px solid #CCC71A' }}>
              { enumsHelpers.rentStatus(rent.get('status')) }
            </Tag>
          )
          break
        case 'pending':
          actionButton = (
            <Popconfirm title="¿Seguro que deceas establecer esta renta como en recolección?" onConfirm={ this.updateRent.bind(this, rent, 'on_pick_up') } okText="Sí" cancelText="No">
              <Button type="primary">
                En recolección<Icon type="right" />
              </Button>
            </Popconfirm>
          )
          tag = (
            <Tag color="#CCC71A" style={{ margin: '2px 0px 0px 0px' }}>
              { enumsHelpers.rentStatus(rent.get('status')) }
            </Tag>
          )
          break
        case 'finalized':
          tag = (
            <Tag color="#00DB5B" style={{ margin: '2px 0px 0px 0px' }}>
              { enumsHelpers.rentStatus(rent.get('status')) }
            </Tag>
          )
          break
        case 'canceled':
          tag = (
            <Tag color="#FF0037" style={{ margin: '2px 0px 0px 0px' }}>
              { enumsHelpers.rentStatus(rent.get('status')) }
            </Tag>
          )
          break
        default:
          break
      }

      if(abilitiesHelper.isMain() || (abilitiesHelper.isAdmin() && !abilitiesHelper.isAdmin(rent))) {

      }

      if(!this.props.status || this.props.status === rent.get('status')) {
        renderedRents.push(
          <div className="ant-card ant-card-bordered" key={ rent.get('id') } style={{ margin: '0px 5px 10px 5px' }}>
            <div className="ant-card-body" style={{ padding: '5px 5px 5px 5px' }}>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <h2>
                        <Link to={ '/clients/' + rent.get('client').get('id') }>{ castHelpers.fullname(rent.get('client')) }</Link>
                      </h2>
                      <h3>
                        #{ rent.get('order_number') }
                      </h3>
                      <h3>
                        { enumsHelpers.rentType(rent.get('rent_type')) }
                      </h3>
                    </td>
                    <td style={{ width: '1%', whiteSpace: 'nowrap' }}>
                      { tag }
                    </td>
                  </tr>
                </tbody>
              </table>
              <table style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    <td style={{ paddingTop: '10px' }}>
                      <p>
                        { rent.get('product') }
                      </p>
                    </td>
                    <td style={{ textAlign: 'right', verticalAlign: 'bottom', paddingTop: '10px' }}>
                      <h3>
                        { castHelpers.priceFormater(Number(rent.get('price')) + Number(rent.get('discount'))) }
                      </h3>
                    </td>
                  </tr>
                  { rent.get('discount') ? (
                    <tr>
                      <td>
                        <p>
                          Descuento
                        </p>
                      </td>
                      <td style={{ textAlign: 'right', verticalAlign: 'bottom' }}>
                        <h3>
                          -{ castHelpers.priceFormater(rent.get('discount')) }
                        </h3>
                      </td>
                    </tr>
                    ):( undefined ) }
                  { rent.get('additional_charges') ? (
                    <tr>
                      <td>
                        <p>
                          { rent.get('additional_charges_notes') }
                        </p>
                      </td>
                      <td style={{ textAlign: 'right', verticalAlign: 'bottom' }}>
                        <h3>
                          { castHelpers.priceFormater(rent.get('additional_charges')) }
                        </h3>
                      </td>
                    </tr>
                    ):( undefined ) }
                  <tr>
                    <td colSpan={ 2 } style={{ borderBottom: '1pt solid #CCCCCC', width: '100%', height: '1px' }}>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'right', verticalAlign: 'bottom' }}>
                      <h2 style={{ marginRight: '5px' }}>
                        Total
                      </h2>
                    </td>
                    <td style={{ textAlign: 'right', verticalAlign: 'bottom' }}>
                      <h2>
                        { castHelpers.priceFormater(Number(rent.get('price')) + Number(rent.get('additional_charges'))) }
                      </h2>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table style={{ width: '100%', marginTop: '10px', borderTop: '1pt solid #CCCCCC'}}>
                <tbody>
                  <tr style={{ textAlign: 'center' }}>
                    <td style={{ textTransform: 'capitalize', width: '50%' }}>
                      Entrega: <b>{ moment(rent.get('delivery_time')).format('dddd') }</b>
                    </td>
                    <td style={{ textTransform: 'capitalize', width: '50%' }}>
                      Recolección: <b>{ moment(rent.get('pick_up_time')).format('dddd') }</b>
                    </td>
                  </tr>
                  <tr style={{ textAlign: 'center' }}>
                    <td style={{ textTransform: 'capitalize' }}>
                      { moment(rent.get('delivery_time')).format('DD/MMMM/YYYY') }
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>
                      { moment(rent.get('pick_up_time')).format('DD/MMMM/YYYY') }
                    </td>
                  </tr>
                  <tr style={{ textAlign: 'center' }}>
                    <td>
                      { moment(rent.get('delivery_time')).format('hh:mm a') }
                    </td>
                    <td>
                      { moment(rent.get('pick_up_time')).format('hh:mm a') }
                    </td>
                  </tr>
                </tbody>
              </table>
              <table style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    <td style={{ textAlign: 'center' }}>
                      <b>{ rent.get('place').get('name') }</b>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'center' }}>
                      { castHelpers.address(rent.get('place')) }
                    </td>
                  </tr>
                </tbody>
              </table>
              { cancelButton || additionalButton || actionButton ? (
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                  <Button.Group style={{ display: 'inline-block' }}>
                    { cancelButton }
                    { additionalButton }
                    { actionButton }
                  </Button.Group>
                </div>
                ) : undefined
              }
            </div>
          </div>
        )
      }

    })

    return (
      <Row>
        { renderedRents }
      </Row>
    )
  }
}