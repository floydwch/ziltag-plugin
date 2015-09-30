import React from 'react';

require('./index.css');


class ZiltagPreview extends React.Component {
  render() {
    const { direction, content, usr } = this.props;

    if (direction == 'right') {
      var arrow_class = 'ziltag-ziltag-preview__left-arrow';
      var preview_class = 'ziltag-ziltag-preview--right';
    } else if (direction == 'left') {
      var arrow_class = 'ziltag-ziltag-preview__right-arrow';
      var preview_class = 'ziltag-ziltag-preview--left';
    }

    return  <div className={preview_class}>
      <div className='ziltag-ziltag-preview__board'>
        <div className='ziltag-ziltag-preview__board__content'>{content}</div>
        <div className='ziltag-ziltag-preview__board__publisher'>by {usr}</div>
      </div>
      <div className={arrow_class}></div>
    </div>;
  }
}

export default ZiltagPreview;
