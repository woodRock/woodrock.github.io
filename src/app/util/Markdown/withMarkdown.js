import React, { Component } from 'react'
import ReactMarkdown from 'react-markdown'

const withMarkdown = markdown => {
  class withMarkdown extends Component {
    constructor(props) {
      super(props)
      this.state = { terms: null }
    }

    componentWillMount() {
      fetch(markdown).then((response) => response.text()).then((text) => {
        this.setState({ terms: text })
      })
    }

    render() {
      return (
        <div className="content">
          <ReactMarkdown source={this.state.terms} />
        </div>
      )
    }
  }
  return withMarkdown;
}

export default withMarkdown;
