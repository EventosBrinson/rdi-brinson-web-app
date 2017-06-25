import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import * as actionCreators from '../../action-creators'
import * as formHelpers from '../../modules/form-helpers'
import Immutable from 'immutable'

import { Form, Input, Rate, Radio, Tooltip, Icon, Select, Button } from 'antd'

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
    this.processSubmit = this.processSubmit.bind(this)
    this.setUpPlace = this.setUpPlace.bind(this)

    this.place = Immutable.Map()
  }

  componentWillMount() {
    this.place_id = this.props.match.params.id

    this.props.cleanForm('edit_place_form')
    this.setUpPlace(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if(this.place.get('id') === undefined) {
      this.setUpPlace(nextProps)
    }
  }

  setUpPlace(props) {
    if(props.session_status === 'SIGNED_IN') {
      if(props.places && (props.places.getIn(['get_place_statuses', this.place_id]) === 'READY' || props.places.get('get_places_status') === 'READY')) {
        this.place = props.places.getIn(['hashed', this.place_id])
      } else if(!props.places || props.places.getIn(['get_place_statuses', this.place_id]) !== 'GETTING'){
        this.props.submitRequest('GET_PLACE', {}, { id: this.place_id })
      }
    }
  }

  handleChange(event) {
    this.props.changeForm('edit_place_form', event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value)
  }

  processSubmit(event) {
    if (event.preventDefault) {
      event.preventDefault()
    }

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = (this.props.edit_place_form || Immutable.Map()).toJS()

        this.props.submitRequest('UPDATE_PLACE', { place: data }, { id: this.place_id })
      }
    })
  }

  render() {
    let form = this.props.edit_place_form || Immutable.Map()
    const { getFieldDecorator, isFieldsTouched } = this.props.form

    return (
      <Form onSubmit={ this.processSubmit }>
        <Form.Item {...tailFormItemLayout}>
          <h2>
            Editar lugar
          </h2>
        </Form.Item>

        <Form.Item {...formItemLayout} label="Nombre" hasFeedback>
          { getFieldDecorator('name', {
            rules: [{
              required: true, message: 'Introduce un nombre para el lugar',
              whitespace: true
            }],
            initialValue: form.get('name') || this.place.get('name')
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
            initialValue: form.get('street') || this.place.get('street')
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
            initialValue: form.get('outer_number') || this.place.get('outer_number')
          })(
            <Input name='outer_number' placeholder="Numero exterior" onChange={ this.handleChange } />
          )}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Numero interior" hasFeedback>
          { getFieldDecorator('inner_number', {
            initialValue: form.get('inner_number') || this.place.get('inner_number')
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
            initialValue: form.get('neighborhood') || this.place.get('neighborhood')
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
            initialValue: form.get('postal_code') || this.place.get('postal_code')
          })(
            <Input name='postal_code' placeholder="Codigo Postal" onChange={ this.handleChange } />
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
    edit_place_form: state.getIn(['forms', 'edit_place_form']),
    places: state.get('places'),
    session_status: state.get('session_status')
  }
}

export default withRouter(connect(mapStateToProps, actionCreators)(Form.create()(Edit)))
