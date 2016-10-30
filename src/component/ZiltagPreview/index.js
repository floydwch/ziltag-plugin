import React from 'react'

require('./index.css')


function ellipsize(text) {
  const max_len = 140
  const result = text.slice(0, max_len)
  return result.length < max_len ? result : `${result}...`
}

export const meta_class_name = 'ziltag-ziltag-preview'

export default ({content, author}) => (
  <div className={meta_class_name}>
    <div className='ziltag-ziltag-preview__author'>
      {author}
    </div>
    <div className='ziltag-ziltag-preview__content'>
      {ellipsize(content)}
    </div>
  </div>
)
