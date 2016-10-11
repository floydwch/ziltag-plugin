import React from 'react'

require('./index.css')


class Ziltag extends React.Component {
  render() {
    const {
      style, onClick, onMouseEnter, onMouseLeave
    } = this.props

    return <div
      className='ziltag-ziltag'
      style={style}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    ></div>
  }
}

export default Ziltag
