import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import * as actionCreators from '../../action-creators'
import * as formHelpers from '../../modules/form-helpers'
import Immutable from 'immutable'

class Edit extends React.Component {

  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
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
    if(this.client.get('id') === undefined) {
      this.setUpClient(nextProps)
    }
  }

  setUpClient(props) {
    if(props.session_status === 'SIGNED_IN') {
      if(props.clients && (props.clients.getIn(['get_client_statuses', this.client_id]) === 'READY' || props.clients.get('get_clients_status') === 'READY')) {
        this.client = props.clients.getIn(['hashed', this.client_id])
      } else if(!props.clients || props.clients.getIn(['get_client_statuses', this.client_id]) !== 'GETTING'){
        this.props.submitRequest('GET_CLIENT', { id: this.client_id })
      }
    }
  }

  handleChange(event) {
    this.props.changeForm('edit_client_form', event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value)
  }

  processSubmit(event) {
    if (event.preventDefault) {
      event.preventDefault()
    }

    let data = (this.props.edit_client_form || Immutable.Map()).toJS()

    this.props.submitRequest('UPDATE_CLIENT', { id: this.client_id, client: data })
  }

  render() {
    let form = this.props.edit_client_form || Immutable.Map()


    return (
      <form onSubmit={ this.processSubmit }>
        <h2>
          Ediar Cliente
        </h2>
        <div>
          <label>Nombres(s)</label>
          <input name='firstname' type='text' value={ formHelpers.priorityValues([form.get('firstname'), this.client.get('firstname')]) } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Apellido(s)</label>
          <input name='lastname' type='text' value={ formHelpers.priorityValues([form.get('lastname'), this.client.get('lastname')]) } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Calle</label>
          <input name='street' type='text' value={ formHelpers.priorityValues([form.get('street'), this.client.get('street')]) } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Numero interior</label>
          <input name='inner_number' type='text' value={ formHelpers.priorityValues([form.get('inner_number'), this.client.get('inner_number')]) } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Numero exterior</label>
          <input name='outer_number' type='text' value={ formHelpers.priorityValues([form.get('outer_number'), this.client.get('outer_number')]) } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Fraccionamiento</label>
          <input name='neighborhood' type='text' value={ formHelpers.priorityValues([form.get('neighborhood'), this.client.get('neighborhood')]) } onChange={ this.handleChange } />
        </div>
        <div>
          <label>CP</label>
          <input name='postal_code' type='text' value={ formHelpers.priorityValues([form.get('postal_code'), this.client.get('postal_code')]) } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Teléfono 1</label>
          <input name='telephone_1' type='text' value={ formHelpers.priorityValues([form.get('telephone_1'), this.client.get('telephone_1')]) } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Teléfono 2</label>
          <input name='telephone_2' type='text' value={ formHelpers.priorityValues([form.get('telephone_2'), this.client.get('telephone_2'), '']) } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Email</label>
          <input name='email' type='text' value={ formHelpers.priorityValues([form.get('email'), this.client.get('email'), '']) } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Identificación</label>
          <select name='id_name' value={ formHelpers.priorityValues([form.get('id_name'), this.client.get('id_name')]) } onChange={ this.handleChange }>
            <option value="ine">INE</option>
            <option value="licencia">Licencia</option>
            <option value="cartilla">Cartilla militar</option>
            <option value="pasaporte">Pasaporte</option>
            <option value="otra">Otra</option>
          </select>
        </div>
        <div>
          <label>Nivel de confianza</label>
          <select name='trust_level' value={ formHelpers.priorityValues([form.get('trust_level'), this.client.get('trust_level')]) } onChange={ this.handleChange }>
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
          <label>Tipo de cliente</label>
          <select name='rent_type' value={ formHelpers.priorityValues([form.get('rent_type'), this.client.get('rent_type')]) } onChange={ this.handleChange }>
            <option value="first_rent">Primera renta</option>
            <option value="frecuent">Frecuente</option>
            <option value="business">Empresa</option>
          </select>
        </div>
        <div>
          <label>Acitivo</label>
          <input name='active' type='checkbox' checked={ formHelpers.priorityValues([form.get('active'), this.client.get('active')]) } onChange={ this.handleChange } />
        </div>
        <div>
          <button type="submit">Actializar</button>
        </div>
      </form>
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

export default withRouter(connect(mapStateToProps, actionCreators)(Edit))
