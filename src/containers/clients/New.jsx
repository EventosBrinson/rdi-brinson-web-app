import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import * as actionCreators from '../../action-creators'
import Immutable from 'immutable'

class New extends React.Component {

  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.processSubmit = this.processSubmit.bind(this)
  }

  handleChange(event) {
    this.props.changeForm('client_form', event.target.name, event.target.value)
  }

  processSubmit(event) {
    if (event.preventDefault) {
      event.preventDefault()
    }

    let data = (this.props.client_form || Immutable.Map()).toJS()

    this.props.submitRequest('CREATE_CLIENT', data)
  }

  render() {
    let form = this.props.client_form || Immutable.Map()

    return (
      <form onSubmit={ this.processSubmit }>
        <h2>
          Nuevo Cliente
        </h2>
        <div>
          <label>Nombres(s)</label>
          <input name='firstname' type='text' value={ form.get('firstname') || '' } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Apellido(s)</label>
          <input name='lastname' type='text' value={ form.get('lastname') || '' } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Dirección Liena 1</label>
          <input name='address_line_1' type='text' value={ form.get('address_line_1') || '' } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Dirección Liena 2</label>
          <input name='address_line_2' type='text' value={ form.get('address_line_2') || '' } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Teléfono 1</label>
          <input name='telephone_1' type='text' value={ form.get('telephone_1') || '' } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Teléfono 2</label>
          <input name='telephone_2' type='text' value={ form.get('telephone_2') || '' } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Identificación</label>
          <select name='id_name' value={ form.get('id_name') || '' } onChange={ this.handleChange }>
            <option value="ine">INE</option>
            <option value="licencia">Licencia</option>
            <option value="cartilla">Cartilla militar</option>
            <option value="pasaporte">Pasaporte</option>
            <option value="otra">Otra</option>
          </select>
        </div>
        <div>
          <label>Nivel de confianza</label>
          <select name='trust_level' value={ form.get('trust_level') || '' } onChange={ this.handleChange }>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>
        <div>
          <button type="submit">Crear</button>
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
