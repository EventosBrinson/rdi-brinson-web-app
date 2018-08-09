import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import * as actionCreators from '../../action-creators'
import Immutable from 'immutable'

import { Form, Input, Rate, Radio, Tooltip, Icon, Select, Button } from 'antd'

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

class Edit extends React.Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.handleIDNameChange = this.handleIDNameChange.bind(this)
    this.handleTrustLevelChange = this.handleTrustLevelChange.bind(this)
    this.handleRentTypeChange = this.handleRentTypeChange.bind(this)
    this.processSubmit = this.processSubmit.bind(this)
    this.setUpClient = this.setUpClient.bind(this)

    this.client = Immutable.Map()
  }

  componentWillMount() {
    this.client_id = this.props.match.params.id

    this.props.cleanForm('edit_client_form')
    this.setUpClient(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (this.client.get('id') === undefined) {
      this.setUpClient(nextProps)
    }
  }

  setUpClient(props) {
    if (props.session_status === 'SIGNED_IN') {
      if (
        props.clients &&
        (props.clients.getIn(['get_client_statuses', this.client_id]) === 'READY' ||
          props.clients.get('get_clients_status') === 'READY')
      ) {
        this.client = props.clients.getIn(['hashed', this.client_id])
      } else if (!props.clients || props.clients.getIn(['get_client_statuses', this.client_id]) !== 'GETTING') {
        this.props.submitRequest('GET_CLIENT', {}, { id: this.client_id })
      }
    }
  }

  handleChange(event) {
    this.props.changeForm(
      'edit_client_form',
      event.target.name,
      event.target.type === 'checkbox' ? event.target.checked : event.target.value
    )
  }

  handleIDNameChange(value) {
    this.props.changeForm('edit_client_form', 'id_name', value)
  }

  handleTrustLevelChange(value) {
    this.props.changeForm('edit_client_form', 'trust_level', value)
  }

  handleRentTypeChange(object) {
    this.props.changeForm('edit_client_form', 'rent_type', object.target.value)
  }

  processSubmit(event) {
    if (event.preventDefault) {
      event.preventDefault()
    }

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = (this.props.edit_client_form || Immutable.Map()).toJS()

        this.props.submitRequest(
          'UPDATE_CLIENT',
          { client: data },
          { id: this.client_id, from: '/clients/' + this.client_id }
        )
      }
    })
  }

  render() {
    let form = this.props.edit_client_form || Immutable.Map()
    const { getFieldDecorator, isFieldsTouched } = this.props.form

    return (
      <Form onSubmit={this.processSubmit}>
        <Form.Item {...tailFormItemLayout}>
          <h2>Editar Cliente</h2>
        </Form.Item>

        <Form.Item {...formItemLayout} label="Nombre" hasFeedback>
          {getFieldDecorator('firstname', {
            rules: [
              {
                required: true,
                message: 'Introduce el o los nombres del cliente',
                whitespace: true
              }
            ],
            initialValue: form.get('firstname') || this.client.get('firstname')
          })(<Input name="firstname" placeholder="Nombre" onChange={this.handleChange} />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Apellido" hasFeedback>
          {getFieldDecorator('lastname', {
            rules: [
              {
                required: true,
                message: 'Introduce el o los apellidos del cliente',
                whitespace: true
              }
            ],
            initialValue: form.get('lastname') || this.client.get('lastname')
          })(<Input name="lastname" placeholder="Apellido" onChange={this.handleChange} />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Calle" hasFeedback>
          {getFieldDecorator('street', {
            rules: [
              {
                required: true,
                message: 'Introduce el nombre de la calle',
                whitespace: true
              }
            ],
            initialValue: form.get('street') || this.client.get('street')
          })(<Input name="street" placeholder="Calle" onChange={this.handleChange} />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Numero exterior" hasFeedback>
          {getFieldDecorator('outer_number', {
            rules: [
              {
                required: true,
                message: 'Introduce el numero exterior del lugar',
                whitespace: true
              }
            ],
            initialValue: form.get('outer_number') || this.client.get('outer_number')
          })(<Input name="outer_number" placeholder="Numero exterior" onChange={this.handleChange} />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Numero interior" hasFeedback>
          {getFieldDecorator('inner_number', {
            initialValue: form.get('inner_number') || this.client.get('inner_number')
          })(<Input name="inner_number" placeholder="Numero interior" onChange={this.handleChange} />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Fraccionamiento" hasFeedback>
          {getFieldDecorator('neighborhood', {
            rules: [
              {
                required: true,
                message: 'Introduce el nombre del fraccionamiento del lugar',
                whitespace: true
              }
            ],
            initialValue: form.get('neighborhood') || this.client.get('neighborhood')
          })(<Input name="neighborhood" placeholder="Fraccionamiento" onChange={this.handleChange} />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Codigo Postal" hasFeedback>
          {getFieldDecorator('postal_code', {
            rules: [
              {
                pattern: /^\d+$/,
                message: 'El codigo postal debe ser un número'
              },
              {
                whitespace: true
              }
            ],
            initialValue: form.get('postal_code') || this.client.get('postal_code')
          })(<Input name="postal_code" placeholder="Codigo Postal" onChange={this.handleChange} />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Teléfono 1" hasFeedback>
          {getFieldDecorator('telephone_1', {
            rules: [
              {
                pattern: /^\+?(\d+|\s)+$/,
                message: 'El teléfono tiene un formato inválido'
              },
              {
                required: true,
                message: 'Introduce al menos un teléfono para el cliente'
              }
            ],
            initialValue: form.get('telephone_1') || this.client.get('telephone_1')
          })(<Input name="telephone_1" placeholder="Teléfono 1" onChange={this.handleChange} />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Teléfono 2" hasFeedback>
          {getFieldDecorator('telephone_2', {
            rules: [
              {
                pattern: /^\+?(\d+|\s)+$/,
                message: 'El teléfono tiene un formato inválido'
              }
            ],
            initialValue: form.get('telephone_2') || this.client.get('telephone_2')
          })(<Input name="telephone_2" placeholder="Teléfono 2" onChange={this.handleChange} />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Email" hasFeedback>
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'El email tiene un formato inválido'
              }
            ],
            initialValue: form.get('email') || this.client.get('email')
          })(<Input name="email" placeholder="Email" onChange={this.handleChange} />)}
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          label={
            <span>
              Identificación&nbsp;
              <Tooltip title="¿Con que documento se identifica el cliente?">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {getFieldDecorator('id_name', {
            initialValue: form.get('id_name') || this.client.get('id_name')
          })(
            <Select name="id_name" onChange={this.handleIDNameChange}>
              <Select.Option value="ine">INE</Select.Option>
              <Select.Option value="licencia">Licencia</Select.Option>
              <Select.Option value="cartilla">Cartilla militar</Select.Option>
              <Select.Option value="pasaporte">Pasaporte</Select.Option>
              <Select.Option value="otra">Otra</Select.Option>
            </Select>
          )}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Nivel de confianza">
          {getFieldDecorator('trust_level', {
            initialValue: form.get('trust_level') || this.client.get('trust_level')
          })(<Rate count={10} onChange={this.handleTrustLevelChange} />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Tipo de cliente">
          {getFieldDecorator('rent_type', {
            initialValue: form.get('rent_type') || this.client.get('rent_type')
          })(
            <Radio.Group onChange={this.handleRentTypeChange}>
              <Radio.Button value="first_rent">Primera renta</Radio.Button>
              <Radio.Button value="frecuent">Frecuente</Radio.Button>
              <Radio.Button value="business">Empresa</Radio.Button>
            </Radio.Group>
          )}
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large" disabled={!isFieldsTouched()}>
            Actializar
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

function mapStateToProps(state) {
  return {
    edit_client_form: state.getIn(['forms', 'edit_client_form']),
    clients: state.get('clients'),
    session_status: state.get('session_status')
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    actionCreators
  )(Form.create()(Edit))
)
