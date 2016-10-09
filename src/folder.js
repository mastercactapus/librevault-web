import React, {Component, PropTypes as p} from "react"
import {connect} from "react-redux"

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FileFileUpload from 'material-ui/svg-icons/file/file-upload';
import FileFileDownload from 'material-ui/svg-icons/file/file-download';
import TextField from 'material-ui/TextField';
import Avatar from 'material-ui/Avatar';
import ActionLock from 'material-ui/svg-icons/action/lock';
import ActionLockOpen from 'material-ui/svg-icons/action/lock-open';
import ActionLockOutline from 'material-ui/svg-icons/action/lock-outline';
import FlatButton from 'material-ui/FlatButton';


import {fetchSecrets, removeFolder} from './actions'
import {plural, byteLabel} from './util'
import {TypeOwner, TypeRead, TypeDownload} from './types'

export class Folder extends Component {
  avatarIcon() {
    switch (this.props.Type) {
      case TypeOwner:
        return <ActionLockOpen />
      case TypeRead:
        return <ActionLockOutline />
      case TypeDownload:
        return <ActionLock />
    }
  }
  render() {
    const subtitle = (
      <span className="summary">
        <span className="counts">
          {`${plural(this.props.Files, "file")}, ${plural(this.props.Peers, "peer")}`}
        </span>
        <span className="bandwidth">
          <FileFileDownload color="gray" />
          {byteLabel(this.props.DownBandwidth)}
        </span>
        <span className="bandwidth">
          <FileFileUpload color="gray" />
          {byteLabel(this.props.UpBandwidth)}
        </span>
      </span>
    )
    return (
      <Card
        className="folder"
        key={this.props.Path}
        onExpandChange={exp=>exp&&this.props.fetchSecrets()}
      >
        <CardHeader
          title={this.props.Path}
          subtitle={subtitle}
          avatar={<Avatar icon={this.avatarIcon()} />}
          actAsExpander
          showExpandableButton
        />
        <CardText expandable={true}>
          <TextField
            style={{width: "100%"}}
            readOnly
            value={this.props.OwnerSecret || ""}
            floatingLabelText="Owner (read/write)"
            onFocus={e=>{
              e.target.selectionStart = 0
              e.target.selectionEnd = e.target.value.length
            }}
          />
          <TextField
            style={{width: "100%"}}
            readOnly
            value={this.props.ReadSecret || ""}
            floatingLabelText="Read-Only"
            onFocus={e=>{
              e.target.selectionStart = 0
              e.target.selectionEnd = e.target.value.length
            }}
          />
          <TextField
            style={{width: "100%"}}
            readOnly
            value={this.props.DownloadSecret || ""}
            floatingLabelText="Download (encrypted data only)"
            onFocus={e=>{
              e.target.selectionStart = 0
              e.target.selectionEnd = e.target.value.length
            }}
          />

          <FlatButton
            label="Remove Folder"
            backgroundColor="#EF9A9A"
            hoverColor="#F44336"
            onClick={this.props.remove}
          />
        </CardText>
      </Card>
    )
  }
}

const mapStateToProps = (state, props) => {
  const folder = state.folders.find(f=>f.Path === props.Path)
  return {
    ...folder,
    ...state.secrets[props.Path]||{}
  }
}
const mapDispatchToProps = (dispatch, props) => {
  return {
    fetchSecrets: () => dispatch(fetchSecrets(props.Path)),
    remove: () => dispatch(removeFolder(props.Path))
  }
}

export const ConnectedFolder = connect(
  mapStateToProps,
  mapDispatchToProps
)(Folder)
ConnectedFolder.propTypes = {
  Path: p.string.isRequired
}
