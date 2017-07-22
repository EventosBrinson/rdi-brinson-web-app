import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import * as actionCreators from '../../action-creators'
import Immutable from 'immutable'
import ReactFileReader from 'react-file-reader'
import * as enumsHelpers from '../../modules/enums-helpers'
import { API_URL } from '../../web-api'
import PlaceList from '../../components/places/PlaceList'
import copy from 'copy-to-clipboard';
import RentList from '../../components/rents/RentList'

import { Icon, Button, Row, Col, Popconfirm, Tabs } from 'antd'

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
        this.props.submitRequest('GET_CLIENT', {}, { id: this.client_id })
        this.props.submitRequest('GET_RENTS', { client_id: this.client_id }, { id: this.client_id })
      }
    }
  }

  handleFiles(files) {
    let data = { title: files.fileList[0].name, client_id: this.client_id, filename: files.fileList[0].name, data: files.base64 }

    this.props.submitRequest('CREATE_DOCUMENT', { document: data })
  }

  copyFolio(folio, event) {
    if (event.preventDefault) {
      event.preventDefault()
    }

    copy(folio)
  }

  deleteDocument(document, event) {
    if (event.preventDefault) {
      event.preventDefault()
    }

    this.props.submitRequest('DELETE_DOCUMENT', {}, { id: document.get('id'), client_id: this.client_id })
  }

  render() {
    let client = this.client
    let documents_order = this.client.get('documents_order') || Immutable.List()
    let places_order = this.client.get('places_order') || Immutable.List()

    var rendered_documents = []

    documents_order.forEach(document_id => {
      let document = this.props.documents.get(document_id)

      rendered_documents.push(
        <div key={ document.get('id') } className="ant-card ant-card-bordered">
          <div className="ant-card-body" style={{ padding: '5px 5px 5px 5px' }}>
            <Popconfirm title="¿Seguro que decea eliminar este documento?" onConfirm={ this.deleteDocument.bind(this, document) } okText="Sí" cancelText="No">
              <Button type="danger" shape="circle" icon="delete" style={{ float: 'right', marginBottom: '5px' }}></Button>
            </Popconfirm>
            <a href={ API_URL + '/documents/' + document.get('id') } target="blank" style={{ float: 'left', marginTop: '6px' }} >{ document.get('filename') }</a>
          </div>
        </div>
      )
    })

    var optionalTelephone = undefined

    if(client.get('telephone_2')) {
      optionalTelephone = (
        <tr>
          <td>
            <Icon type="phone" />
          </td>
          <td>
            { client.get('telephone_2') }
          </td>
        </tr>
      )
    }

    return (
      <div>
        <Row>
          <table>
            <tbody>
              <tr>
                <td>
                  <h2>
                    { client.get('firstname') + ' ' + client.get('lastname') }
                  </h2>
                  <h3>
                    Cliente: { enumsHelpers.rentType(client.get('rent_type'))  }
                  </h3>
                  <h3>
                    N° de cliente: { client.get('folio') }
                    <a style={{ fontSize: 10 }} onClick={ this.copyFolio.bind(this, client.get('folio')) }>Copiar</a>
                  </h3>
                </td>
                <td style={{ width: '1%', whiteSpace: 'nowrap' }}>
                  <span style={{ fontSize: 20 }}>
                    <Icon type="star" style={{ color: '#F5A623' }}/>
                    { client.get('trust_level') } / 10
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </Row>
        <Row>
          <Col xs={24} sm={12} style={{ marginTop: '20px' }}>
            <h4>
              Información general
            </h4>
            <table>
              <tbody>
                <tr>
                  <td>
                    <Icon type="credit-card" />
                  </td>
                  <td>
                    { enumsHelpers.idName(client.get('id_name')) }
                  </td>
                </tr>
                <tr>
                  <td>
                    <Icon type="environment-o" />
                  </td>
                  <td>
                    { client.get('street') } #{ client.get('outer_number') }{ client.get('inner_number') ? (' Int. ' + client.get('inner_number')) : '' }, { client.get('neighborhood') } CP { client.get('postal_code') }
                  </td>
                </tr>
                <tr>
                  <td>
                    <Icon type="phone" />
                  </td>
                  <td>
                    { client.get('telephone_1') }
                  </td>
                </tr>
                { optionalTelephone }
                <tr>
                  <td>
                    <Icon type="mail" />
                  </td>
                  <td>
                    { client.get('email') || '---' }
                  </td>
                </tr>
              </tbody>
            </table>
          </Col>
          <Col xs={24} sm={12} style={{ marginTop: '20px' }}>
            <h4>
              Documentos
            </h4>
            { rendered_documents }
            <ReactFileReader handleFiles={ this.handleFiles } base64={ true } multipleFiles={ false } fileTypes="file_extension|image/jpeg|application/pdf">
              <Button style={{ marginTop: '10px' }}>
                <Icon type="upload" /> Agregar archivo
              </Button>
            </ReactFileReader>
          </Col>
        </Row>
        <Row>
          <Col style={{ marginTop: '20px' }}>
            <table>
              <tbody>
                <tr>
                  <td>
                    <h3>
                      Lugares de entrega
                    </h3>
                  </td>
                  <td style={{ width: '1%', whiteSpace: 'nowrap' } }>
                    <Button type="primary">
                      <Link to={ '/places/new?client_id=' + this.client_id }>
                        Crear nuevo
                      </Link>
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
            <Tabs>
              <Tabs.TabPane tab="Activos" key="1">
                <PlaceList active={ true } 
                            order={ places_order }
                            hashed={ this.props.places || Immutable.Map() }
                            submitRequest={ this.props.submitRequest }/>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Inactivos" key="2">
                <PlaceList active={ false } 
                            order={ places_order }
                            hashed={ this.props.places || Immutable.Map()}
                            submitRequest={ this.props.submitRequest }/>
              </Tabs.TabPane>
            </Tabs>
          </Col>
        </Row>
        <Row>
          <Col style={{ marginTop: '20px' }}>
            <table>
              <tbody>
                <tr>
                  <td>
                    <h3>
                      Rentas
                    </h3>
                  </td>
                  <td style={{ width: '1%', whiteSpace: 'nowrap' } }>
                    <Button type="primary">
                      <Link to={ '/rents/new?client_id=' + this.client_id }>
                        Rentar
                      </Link>
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
            <Tabs>
              <Tabs.TabPane tab="Todas" key="1">
                <RentList order={ this.props.rents_order || Immutable.List() }
                          hashed={ this.props.hashed_rents || Immutable.Map() }
                          submitRequest={ this.props.submitRequest }/>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Reservadas" key="2">
                <RentList status="reserved" order={ this.props.rents_order || Immutable.List() }
                          hashed={ this.props.hashed_rents || Immutable.Map() }
                          submitRequest={ this.props.submitRequest }/>
              </Tabs.TabPane>
              <Tabs.TabPane tab="En ruta" key="3">
                <RentList status="on_route" order={ this.props.rents_order || Immutable.List() }
                          hashed={ this.props.hashed_rents || Immutable.Map() }
                          submitRequest={ this.props.submitRequest }/>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Entregadas" key="4">
                <RentList status="delivered" order={ this.props.rents_order || Immutable.List() }
                          hashed={ this.props.hashed_rents || Immutable.Map() }
                          submitRequest={ this.props.submitRequest }/>
              </Tabs.TabPane>
              <Tabs.TabPane tab="En recolección" key="5">
                <RentList status="on_pick_up" order={ this.props.rents_order || Immutable.List() }
                          hashed={ this.props.hashed_rents || Immutable.Map() }
                          submitRequest={ this.props.submitRequest }/>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Pendientes" key="6">
                <RentList status="pending" order={ this.props.rents_order || Immutable.List() }
                          hashed={ this.props.hashed_rents || Immutable.Map() }
                          submitRequest={ this.props.submitRequest }/>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Finalizadas" key="7">
                <RentList status="finalized" order={ this.props.rents_order || Immutable.List() }
                          hashed={ this.props.hashed_rents || Immutable.Map() }
                          submitRequest={ this.props.submitRequest }/>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Canceladas" key="8">
                <RentList status="canceled" order={ this.props.rents_order || Immutable.List() }
                          hashed={ this.props.hashed_rents || Immutable.Map() }
                          submitRequest={ this.props.submitRequest }/>
              </Tabs.TabPane>
            </Tabs>
          </Col>
        </Row>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    clients: state.get('clients'),
    documents: state.getIn(['documents', 'hashed']),
    places: state.getIn(['places', 'hashed']),
    session_status: state.get('session_status'),
    rents: state.get('rents') || Immutable.Map(),
    hashed_rents: state.getIn(['rents', 'hashed']),
    rents_order: state.getIn(['rents', 'order']),
  }
}

export default withRouter(connect(mapStateToProps, actionCreators)(Show))
