import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import * as actionCreators from '../../action-creators'
import Immutable from 'immutable'
import moment from 'moment'

import { Form, Input, InputNumber, Button, DatePicker } from 'antd'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
}

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 14,
      offset: 6,
    },
  },
}

class Edit extends React.Component {

  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.handleDeliveryTimeChange = this.handleDeliveryTimeChange.bind(this)
    this.handlePickUpTimeChange = this.handlePickUpTimeChange.bind(this)
    this.handlePriceChange = this.handlePriceChange.bind(this)
    this.handleDiscountChange = this.handleDiscountChange.bind(this)
    this.processSubmit = this.processSubmit.bind(this)
    this.setUpRent = this.setUpRent.bind(this)

    this.rent = Immutable.Map()
  }

  componentWillMount() {
    this.rent_id = this.props.match.params.id

    this.props.cleanForm('edit_rent_form')
    this.setUpRent(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if(this.rent.get('id') === undefined) {
      this.setUpRent(nextProps)
    }
  }

  setUpRent(props) {
    if(props.session_status === 'SIGNED_IN') {
      if(props.rents && (props.rents.getIn(['get_rent_statuses', this.rent_id]) === 'READY' || props.rents.get('get_rents_status') === 'READY')) {
        this.rent = props.rents.getIn(['hashed', this.rent_id])
      } else if(!props.rents || props.rents.getIn(['get_rent_statuses', this.rent_id]) !== 'GETTING'){
        this.props.submitRequest('GET_RENT', {}, { id: this.rent_id })
      }
    }
  }

  handleChange(event) {
    this.props.changeForm('edit_rent_form', event.target.name, event.target.value)
  }

  handleDeliveryTimeChange(value) {
    if(this.props.form.getFieldValue('pick_up_time').isBefore(value)) {
      this.props.mergeForm('edit_rent_form', { delivery_time: value, pick_up_time: moment(value).add(1, 'day') })
    } else {
      this.props.changeForm('edit_rent_form', 'delivery_time', value)
    }
  }

  handlePickUpTimeChange(value) {
    this.props.changeForm('edit_rent_form', 'pick_up_time', value)
  }

  handlePriceChange(value) {
    this.props.changeForm('edit_rent_form', 'price', value)
  }

  handleDiscountChange(value) {
    this.props.changeForm('edit_rent_form', 'discount', value)
  }

  processSubmit(event) {
    if (event.preventDefault) {
      event.preventDefault()
    }

    let data = (this.props.edit_rent_form || Immutable.Map()).toJS()

    this.props.submitRequest('UPDATE_RENT', { rent: data }, { id: this.rent_id, from: '/rents', action: 'REDIRECT_TO' })
  }

  render() {
    let form = this.props.edit_rent_form || Immutable.Map()
    const { getFieldDecorator, isFieldsTouched } = this.props.form

    var datePickerLocale = {
      "lang": {
        "placeholder": "Fecha y hora",
        "now": "Ahora",
        "ok": "Ok",
        "timeSelect": "Hora",
        "dateSelect": "Fecha"
      }
    }

    const priceFormater = (value) => {
      var splited = String(value).split('.')
      var first = '', last = undefined

      if(splited[0]) {
        first = splited[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }
      if(splited[1] !== undefined) {
        last = splited[1]
      }

      return `$${first}${last !== undefined ? '.' + last.slice(-2) : '' }`
    }

    if(!this.rent.get('id')) {
      return null
    }

    return (
      <Form onSubmit={ this.processSubmit }>
        <Form.Item {...tailFormItemLayout}>
          <h2>
            Nueva renta
          </h2>
        </Form.Item>

        <Form.Item {...formItemLayout} label="Fecha de entrega" hasFeedback>
          { getFieldDecorator('delivery_time', {
            rules: [{ type: 'object', required: true, message: 'Selecciona una fecha de entrega' }],
            initialValue: form.get('delivery_time') || moment(this.rent.get('delivery_time'))
          })(
            <DatePicker
              locale={ datePickerLocale }
              showTime={{ use12Hours: true, format: 'HH:mm' }}
              format="dddd, DD [de] MMMM [de] YYYY [a las] hh:mm a"
              allowClear={ false }
              style={{ width: '100%' }}
              disabledDate={ current => current.isBefore(moment().startOf('day')) }
              onChange={ this.handleDeliveryTimeChange }/>
          )}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Fecha de recolección" hasFeedback>
          { getFieldDecorator('pick_up_time', {
            rules: [{ type: 'object', required: true, message: 'Selecciona una fecha de recolección' }],
            initialValue: form.get('pick_up_time') || moment(this.rent.get('pick_up_time'))
          })(
            <DatePicker
              locale={ datePickerLocale }
              showTime={{ use12Hours: true, format: 'HH:mm' }}
              format="dddd, DD [de] MMMM [de] YYYY [a las] hh:mm a"
              allowClear={ false }
              style={{ width: '100%' }}
              disabledDate={ current => current.isBefore(moment(form.get('delivery_time')).startOf('day')) }
              onChange={ this.handlePickUpTimeChange }/>
          )}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Producto" hasFeedback>
          { getFieldDecorator('product', {
            rules: [{
              required: true, message: 'Introduce el producto rentado',
              whitespace: true
            }],
            initialValue: form.get('product') || this.rent.get('product')
          })(
            <Input  type='textarea' name='product' placeholder="Producto rentado" autosize onChange={ this.handleChange } />
          )}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Precio" hasFeedback>
          { getFieldDecorator('price', {
            rules: [{
              type: 'number',
              required: true, message: 'Introduce el monto de la renta',
              whitespace: true
            }],
            initialValue: form.get('price') || this.rent.get('price')
          })(
            <InputNumber max={9999999} min={0} formatter={ priceFormater } parser={ value => value.replace(/\$\s?|(,*)/g, '') } style={{ width: '100%' }} onChange={ this.handlePriceChange }/>
          )}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Descuento" hasFeedback>
          { getFieldDecorator('discount', {
            rules: [{
              type: 'number',
              required: true, message: 'Introduce el monto descontado',
              whitespace: true
            }],
            initialValue: form.get('discount') || this.rent.get('discount')
          })(
            <InputNumber max={9999999} min={0} formatter={ priceFormater } parser={ value => value.replace(/\$\s?|(,*)/g, '') } style={{ width: '100%' }} onChange={ this.handleDiscountChange }/>
          )}
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large" disabled={ !isFieldsTouched() }>Actualizar</Button>
        </Form.Item>
      </Form>
    )
  }
}

function mapStateToProps(state) {
  return {
    edit_rent_form: state.getIn(['forms', 'edit_rent_form']),
    rents: state.get('rents'),
    session_status: state.get('session_status')
  }
}

export default withRouter(connect(mapStateToProps, actionCreators)(Form.create()(Edit)))
