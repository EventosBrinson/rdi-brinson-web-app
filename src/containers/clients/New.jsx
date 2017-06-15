import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import * as actionCreators from '../../action-creators'
import Immutable from 'immutable'

import { Input, Select, Button } from 'antd';

class New extends React.Component {

  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.handleIDNameChange = this.handleIDNameChange.bind(this)
    this.handleTrustLevelChange = this.handleTrustLevelChange.bind(this)
    this.handleRentTypeChange = this.handleRentTypeChange.bind(this)
    this.processSubmit = this.processSubmit.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.session_status === 'SIGNED_IN') {
      let form = nextProps.client_form || Immutable.Map()

      if(form.get('id_name') === undefined || form.get('trust_level') === undefined || form.get('rent_type') === undefined) {
        nextProps.mergeForm('client_form', {
          id_name: form.get('id_name') || 'ine',
          trust_level: form.get('trust_level') || '1',
          rent_type: form.get('rent_type') || 'first_rent'
        })
      }
    }
  }

  handleChange(event) {
    this.props.changeForm('client_form', event.target.name, event.target.value)
  }

  handleIDNameChange(value) {
    this.props.changeForm('client_form', 'id_name', value)
  }

  handleTrustLevelChange(value) {
    this.props.changeForm('client_form', 'trust_level', value)
  }

  handleRentTypeChange(value) {
    this.props.changeForm('client_form', 'rent_type', value)
  }

  processSubmit(event) {
    if (event.preventDefault) {
      event.preventDefault()
    }

    let data = (this.props.client_form || Immutable.Map()).toJS()

    this.props.submitRequest('CREATE_CLIENT', data)
  }

  formComplete(form) {
    var required = ['firstname',
      'lastname',
      'street',
      'outer_number',
      'neighborhood',
      'postal_code',
      'telephone_1',
      'email']

    for(var i = 0; i < required.length; i++) {
      let value = form.get(required[i])

      if(value === undefined || value === '') return false
    }

    return true
  }

  render() {
    let form = this.props.client_form || Immutable.Map()

    return (
      <form className="ant-form ant-form-horizontal" onSubmit={ this.processSubmit }>
        <h2>
          Nuevo Cliente
        </h2>
        <div className="ant-row ant-form-item">
          <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
            <label className="ant-form-item-required">Nombres(s)</label>
          </div>
          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-14">
            <Input name='firstname' placeholder="Nombres(s)" value={ form.get('firstname') || '' } onChange={ this.handleChange }/>
          </div>
        </div>
        <div className="ant-row ant-form-item">
          <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
            <label className="ant-form-item-required">Apellido(s)</label>
          </div>
          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-14">
            <Input name='lastname' placeholder="Apellido(s)" value={ form.get('lastname') || '' } onChange={ this.handleChange } />
          </div>
        </div>
        <div className="ant-row ant-form-item">
          <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
            <label className="ant-form-item-required">Calle</label>
          </div>
          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-14">
            <Input name='street' placeholder="Calle" value={ form.get('street') || '' } onChange={ this.handleChange } />
          </div>
        </div>
        <div className="ant-row ant-form-item">
          <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
            <label className="ant-form-item-required">Numero exterior</label>
          </div>
          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-14">
            <Input name='outer_number' placeholder="Numero exterior" value={ form.get('outer_number') || '' } onChange={ this.handleChange } />
          </div>
        </div>
        <div className="ant-row ant-form-item">
          <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
            <label>Numero interior</label>
          </div>
          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-14">
            <Input name='inner_number' placeholder="Numero interior" value={ form.get('inner_number') || '' } onChange={ this.handleChange } />
          </div>
        </div>
        <div className="ant-row ant-form-item">
          <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
            <label className="ant-form-item-required">Fraccionamiento</label>
          </div>
          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-14">
            <Input name='neighborhood' placeholder="Fraccionamiento" value={ form.get('neighborhood') || '' } onChange={ this.handleChange } />
          </div>
        </div>
        <div className="ant-row ant-form-item">
          <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
            <label className="ant-form-item-required">CP</label>
          </div>
          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-14">
            <Input name='postal_code' placeholder="CP" value={ form.get('postal_code') || '' } onChange={ this.handleChange } />
          </div>
        </div>
        <div className="ant-row ant-form-item">
          <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
            <label className="ant-form-item-required">Teléfono 1</label>
          </div>
          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-14">
            <Input name='telephone_1' placeholder="Teléfono 1" value={ form.get('telephone_1') || '' } onChange={ this.handleChange } />
          </div>
        </div>
        <div className="ant-row ant-form-item">
          <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
            <label>Teléfono 2</label>
          </div>
          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-14">
            <Input name='telephone_2' placeholder="Teléfono 2" value={ form.get('telephone_2') || '' } onChange={ this.handleChange } />
          </div>
        </div>
        <div className="ant-row ant-form-item">
          <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
            <label className="ant-form-item-required">Email</label>
          </div>
          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-14">
            <Input name='email' placeholder="Email" value={ form.get('email') || '' } onChange={ this.handleChange } />
          </div>
        </div>
        <div className="ant-row ant-form-item">
          <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
            <label>Identificación</label>
          </div>
          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-14">
            <Select name='id_name' value={ form.get('id_name') || '' } onChange={ this.handleIDNameChange }>
              <Select.Option value="ine">INE</Select.Option>
              <Select.Option value="licencia">Licencia</Select.Option>
              <Select.Option value="cartilla">Cartilla militar</Select.Option>
              <Select.Option value="pasaporte">Pasaporte</Select.Option>
              <Select.Option value="otra">Otra</Select.Option>
            </Select>
          </div>
        </div>
        <div className="ant-row ant-form-item">
          <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
            <label>Nivel de confianza</label>
          </div>
          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-14">
            <Select name='trust_level' value={ form.get('trust_level') || '' } onChange={ this.handleTrustLevelChange }>
              <Select.Option value="1">1</Select.Option>
              <Select.Option value="2">2</Select.Option>
              <Select.Option value="3">3</Select.Option>
              <Select.Option value="4">4</Select.Option>
              <Select.Option value="5">5</Select.Option>
              <Select.Option value="6">6</Select.Option>
              <Select.Option value="7">7</Select.Option>
              <Select.Option value="8">8</Select.Option>
              <Select.Option value="9">9</Select.Option>
              <Select.Option value="10">10</Select.Option>
            </Select>
          </div>
        </div>
        <div className="ant-row ant-form-item">
          <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
            <label>Tipo de cliente</label>
          </div>
          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-14">
            <Select name='rent_type' value={ form.get('rent_type') || '' } onChange={ this.handleRentTypeChange }>
              <Select.Option value="first_rent">Primera renta</Select.Option>
              <Select.Option value="frecuent">Frecuente</Select.Option>
              <Select.Option value="business">Empresa</Select.Option>
            </Select>
          </div>
        </div>
        <div className="ant-row ant-form-item">
          <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
          </div>
          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-14">
            <button type="submit" className="ant-btn ant-btn-submit" disabled={ !this.formComplete(form) }>
              <span>Crear</span>
            </button>
          </div>
        </div>
      </form>
    )
  }
}

function mapStateToProps(state) {
  return {
    client_form: state.getIn(['forms', 'client_form']),
    session_status: state.get('session_status')
  }
}

export default withRouter(connect(mapStateToProps, actionCreators)(New))
