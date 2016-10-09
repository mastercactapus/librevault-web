import React, {Component} from "react"
import {connect} from "react-redux"
import {hideAddNew, addFolder} from "./actions"

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import IconButton from 'material-ui/IconButton';
import CircularProgress from 'material-ui/CircularProgress';
import {DirBrowser} from './dir-browser'

import NavigationExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import NavigationExpandLess from 'material-ui/svg-icons/navigation/expand-less';

export class AddNew extends Component {
  constructor() {
    super()
    this.state = {
      path: "/",
      secret: "",
      showBrowser: false
    }
  }
  setPath(path) {
    this.setState({
      path: path.replace(/^\/*/, "/").replace(/\/\//g, "/")
    })
  }
  setSecret(secret) {
    if (!/^([ACD](1[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]*)?)?$/.test(secret)) {
      return
    }
    this.setState({
      secret: secret.trim()
    })
  }
  render() {
    const errorMessage = this.props.error ? this.props.error.message : ""
    let actions
    if (this.props.pending) {
      actions = (
        <CircularProgress />
      )
    } else {
      actions = (
        <div>
          <p style={{color: '#EF5350'}}>{errorMessage}</p>
          <FlatButton
            label="Create"
            disabled={!/^\/.+/.test(this.state.path)}
            onClick={()=>this.props.addNew(this.state.path, this.state.secret)}
            primary
          />
          <FlatButton
            label="Cancel"
            onClick={this.props.hide}
            secondary
          />
        </div>
      )
    }
    let browser
    if (this.state.showBrowser) {
      browser = (
        <DirBrowser path={this.state.path} onChange={path=>this.setPath(path)} />
      )
    }
    return (
      <Card
        className="folder"
      >
        <CardHeader
          title="Add New Folder"
        />
        <CardText>
          <TextField
            style={{width: "100%"}}
            value={this.state.secret}
            onChange={e=>this.setSecret(e.target.value)}
            floatingLabelText="Secret (optional)"
          />
          <div>
            <TextField
              style={{width: "calc(100% - 48px)"}}
              value={this.state.path}
              onChange={e=>this.setPath(e.target.value)}
              floatingLabelText="Path"
            />
            <IconButton tooltip="Directory browser" onClick={()=>this.setState({showBrowser: !this.state.showBrowser})}>
              {this.state.showBrowser ? <NavigationExpandLess /> : <NavigationExpandMore />}
            </IconButton>
          </div>

          {browser}
          {actions}

        </CardText>
      </Card>
    )
  }
}

const mapStateToProps = state => {
  return {
    pending: state.adding.pending,
    error: state.adding.error
  }
}
const mapDispatchToProps = dispatch => {
  return {
    addNew: (path, secret) => dispatch(addFolder(path, secret)),
    hide: () => dispatch(hideAddNew())
  }
}

export const ConnectedAddNew = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddNew)
