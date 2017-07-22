import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import * as actionCreators from '../action-creators'
import Immutable from 'immutable'

import { Form, Input, Icon, Button } from 'antd'

class RecoverPassword extends React.Component {

  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.processSubmit = this.processSubmit.bind(this)
  }

  handleChange(event) {
    this.props.changeForm('recover_password_form', event.target.name, event.target.value)
  }

  processSubmit(event) {
    if (event.preventDefault) {
      event.preventDefault()
    }

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = (this.props.recover_password_form || Immutable.Map()).toJS()

        this.props.submitRequest('REQUEST_RESET_PASSWORD', data)
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form

    return (
      <div style={{ position: 'absolute', maxWidth: '300px', maxHeight: '177px', top: 0, bottom: 0, left: 0, right: 0, margin: 'auto' }}>
        <h1 style={{ textAlign: 'center', marginTop: '-36px', marginBottom: '15px' }}>
          Recuperar contraseña
        </h1>
        <Form onSubmit={ this.processSubmit } style={{ maxWidth: '300px' }}>
          <Form.Item style={{ marginBottom: '10px' }}>
            {getFieldDecorator('credential', {
              rules: [{ required: true, message: 'Introduce tu nombre de usuario o correo electronico' }],
            })(
              <Input name="credential" prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Nombre de usuario ó Email" onChange={ this.handleChange }/>
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Enviar instrucciones
            </Button>
            <Link to="/sign_in">Iniciar seción</Link>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    recover_password_form: state.getIn(['forms', 'recover_password_form']),
    session_status: state.get('session_status')
  }
}

export default withRouter(connect(mapStateToProps, actionCreators)(Form.create()(RecoverPassword)))
