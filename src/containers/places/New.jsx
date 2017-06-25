import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import * as actionCreators from '../../action-creators'
import Immutable from 'immutable'
import queryString from 'query-string'

import { Form, Input, Select, Button } from 'antd'

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

class New extends React.Component {

  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.handleClientIdChange = this.handleClientIdChange.bind(this)
    this.processSubmit = this.processSubmit.bind(this)
  }

  componentWillMount() {
    let params = queryString.parse(this.props.location.search)
    this.client_id = params.client_id

    if(this.props.get_clients_status === undefined) {
      this.props.submitRequest('GET_CLIENTS')
    }

    this.setDefaults(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.setDefaults(nextProps)
  }

  setDefaults(props) {
    let form = props.place_form || Immutable.Map()
    let clientsOrder = props.clients_order || Immutable.List()

    if(this.client_id) {
      if(clientsOrder.size > 0) {
        props.mergeForm('place_form', {
          client_id: this.client_id
        })
      }
    } else if(props.session_status === 'SIGNED_IN' && props.get_clients_status === 'READY') {
      if(form.get('client_id') === undefined) {
        if(clientsOrder.size > 0) {
          props.mergeForm('place_form', {
            client_id: form.get('client_id') || clientsOrder.get(0)
          })
        }
      }
    }
  }

  handleChange(event) {
    this.props.changeForm('place_form', event.target.name, event.target.value)
  }

  handleClientIdChange(value) {
    this.props.changeForm('place_form', 'client_id', value)
  }

  processSubmit(event) {
    if (event.preventDefault) {
      event.preventDefault()
    }

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = (this.props.place_form || Immutable.Map()).toJS()

        this.props.submitRequest('CREATE_PLACE', { place: data })
      }
    })
  }

  render() {
    let form = this.props.place_form || Immutable.Map()
    const { getFieldDecorator } = this.props.form

    let clientsOrder = this.props.clients_order || Immutable.List()

    var clientOptions = []

    clientsOrder.forEach( client_id => {
      let client = this.props.clients.get(client_id)

      clientOptions.push(
        <Select.Option key={ 'cl-' + client_id }value={ client_id }>{ client.get('firstname') + ' ' + client.get('lastname') }</Select.Option>
      )
    })

    return (
      <Form onSubmit={ this.processSubmit }>
        <Form.Item {...tailFormItemLayout}>
          <h2>
            Nuevo lugar
          </h2>
        </Form.Item>

        <Form.Item {...formItemLayout} label="Nombre" hasFeedback>
          { getFieldDecorator('name', {
            rules: [{
              required: true, message: 'Introduce un nombre para el lugar',
              whitespace: true
            }],
            initialValue: form.get('name')
          })(
            <Input name='name' placeholder="Nombre" onChange={ this.handleChange }/>
          )}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Calle" hasFeedback>
          { getFieldDecorator('street', {
            rules: [{
              required: true, message: 'Introduce el nombre de la calle',
              whitespace: true
            }],
            initialValue: form.get('street')
          })(
            <Input name='street' placeholder="Calle" onChange={ this.handleChange } />
          )}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Numero exterior" hasFeedback>
          { getFieldDecorator('outer_number', {
            rules: [{
              required: true, message: 'Introduce el numero exterior del lugar',
              whitespace: true
            }],
            initialValue: form.get('outer_number')
          })(
            <Input name='outer_number' placeholder="Numero exterior" onChange={ this.handleChange } />
          )}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Numero interior" hasFeedback>
          { getFieldDecorator('inner_number', {
            initialValue: form.get('inner_number')
          })(
            <Input name='inner_number' placeholder="Numero interior" onChange={ this.handleChange } />
          )}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Fraccionamiento" hasFeedback>
          { getFieldDecorator('neighborhood', {
            rules: [{
              required: true, message: 'Introduce el nombre del fraccionamiento del lugar',
              whitespace: true
            }],
            initialValue: form.get('neighborhood')
          })(
            <Input name='neighborhood' placeholder="Fraccionamiento" onChange={ this.handleChange } />
          )}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Codigo Postal" hasFeedback>
          { getFieldDecorator('postal_code', {
            rules: [{
              pattern: /^\d+$/,
              message: 'El codigo postal debe ser un número'}, {
              required: true,
              message: 'Introduce el codigo postal del lugar',
              whitespace: true
            }],
            initialValue: form.get('postal_code')
          })(
            <Input name='postal_code' placeholder="Codigo Postal" onChange={ this.handleChange } />
          )}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Cliente">
          { getFieldDecorator('client_id', {
            rules: [{ required: true, message: 'Es necesario un cliente al cual asignar' }],
            initialValue: form.get('client_id')
          })(
            <Select name='client_id' onChange={ this.handleClientIdChange } disabled={ this.client_id !== undefined }>
              { clientOptions }
            </Select>
          )}
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large">Crear</Button>
        </Form.Item>
      </Form>
    )
  }
}

function mapStateToProps(state) {
  return {
    place_form: state.getIn(['forms', 'place_form']),
    clients: state.getIn(['clients', 'hashed']),
    clients_order: state.getIn(['clients', 'order']),
    session_status: state.get('session_status'),
    get_clients_status: state.getIn(['clients', 'get_clients_status'])
  }
}

export default withRouter(connect(mapStateToProps, actionCreators)(Form.create()(New)))
