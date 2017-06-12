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
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.session_status === 'SIGNED_IN' && nextProps.get_clients_status === 'READY') {
      let form = nextProps.rent_form || Immutable.Map()

      if(form.get('client_id') === undefined) {
        let clientsOrder = nextProps.clients_order
        let places_order = nextProps.clients.get(this.client_id || clientsOrder.get(0)).get('places_order') || Immutable.List()

        if(clientsOrder.size > 0 && places_order.size > 0) {
          nextProps.mergeForm('rent_form', {
            client_id: this.client_id || clientsOrder.get(0),
            place_id: form.get('place_id') || places_order.get(0)
          })
        }
      }
    }
  }

  handleChange(event) {
    this.props.changeForm('rent_form', event.target.name, event.target.value)
  }

  processSubmit(event) {
    if (event.preventDefault) {
      event.preventDefault()
    }

    let data = (this.props.rent_form || Immutable.Map()).toJS()

    this.props.submitRequest('CREATE_RENT', data)
  }

  render() {
    let form = this.props.rent_form || Immutable.Map()
    let clientsOrder = this.props.clients_order || Immutable.List()
    let clients = this.props.clients || Immutable.Map()
    let selectedClient = clients.get(form.get('client_id') || this.client_id) || Immutable.Map()
    let places_order = selectedClient.get('places_order') || Immutable.List()

    var clientOptions = []

    clientsOrder.forEach( client_id => {
      let client = this.props.clients.get(client_id)

      clientOptions.push(
        <option key={ client_id } value={ client_id }>{ client.get('firstname') + ' ' + client.get('lastname') }</option>
      )
    })

    var placeOptions = []

    places_order.forEach( place_id => {
      let place = this.props.places.get(place_id)

      placeOptions.push(
        <option key={ place_id } value={ place_id }>{ place.get('name') }</option>
      )
    })

    return (
      <form onSubmit={ this.processSubmit }>
        <h2>
          Nueva renta
        </h2>
        <div>
          <label>Fecha de entrega</label>
          <input name='delivery_time' type='text' value={ form.get('delivery_time') || '' } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Fecha de recolección</label>
          <input name='pick_up_time' type='text' value={ form.get('pick_up_time') || '' } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Producto rentad</label>
          <input name='product' type='text' value={ form.get('product') || '' } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Precio</label>
          <input name='price' type='text' value={ form.get('price') || '' } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Descuento</label>
          <input name='discount' type='text' value={ form.get('discount') || '' } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Cargo adicional</label>
          <input name='additional_charges' type='text' value={ form.get('additional_charges') || '' } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Tipo de cargo adicional</label>
          <input name='additional_charges_notes' type='text' value={ form.get('additional_charges_notes') || '' } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Cliente</label>
          <select name='client_id' value={ form.get('client_id') || this.client_id || '' } onChange={ this.handleChange }>
            { clientOptions }
          </select>
        </div>
        <div>
          <label>Lugar</label>
          <select name='place_id' value={ form.get('place_id') || '' } onChange={ this.handleChange }>
            { placeOptions }
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
    rent_form: state.getIn(['forms', 'rent_form']),
    clients: state.getIn(['clients', 'hashed']),
    places: state.getIn(['places', 'hashed']),
    clients_order: state.getIn(['clients', 'order']),
    session_status: state.get('session_status'),
    get_clients_status: state.getIn(['clients', 'get_clients_status'])
  }
}

export default withRouter(connect(mapStateToProps, actionCreators)(New))
