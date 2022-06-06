/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as React from 'react'
import * as ReactDOM from 'react-dom'

import 'emptykit.css'
import '../../../../../ui/webui/resources/fonts/muli.css'
import '../../../../../ui/webui/resources/fonts/poppins.css'

import { App } from '../../rewards_panel/components/app'
import { createHost } from '../../rewards_panel/lib/extension_host'

function getPanelArgs () {
  const { hash } = location
  location.hash = ''

  if (hash.match(/^#?tour$/i)) {
    return 'rewards-tour'
  }

  const adaptiveCaptchaMatch = hash.match(/^#?load_adaptive_captcha$/i)
  if (adaptiveCaptchaMatch) {
    return 'adaptive-captcha'
  }

  const grantMatch = hash.match(/^#?grant_([\s\S]+)$/i)
  if (grantMatch) {
    return 'claim-grant=' + grantMatch[1]
  }

  return ''
}

function onDocumentReady () {
  const rewardsPanelArgs = getPanelArgs()

  const loadTimeData = {
    getString(key: string) {
      if (key === 'rewardsPanelArgs') {
        return rewardsPanelArgs
      }

      // In order to normalize messages across extensions and WebUI, replace all
      // chrome.i18n message placeholders with $N marker patterns. UI components
      // are responsible for replacing these markers with appropriate text or
      // using the markers to build HTML.
      return chrome.i18n.getMessage(key,
        ['$1', '$2', '$3', '$4', '$5', '$6', '$7', '$8', '$9'])
    }
  }

  Object.defineProperty(window, 'loadTimeData', {
    value: loadTimeData,
    configurable: true
  })

  ReactDOM.render(
    <App host={createHost(false)} />,
    document.getElementById('root'))
}

if (document.readyState === 'complete') {
  onDocumentReady()
} else {
  document.addEventListener('DOMContentLoaded', onDocumentReady)
}
