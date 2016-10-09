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


export class AddNew extends Component {
  constructor() {
    super()
    this.state = {
      path: "",
      secret: ""
    }
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
            onChange={e=>this.setState({secret: e.target.value})}
            floatingLabelText="Secret (optional)"
          />
          <TextField
            style={{width: "100%"}}
            value={this.state.path}
            onChange={e=>this.setState({path: e.target.value})}
            floatingLabelText="Path"
          />

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
