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
import {showAddNew} from "./actions"

export class App extends Component {
  renderNew() {
    if (!this.props.showNew) {
      return null
    }

    return (
      <ConnectedAddNew />
    )
  }
  render() {
    return (
      <div>
        <AppBar
          title="Librevault"
          iconElementLeft={<IconButton onClick={this.props.showAddNew}><ContentAdd /></IconButton>}
        />
        {this.renderNew()}
        {this.props.folderPaths.map(path=> <ConnectedFolder key={path} Path={path} />)}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    // exclude pending removals
    folderPaths: state.folders.map(f=>f.Path).filter(path=>!state.removed.some(r=>r.folderPath===path&&r.pending)),
    showNew: state.adding.show
  }
}
const mapDispatchToProps = dispatch => {
  return {
    showAddNew: () => dispatch(showAddNew())
  }
}

export const ConnectedApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
