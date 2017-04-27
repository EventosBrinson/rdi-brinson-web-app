
import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import ScrollToTop from './ScrollToTop'

export default class App extends React.Component {
  render() {
    return (
      <Router>
        <ScrollToTop>
          <div>RDI Brinson</div>
        </ScrollToTop>
      </Router>
    )
  }
}
