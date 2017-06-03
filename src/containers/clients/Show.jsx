import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import * as actionCreators from '../../action-creators'
import Immutable from 'immutable'
import ReactFileReader from 'react-file-reader';

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
    let documents = this.client.get('documents') || Immutable.List()

    var rendered_documents = []

    documents.forEach(document => {
      rendered_documents.push(
        <div key={ document.get('id') }>
          <a href={ 'http://localhost:3000/documents/' + document.get('id') } target="blank" >{ document.get('filename') }</a>
          <button onClick={ this.deleteDocument.bind(this, document) }>Eliminar</button>
        </div>
      )
    })

    return (
      <div>
        <h3>{ client.get('firstname') + ' ' + client.get('lastname') } <small>{ client.get('trust_level') }</small></h3>
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
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    clients: state.get('clients'),
    session_status: state.get('session_status')
  }
}

export default withRouter(connect(mapStateToProps, actionCreators)(Show))
