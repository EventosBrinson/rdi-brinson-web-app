import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import * as actionCreators from '../../action-creators'
import Immutable from 'immutable'
import ReactFileReader from 'react-file-reader'

class Show extends React.Component {

  constructor(props) {
    super(props)

    this.handleFiles = this.handleFiles.bind(this)

    this.setUpClient = this.setUpClient.bind(this)
    this.client = Immutable.Map()
  }

  componentWillMount() {
    this.client_id = this.props.match.params.id
    this.setUpClient(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if(this.client.get('id') === undefined) {
      this.setUpClient(nextProps)
    } else {
      this.client = nextProps.clients.getIn(['hashed', this.client_id])
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

  handleFiles(files) {
    let data = { title: files.fileList[0].name, client_id: this.client_id, filename: files.fileList[0].name, data: files.base64 }

    this.props.submitRequest('CREATE_DOCUMENT', data)
  }

  deleteDocument(document, event) {
    if (event.preventDefault) {
      event.preventDefault()
    }

    this.props.submitRequest('DELETE_DOCUMENT', document.toJS())
  }

  render() {
    let client = this.client
    let documents_order = this.client.get('documents_order') || Immutable.List()
    let places_order = this.client.get('places_order') || Immutable.List()

    var rendered_documents = []

    documents_order.forEach(document_id => {
      let document = this.props.documents.get(document_id)

      rendered_documents.push(
        <div key={ document.get('id') }>
          <a href={ 'http://localhost:3000/documents/' + document.get('id') } target="blank" >{ document.get('filename') }</a>
          <button onClick={ this.deleteDocument.bind(this, document) }>Eliminar</button>
        </div>
      )
    })

    var rendered_places = []

    places_order.forEach( place_id => {
      let place = this.props.places.get(place_id)

      rendered_places.push(
        <tr key={ place.get('id') }>
          <td>{ place.get('name') }</td>
          <td>{ place.get('street') }</td>
          <td>{ place.get('inner_number') }</td>
          <td>{ place.get('outer_number') }</td>
          <td>{ place.get('neighborhood') }</td>
          <td>{ place.get('postal_code') }</td>
          <td>{ place.get('active') ? 'Si' : 'No' }</td>
          <td><Link to={ '/places/' + place.get('id') + '/edit'}>Edit</Link></td>
        </tr>
      )
    })

    return (
      <div>
        <h3>{ client.get('firstname') + ' ' + client.get('lastname') } <small>{ client.get('rent_type') + ' ' + client.get('trust_level') }</small></h3>
        <p>{ client.get('id_name') }</p>
        <p>{ client.get('address_line_1') } { client.get('address_line_2')  }</p>
        <p>{ client.get('telephone_1') } { client.get('telephone_1')  }</p>
        <Link to={'/clients/' + client.get('id') + '/edit'}>Editar</Link>
        <h3> Documentos </h3>
        { rendered_documents }
        <h4>Subir archivo</h4>
        <ReactFileReader handleFiles={ this.handleFiles } base64={ true } multipleFiles={ false } fileTypes="file_extension|image/jpeg|application/pdf">
          <button className='btn'>Seleccionar</button>
        </ReactFileReader>
        <h3> Lugares </h3>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Calle</th>
              <th>Numero interior</th>
              <th>Numero exterior</th>
              <th>Fraccionamiento</th>
              <th>CP</th>
              <th>Activo</th>
              <th />
            </tr>
          </thead>
          <tbody>
            { rendered_places }
          </tbody>
        </table>
        <br />
        <Link to={ '/places/new?client_id=' + this.client_id }>Crear nuevo lugar</Link>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    clients: state.get('clients'),
    documents: state.getIn(['documents', 'hashed']),
    places: state.getIn(['places', 'hashed']),
    session_status: state.get('session_status')
  }
}

export default withRouter(connect(mapStateToProps, actionCreators)(Show))
