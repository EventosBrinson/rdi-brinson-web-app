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
        this.props.submitRequest('GET_PLACE', { id: this.place_id })
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

    let data = (this.props.edit_place_form || Immutable.Map()).toJS()

    this.props.submitRequest('UPDATE_PLACE', { id: this.place_id, client: data })
  }

  render() {
    let form = this.props.edit_place_form || Immutable.Map()

    return (
      <form onSubmit={ this.processSubmit }>
        <h2>
          Ediar Lugar
        </h2>
        <div>
          <label>Nombre</label>
          <input name='name' type='text' value={ formHelpers.priorityValues([form.get('name'), this.place.get('name')]) } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Dirección Liena 1</label>
          <input name='address_line_1' type='text' value={ formHelpers.priorityValues([form.get('address_line_1'), this.place.get('address_line_1')]) } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Dirección Liena 2</label>
          <input name='address_line_2' type='text' value={ formHelpers.priorityValues([form.get('address_line_2'), this.place.get('address_line_2'), '']) } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Acitivo</label>
          <input name='active' type='checkbox' checked={ formHelpers.priorityValues([form.get('active'), this.place.get('active')]) } onChange={ this.handleChange } />
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
    edit_place_form: state.getIn(['forms', 'edit_place_form']),
    places: state.get('places'),
    session_status: state.get('session_status')
  }
}

export default withRouter(connect(mapStateToProps, actionCreators)(Edit))
