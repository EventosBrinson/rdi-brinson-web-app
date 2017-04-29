import React from 'react'

export default class SignOutButton extends React.Component {

  constructor(props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(event) {
    if(event.preventDefault) {
      event.preventDefault()
    }

    if(this.props.requestFunction) {
      this.props.requestFunction('SIGN_OUT')
    }
  }

  render() {
    return (
      <button onClick={ this.handleClick }>
        { this.props.children }
      </button>
    )
  }
}
