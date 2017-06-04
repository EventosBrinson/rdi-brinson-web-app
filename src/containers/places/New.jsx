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
          <label>Dirección Liena 1</label>
          <input name='address_line_1' type='text' value={ form.get('address_line_1') || '' } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Dirección Liena 2</label>
          <input name='address_line_2' type='text' value={ form.get('address_line_2') || '' } onChange={ this.handleChange } />
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
