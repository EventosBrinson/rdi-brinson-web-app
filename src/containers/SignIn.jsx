import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import * as actionCreators from '../action-creators'
import Immutable from 'immutable'

import { Form, Input, Rate, Radio, Tooltip, Icon, Select, Button, Checkbox } from 'antd'

class SignIn extends React.Component {

  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.processSubmit = this.processSubmit.bind(this)
  }

  handleChange(event) {
    this.props.changeForm('sign_in_form', event.target.name, event.target.value)
  }

  processSubmit(event) {
    if (event.preventDefault) {
      event.preventDefault()
    }

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = (this.props.sign_in_form || Immutable.Map()).toJS()

        this.props.submitRequest('SIGN_IN', data)
      }
    })
  }

  render() {
    let form = this.props.sign_in_form || Immutable.Map()
    const { getFieldDecorator, isFieldsTouched } = this.props.form

    return (
      <div style={ { position: 'absolute', maxWidth: '300px', maxHeight: '177px', top: 0, bottom: 0, left: 0, right: 0, margin: 'auto' } }>
        <h1 style={ { textAlign: 'center', fontSize: 55, marginTop: '-88px' } }>
          Brinson
        </h1>
        <Form onSubmit={this.processSubmit} style={ { maxWidth: '300px' } }>
          <Form.Item>
            {getFieldDecorator('credential', {
              rules: [{ required: true, message: 'Introduce tu nombre de usuario o correo' }],
            })(
              <Input name="credential" prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Nombre de usuario ó Email" onChange={ this.handleChange }/>
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Introduce tu contraseña' }],
            })(
              <Input name="password" prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Contraseña" onChange={ this.handleChange } />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Checkbox name="remember">Recordarme</Checkbox>
            )}
            <a href="" style={ { float: 'right' } }>Olvidé mi contraseña</a>
            <Button type="primary" htmlType="submit" style={ { width: '100%' } }>
              Iniciar seción
            </Button>
          </Form.Item>
        </Form>
      </div>
    )

    return (
      <form onSubmit={ this.processSubmit }>
        <h2>
          Sign In
        </h2>
        <div>
          <label>Email/Username</label>
          <input name='credential' type='text' value={ form.get('credential') || '' } onChange={ this.handleChange } />
        </div>
        <div>
          <label>Password</label>
          <input name='password' type='password' value={ form.get('password') || '' } onChange={ this.handleChange }/>
        </div>
        <div>
          <Link to='/recover'>Forgot your password?</Link>
        </div>
        <div>
          <button type="submit">Sign In</button>
        </div>
      </form>
    )
  }
}

function mapStateToProps(state) {
  return {
    sign_in_form: state.getIn(['forms', 'sign_in_form'])
  }
}

export default withRouter(connect(mapStateToProps, actionCreators)(Form.create()(SignIn)))
