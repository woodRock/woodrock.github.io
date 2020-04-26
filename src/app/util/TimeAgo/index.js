import React from 'react'
import ReactTimeAgo from 'react-time-ago'

// Setup for the ReactTimeAgo package
import JavascriptTimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
JavascriptTimeAgo.locale(en)

export default function TimeAgo({ date }) {
  return (
    <div>
      <ReactTimeAgo date={date} timeStyle="time"/>
    </div>
  )
}
