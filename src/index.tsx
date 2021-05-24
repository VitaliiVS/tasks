import 'regenerator-runtime/runtime'
import './scss/style.scss'

import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import { ContextProvider } from './components/TasksContext'

const root = document.querySelector('.root')

ReactDOM.render(
  <ContextProvider>
    <App />
  </ContextProvider>,
  root
)
