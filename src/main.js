import React from "react"
import ReactDOM from "react-dom"
import injectTapEventPlugin from 'react-tap-event-plugin';
import {ConnectedApp} from "./app"
import {Provider} from "react-redux"
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import reducer from "./reducers"
import {refreshFolders} from "./actions"
import thunk from "redux-thunk"
import { createStore, applyMiddleware, compose } from 'redux';

import "./styles.css";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(
      thunk
    )
  )
);

setInterval(()=>store.dispatch(refreshFolders()), 5000)
store.dispatch(refreshFolders())

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();


ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider>
      <ConnectedApp />
    </MuiThemeProvider>
  </Provider>
  , document.getElementById("app"))
