import React, {Component} from "react"
import AppBar from "material-ui/AppBar"
import {connect} from "react-redux"
import {ConnectedFolder} from './folder'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import IconButton from 'material-ui/IconButton';
import {ConnectedAddNew} from "./add-new"
import {showAddNew, addFolder} from "./actions"
import Snackbar from 'material-ui/Snackbar';

export class App extends Component {
  renderNew() {
    if (!this.props.showNew) {
      return null
    }

    return (
      <ConnectedAddNew />
    )
  }
  renderNotConnected() {
    if (this.props.daemonError) {
      return (
        <center>
          <h1 style={{color: '#EF5350'}}>Cannot connect to librevault-daemon</h1>
          <h2 style={{color: '#EF5350'}}>{this.props.daemonError.message}</h2>
        </center>
      )
    }
    return (
      <center>
        <h1>Connecting to librevault-daemon...</h1>
      </center>
    )
  }
  renderSnackbar() {
    if (!this.props.lastRemoval) {
      return null
    }
    const {folderPath, secret} = this.props.lastRemoval
    return (
      <Snackbar
        open={true}
        message={"Removed: " + folderPath}
        action="undo"
        autoHideDuration={3000}
        onActionTouchTap={()=>this.props.addFolder(folderPath, secret)}
      />
    )
  }
  render() {
    if (!this.props.connected) {
      return this.renderNotConnected()
    }
    return (
      <div>
        <AppBar
          title="Librevault"
          iconElementLeft={<IconButton onClick={this.props.showAddNew}><ContentAdd /></IconButton>}
        />
        {this.renderNew()}
        {this.props.folderPaths.map(path=> <ConnectedFolder key={path} Path={path} />)}
        {this.renderSnackbar()}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    // exclude pending removals
    folderPaths: state.folders.map(f=>f.Path).filter(path=>!state.removed.some(r=>r.folderPath===path&&r.pending)),
    showNew: state.adding.show,
    daemonError: state.daemon.error,
    connected: state.daemon.connected,
    lastRemoval: state.removed.slice().reverse().find(r=>!r.error&&!r.pending)
  }
}
const mapDispatchToProps = dispatch => {
  return {
    showAddNew: () => dispatch(showAddNew()),
    addFolder: (path, secret) => dispatch(addFolder(path, secret))
  }
}

export const ConnectedApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
