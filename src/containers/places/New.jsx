import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import * as actionCreators from '../../action-creators'
import Immutable from 'immutable'
import queryString from 'query-string'

class New extends React.Component {

  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.processSubmit = this.processSubmit.bind(this)
  }

  componentWillMount() {
    let params = queryString.parse(this.props.location.search)
    this.client_id = params.client_id

    if(this.props.get_clients_status !== 'READY') {
      this.props.submitRequest('GET_CLIENTS')
    }

    this.setDefaults(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.setDefaults(nextProps)
  }

  setDefaults(props) {
    if(props.session_status === 'SIGNED_IN' && props.get_clients_status === 'READY') {
      let form = props.place_form || Immutable.Map()

      if(form.get('client_id') === undefined) {
        let clientsOrder = props.clients_order || Immutable.List()

        if(clientsOrder.size > 0) {
          props.mergeForm('place_form', {
            client_id: form.get('client_id') || this.client_id || clientsOrder.get(0)
          })
        }
      }
    }
  }

  handleChange(event) {
    this.props.changeForm('place_form', event.target.name, event.target.value)
  }

  processSubmit(event) {
    if (event.preventDefault) {
      event.preventDefault()
    }

    let data = (this.props.place_form || Immutable.Map()).toJS()

    this.props.submitRequest('CREATE_PLACE', data)
  }

  render() {
    let form = this.props.place_form || Immutable.Map()
    let clientsOrder = this.props.clients_order || Immutable.List()

    var clientOptions = []

    clientsOrder.forEach( client_id => {
      let client = this.props.clients.get(client_id)

      clientOptions.push(
        <option key={ client_id } value={ client_id }>{ client.get('firstname') + ' ' + client.get('lastname') }</option>
      )
    })


    return (
      <form onSubmit={ this.processSubmit }>
        <h2>
          Nuevo Lugar
        </h2>
        <div>
          <label>Nombre</label>
          <input name='name' type='text' value={ form.get('name') || '' } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Calle</label>
          <input name='street' type='text' value={ form.get('street') || '' } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Numero interior</label>
          <input name='inner_number' type='text' value={ form.get('inner_number') || '' } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Numero exterior</label>
          <input name='outer_number' type='text' value={ form.get('outer_number') || '' } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Fraccionamiento</label>
          <input name='neighborhood' type='text' value={ form.get('neighborhood') || '' } onChange={ this.handleChange } />
        </div>
        <div>
          <label>CP</label>
          <input name='postal_code' type='text' value={ form.get('postal_code') || '' } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Cliente</label>
          <select name='client_id' value={ form.get('client_id') || this.client_id || '' } onChange={ this.handleChange }>
            { clientOptions }
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
    place_form: state.getIn(['forms', 'place_form']),
    clients: state.getIn(['clients', 'hashed']),
    clients_order: state.getIn(['clients', 'order']),
    session_status: state.get('session_status'),
    get_clients_status: state.getIn(['clients', 'get_clients_status'])
  }
}

export default withRouter(connect(mapStateToProps, actionCreators)(New))
