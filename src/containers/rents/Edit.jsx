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
    this.setUpRent = this.setUpRent.bind(this)

    this.rent = Immutable.Map()
  }

  componentWillMount() {
    this.rent_id = this.props.match.params.id

    this.props.cleanForm('edit_rent_form')
    this.setUpRent(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if(this.rent.get('id') === undefined) {
      this.setUpRent(nextProps)
    }
  }

  setUpRent(props) {
    if(props.session_status === 'SIGNED_IN') {
      if(props.rents && (props.rents.getIn(['get_rent_statuses', this.rent_id]) === 'READY' || props.rents.get('get_rents_status') === 'READY')) {
        this.rent = props.rents.getIn(['hashed', this.rent_id])
      } else if(!props.rents || props.rents.getIn(['get_rent_statuses', this.rent_id]) !== 'GETTING'){
        this.props.submitRequest('GET_RENT', { id: this.rent_id })
      }
    }
  }

  handleChange(event) {
    this.props.changeForm('edit_rent_form', event.target.name, event.target.value)
  }

  processSubmit(event) {
    if (event.preventDefault) {
      event.preventDefault()
    }

    let data = (this.props.edit_rent_form || Immutable.Map()).toJS()

    this.props.submitRequest('UPDATE_RENT', { id: this.rent_id, rent: data })
  }

  render() {
    let form = this.props.edit_rent_form || Immutable.Map()

    return (
      <form onSubmit={ this.processSubmit }>
        <h2>
          Ediar Lugar
        </h2>
        <div>
          <label>Fecha de entrega</label>
          <input name='delivery_time' type='text' value={ formHelpers.priorityValues([form.get('delivery_time'), this.rent.get('delivery_time')]) } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Fecha de recolección</label>
          <input name='pick_up_time' type='text' value={ formHelpers.priorityValues([form.get('pick_up_time'), this.rent.get('pick_up_time')]) } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Producto rentado</label>
          <input name='product' type='text' value={ formHelpers.priorityValues([form.get('product'), this.rent.get('product')]) } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Precio</label>
          <input name='price' type='text' value={ formHelpers.priorityValues([form.get('price'), this.rent.get('price')]) } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Descuento</label>
          <input name='discount' type='text' value={ formHelpers.priorityValues([form.get('discount'), this.rent.get('discount')]) } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Cargo adicional</label>
          <input name='additional_charges' type='text' value={ formHelpers.priorityValues([form.get('additional_charges'), this.rent.get('additional_charges')]) } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Tipo de cargo adicional</label>
          <input name='additional_charges_notes' type='text' value={ formHelpers.priorityValues([form.get('additional_charges_notes'), this.rent.get('additional_charges_notes')]) } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Estado</label>
          <select name='status' value={ formHelpers.priorityValues([form.get('status'), this.rent.get('status')]) } onChange={ this.handleChange }>
            <option value="reserved">Reservado</option>
            <option value="on_route">En ruta</option>
            <option value="delivered">Entregado</option>
            <option value="on_pick_up">En recolección</option>
            <option value="pending">Pendiente de recolección</option>
            <option value="finalized">Finalizado</option>
          </select>
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
    edit_rent_form: state.getIn(['forms', 'edit_rent_form']),
    rents: state.get('rents'),
    session_status: state.get('session_status')
  }
}

export default withRouter(connect(mapStateToProps, actionCreators)(Edit))
