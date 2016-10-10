import React, {Component} from "react"
import {List, ListItem} from 'material-ui/List';
import Paper from 'material-ui/Paper';
import AutoComplete from 'material-ui/AutoComplete';

class DirData {
  constructor() {
    this._fetching = {}
  }

  get(path) {
    const clean = cleanPath(path)
    if (this._fetching[clean]) {
      return this._fetching[clean]
    }

    return this._fetching[clean] = fetch("/api/browse" + path)
    .then(resp=>{
      if (!resp.ok) {
        return resp.text().then(message=>{
          const err = new Error(message)
          err.code = resp.status
          throw err
        })
      }
      return resp.json()
    })
    .then(items=>{
      this._fetching[clean] = null
      return items
    })
  }
}
const cleanPath = path => path.replace(/\/\//g, "/").replace(/^\/?/, "/").replace(/\/$/,"")
const cleanParent = path => cleanPath(path.replace(/[^/]+$/, "")) || "/"

export class DirBrowser extends Component {
  constructor(props) {
    super()
    this.state = {showAC: undefined}
    this.data = new DirData()
    this.refresh(cleanParent(props.path))
  }
  componentWillReceiveProps(nextProps) {
    if (cleanParent(nextProps.path) !== cleanParent(this.props.path)) {
      this.refresh(cleanParent(nextProps.path))
    }
  }
  refresh(path) {
    if (!path) {
      path = "/"
    }
    return this.data.get(path)
    .then(items=>this.setState({["dir_" + path]: items}))
    .catch(error=>this.setState({["dir_" + path]: error}))
  }

  getItems() {
    return this.state["dir_" + cleanParent(this.props.path)]
  }
  render() {
    const items = this.getItems()

    let errorText
    let dataSource = []


    if (items instanceof Error) {
      switch (items.code) {
        case 404:
          errorText = "not found"
          break
        case 403:
          errorText = "permission denied"
          break
        default:
          errorText = items.message
          break
      }
    } else if (items) {
      dataSource = items.sort().map(item => cleanParent(this.props.path).replace(/\/*$/, "/") + item)
    }

    return (
      <AutoComplete
        open={this.state.showAC}
        dataSource={dataSource}
        errorText={errorText}
        fullWidth
        searchText={this.props.path}
        onUpdateInput={text=>{
          this.props.onChange(text)
          this.setState({showAC: undefined})
        }}
        ref={el=>this._acRef = el}
        onNewRequest={(text,index)=>{
          if (index===-1) {
            this.setState({showAC: undefined})

            return
          }
          this.props.onChange(text + "/")

          if (this._acRef) {
            this._acRef.focus()
            this.setState({showAC: true})
          }
        }}
        floatingLabelText="Path"
        filter={AutoComplete.fuzzyFilter}
        maxSearchResults={20}
        animated={false}
        openOnFocus
      />
    )

  }
}
