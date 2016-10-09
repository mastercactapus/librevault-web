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
import {addFolder} from './actions'

export class App extends Component {
  constructor() {
    super()
    this.state = {
      showNew: false,
      newPath: "",
      newSecret: ""
    }
  }
  renderNew() {
    if (!this.state.showNew) {
      return null
    }

    return (
      <Card
        className="folder"
        key={this.props.Path}
      >
        <CardHeader
          title="Add New Folder"
        />
        <CardText>
          <TextField
            style={{width: "100%"}}
            value={this.state.newSecret}
            onChange={e=>this.setState({newSecret: e.target.value})}
            floatingLabelText="Secret (optional)"
          />
          <TextField
            style={{width: "100%"}}
            value={this.state.newPath}
            onChange={e=>this.setState({newPath: e.target.value})}
            floatingLabelText="Path"
          />

          <FlatButton
            label="Create"
            disabled={!this.state.newPath}
            onClick={()=>this.props.addNew(this.state.newPath, this.state.newSecret)}
            primary
          />
          <FlatButton
            label="Cancel"
            onClick={() => this.setState({showNew: false, newSecret: "", newPath: ""})}
            secondary
          />

        </CardText>
      </Card>
    )
  }
  render() {
    return (
      <div>
        <AppBar
          title="Librevault"
          iconElementLeft={<IconButton onClick={()=>this.setState({showNew: !this.state.showNew})}><ContentAdd /></IconButton>}
        />
        {this.renderNew()}
        {this.props.folderPaths.map(path=> <ConnectedFolder key={path} Path={path} />)}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    folderPaths: state.folders.map(f=>f.Path)
  }
}
const mapDispatchToProps = dispatch => {
  return {
    addNew: (path, secret) => dispatch(addFolder(path, secret))
  }
}

export const ConnectedApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
