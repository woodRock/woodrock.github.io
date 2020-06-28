import React from 'react'
import ReactTimeAgo from 'react-time-ago'

// Setup for the ReactTimeAgo package
import JavascriptTimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
JavascriptTimeAgo.locale(en)

export default function TimeAgo({date}) {
  return (<span>
    <ReactTimeAgo date={date} timeStyle="Twitter"/>
  </span>)
}
