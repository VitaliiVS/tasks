import 'regenerator-runtime/runtime'

import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import { ContextProvider } from './components/Context/Context'

const root = document.querySelector('.root')

ReactDOM.render(
  <ContextProvider>
    <App />
  </ContextProvider>,
  root
)
