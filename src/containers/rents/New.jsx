import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import * as actionCreators from '../../action-creators'
import Immutable from 'immutable'
import queryString from 'query-string'
import moment from 'moment'
import TimeSelect from '../../components/rents/TimeSelect'
import * as abilitiesHelper from '../../modules/abilities-helpers'

import { Form, Input, InputNumber, Select, Button, DatePicker } from 'antd'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 }
  }
}

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 14,
      offset: 6
    }
  }
}

class New extends React.Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.handleClientChange = this.handleClientChange.bind(this)
    this.handlePlaceChange = this.handlePlaceChange.bind(this)
    this.handleDeliveryDateChange = this.handleDeliveryDateChange.bind(this)
    this.handleDeliveryTimeChange = this.handleDeliveryTimeChange.bind(this)
    this.handlePickUpDateChange = this.handlePickUpDateChange.bind(this)
    this.handlePickUpTimeChange = this.handlePickUpTimeChange.bind(this)
    this.handlePriceChange = this.handlePriceChange.bind(this)
    this.handleDiscountChange = this.handleDiscountChange.bind(this)
    this.processSubmit = this.processSubmit.bind(this)
  }

  componentWillMount() {
    let params = queryString.parse(this.props.location.search)
    this.client_id = params.client_id

    if (this.props.get_clients_status !== 'READY') {
      params = {}

      if (abilitiesHelper.isAdmin()) {
        params['all'] = true
      }

      this.props.submitRequest('GET_CLIENTS', params)
    }

    this.setDefaultDates(this.props)
    this.setDefaults(this.props)
  }

  componentWillReceiveProps(nextProps) {
    let form = nextProps.rent_form || Immutable.Map()

    if (!form.get('client_id')) {
      this.setDefaults(nextProps)
    }
  }

  setDefaultDates(props) {
    let form = props.rent_form || Immutable.Map()
    var defaults = {}
    let rightNow = moment()

    rightNow.set('minutes', Math.floor(rightNow.get('minutes') / 10) * 10)

    if (!form.get('delivery_time')) {
      defaults['delivery_time'] = rightNow
    }
    if (!form.get('pick_up_time')) {
      defaults['pick_up_time'] = moment(rightNow).add(1, 'day')
    }

    props.mergeForm('rent_form', defaults)
  }

  setDefaults(props) {
    let form = props.rent_form || Immutable.Map()
    let clients = props.clients || Immutable.Map()

    let client = clients.get(Number(this.client_id))

    if (client && client.get('active')) {
      let placesOrder = client.get('places_order') || Immutable.List()

      props.mergeForm('rent_form', {
        client_id: String(client.get('id')),
        place_id: form.get('place_id') || placesOrder.get(0)
      })
    } else {
      let clientsOrder = props.clients_order || Immutable.List()

      clientsOrder = clientsOrder.filter(client_id => {
        return clients.get(client_id).get('active')
      })

      client = clients.get(clientsOrder.get(0))

      if (client) {
        let placesOrder = client.get('places_order') || Immutable.List()

        props.mergeForm('rent_form', {
          client_id: String(client.get('id')),
          place_id: placesOrder.get(0)
        })
      } else {
        props.mergeForm('rent_form', {
          client_id: undefined,
          place_id: undefined
        })
      }
    }
  }

  handleChange(event) {
    this.props.changeForm('rent_form', event.target.name, event.target.value)
  }

  handleClientChange(value) {
    let client_id = value
    let places_order = this.props.clients.get(client_id).get('places_order') || Immutable.List()

    this.props.mergeForm('rent_form', {
      client_id: client_id,
      place_id: places_order.get(0)
    })
  }

  handlePlaceChange(value) {
    this.props.changeForm('rent_form', 'place_id', value)
  }

  handleDeliveryDateChange(value) {
    if (this.props.form.getFieldValue('pick_up_time').isBefore(value)) {
      this.props.mergeForm('rent_form', { delivery_time: value, pick_up_time: moment(value).add(1, 'day') })
    } else {
      this.props.changeForm('rent_form', 'delivery_time', value)
    }
  }

  handleDeliveryTimeChange(value) {
    let current = this.props.form.getFieldValue('delivery_date')

    current.set('hour', value.get('hour'))
    current.set('minutes', value.get('minutes'))

    this.props.form.setFieldsValue({ delivery_date: current })
    this.props.changeForm('rent_form', 'delivery_time', current)
  }

  handlePickUpDateChange(value) {
    this.props.changeForm('rent_form', 'pick_up_time', value)
  }

  handlePickUpTimeChange(value) {
    let current = this.props.form.getFieldValue('pick_up_date')

    current.set('hour', value.get('hour'))
    current.set('minutes', value.get('minutes'))

    this.props.form.setFieldsValue({ pick_up_date: current })
    this.props.changeForm('rent_form', 'pick_up_time', current)
  }

  handlePriceChange(value) {
    this.props.changeForm('rent_form', 'price', value)
  }

  handleDiscountChange(value) {
    this.props.changeForm('rent_form', 'discount', value)
  }

  processSubmit(event) {
    if (event.preventDefault) {
      event.preventDefault()
    }

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = (this.props.rent_form || Immutable.Map()).toJS()

        this.props.submitRequest('CREATE_RENT', { rent: data })
      }
    })
  }

  render() {
    let form = this.props.rent_form || Immutable.Map()
    const { getFieldDecorator } = this.props.form
    let clientsOrder = this.props.clients_order || Immutable.List()
    let clients = this.props.clients || Immutable.Map()
    let selectedClient = clients.get(form.get('client_id') || this.client_id) || Immutable.Map()
    let places_order = selectedClient.get('places_order') || Immutable.List()

    var clientOptions = []

    clientsOrder.forEach(client_id => {
      let client = this.props.clients.get(client_id)

      if (client.get('active')) {
        clientOptions.push(
          <Select.Option key={'cl-' + client_id} value={client_id}>
            {client.get('lastname') + ' ' + client.get('firstname')}
          </Select.Option>
        )
      }
    })

    var placeOptions = []

    places_order.forEach(place_id => {
      let place = this.props.places.get(place_id)

      if (place.get('active')) {
        placeOptions.push(
          <Select.Option key={'pl-' + place_id} value={place_id}>
            {place.get('name')}
          </Select.Option>
        )
      }
    })

    var datePickerLocale = {
      lang: {
        placeholder: 'Fecha y hora',
        now: 'Ahora',
        ok: 'Ok',
        timeSelect: 'Hora',
        dateSelect: 'Fecha'
      }
    }

    const priceFormater = value => {
      var splited = String(value).split('.')
      var first = '',
        last = undefined

      if (splited[0]) {
        first = splited[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }
      if (splited[1] !== undefined) {
        last = splited[1]
      }

      return `$${first}${last !== undefined ? '.' + last.slice(-2) : ''}`
    }

    return (
      <Form onSubmit={this.processSubmit}>
        <Form.Item {...tailFormItemLayout}>
          <h2>Nueva renta</h2>
        </Form.Item>

        <Form.Item {...formItemLayout} label="Fecha de entrega" hasFeedback>
          {getFieldDecorator('delivery_date', {
            rules: [{ type: 'object', required: true, message: 'Selecciona una fecha de entrega' }],
            initialValue: form.get('delivery_time')
          })(
            <DatePicker
              locale={datePickerLocale}
              format="dddd, DD [de] MMMM [de] YYYY [a las] hh:mm a"
              allowClear={false}
              style={{ width: '100%' }}
              disabledDate={current => current.isBefore(moment().startOf('day'))}
              onChange={this.handleDeliveryDateChange}
            />
          )}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Hora de entrega" hasFeedback>
          {getFieldDecorator('delivery_time', {
            rules: [{ type: 'object', required: true, message: 'Selecciona una hora de entrega' }],
            initialValue: form.get('delivery_time')
          })(<TimeSelect name="delivery_time" onChange={this.handleDeliveryTimeChange} />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Fecha de recolección" hasFeedback>
          {getFieldDecorator('pick_up_date', {
            rules: [{ type: 'object', required: true, message: 'Selecciona una fecha de recolección' }],
            initialValue: form.get('pick_up_time')
          })(
            <DatePicker
              locale={datePickerLocale}
              format="dddd, DD [de] MMMM [de] YYYY [a las] hh:mm a"
              allowClear={false}
              style={{ width: '100%' }}
              disabledDate={current => current.isBefore(moment(form.get('delivery_time')).startOf('day'))}
              onChange={this.handlePickUpDateChange}
            />
          )}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Hora de recolección" hasFeedback>
          {getFieldDecorator('pick_up_time', {
            rules: [{ type: 'object', required: true, message: 'Selecciona una hora de recolección' }],
            initialValue: form.get('pick_up_time')
          })(<TimeSelect name="pick_up_time" onChange={this.handlePickUpTimeChange} />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Producto" hasFeedback>
          {getFieldDecorator('product', {
            rules: [
              {
                required: true,
                message: 'Introduce el producto rentado',
                whitespace: true
              }
            ],
            initialValue: form.get('product')
          })(
            <Input
              type="textarea"
              name="product"
              placeholder="Producto rentado"
              autosize
              onChange={this.handleChange}
            />
          )}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Precio" hasFeedback>
          {getFieldDecorator('price', {
            rules: [
              {
                type: 'number',
                required: true,
                message: 'Introduce el monto de la renta',
                whitespace: true
              }
            ],
            initialValue: form.get('price')
          })(
            <InputNumber
              max={9999999}
              min={0}
              formatter={priceFormater}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              style={{ width: '100%' }}
              onChange={this.handlePriceChange}
            />
          )}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Descuento" hasFeedback>
          {getFieldDecorator('discount', {
            rules: [
              {
                type: 'number',
                required: true,
                message: 'Introduce el monto descontado',
                whitespace: true
              }
            ],
            initialValue: form.get('discount')
          })(
            <InputNumber
              max={9999999}
              min={0}
              formatter={priceFormater}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              style={{ width: '100%' }}
              onChange={this.handleDiscountChange}
            />
          )}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Cliente">
          {getFieldDecorator('client_id', {
            rules: [{ required: true, message: 'Es necesario un cliente el cual asignar' }],
            initialValue: form.get('client_id')
          })(
            <Select name="client_id" onChange={this.handleClientChange}>
              {clientOptions}
            </Select>
          )}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Lugar">
          {getFieldDecorator('place_id', {
            rules: [{ required: true, message: 'Es necesario un lugar el cual asignar' }],
            initialValue: form.get('place_id')
          })(
            <Select name="place_id" onChange={this.handlePlaceChange}>
              {placeOptions}
            </Select>
          )}
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large">
            Reservar
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

function mapStateToProps(state) {
  return {
    rent_form: state.getIn(['forms', 'rent_form']),
    clients: state.getIn(['clients', 'hashed']),
    places: state.getIn(['places', 'hashed']),
    clients_order: state.getIn(['clients', 'order']),
    session_status: state.get('session_status'),
    get_clients_status: state.getIn(['clients', 'get_clients_status'])
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    actionCreators
  )(Form.create()(New))
)
