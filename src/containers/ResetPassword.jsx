import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import * as actionCreators from '../action-creators'
import Immutable from 'immutable'
import queryString from 'query-string'

import { Form, Input, Icon, Button } from 'antd'

class ResetPassword extends React.Component {

  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.processSubmit = this.processSubmit.bind(this)
  }

  handleChange(event) {
    this.props.changeForm('reset_password_form', event.target.name, event.target.value)
  }

  processSubmit(event) {
    if (event.preventDefault) {
      event.preventDefault()
    }

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = (this.props.reset_password_form || Immutable.Map()).toJS()
        let params = queryString.parse(this.props.location.search)

        data.token = params.token

        this.props.submitRequest('RESET_PASSWORD', data)
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form

    return (
      <div style={ { position: 'absolute', maxWidth: '300px', maxHeight: '177px', top: 0, bottom: 0, left: 0, right: 0, margin: 'auto' } }>
        <h1 style={ { textAlign: 'center', marginTop: '-36px', marginBottom: '15px' } }>
          Nueva contraseña
        </h1>
        <Form onSubmit={ this.processSubmit } style={ { maxWidth: '300px' } }>
          <Form.Item style={ { marginBottom: '10px' } }>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Introduce tu nueva contraseña' },
                      { min: 8, message: 'La contraseña debe tener al menos 8 caracteres' }],
            })(
              <Input name="password" prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Nueva contraseña" onChange={ this.handleChange } />
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={ { width: '100%' } }>
              Establecer contraseña
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    reset_password_form: state.getIn(['forms', 'reset_password_form']),
    session_status: state.get('session_status')
  }
}

export default withRouter(connect(mapStateToProps, actionCreators)(Form.create()(ResetPassword)))
