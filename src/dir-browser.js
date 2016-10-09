import React, {Component} from "react"
import {List, ListItem} from 'material-ui/List';
import Paper from 'material-ui/Paper';

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
const cleanPath = path => path.replace(/^\/*/, "/").replace(/\/+$/,"").replace(/\/\//g, "/")

export class DirBrowser extends Component {
  constructor(props) {
    super()
    this.state = {}
    this.data = new DirData()
    this.refresh(props.path)
  }
  componentWillReceiveProps(nextProps) {
    if (cleanPath(nextProps.path) !== cleanPath(this.props.path)) {
      this.refresh(cleanPath(nextProps.path))
    }
  }
  refresh(path) {
    if (!path) {
      path = "/"
    }
    return this.data.get(path)
    .then(items=>this.setState({["dir_" + cleanPath(path)]: items}))
    .catch(error=>this.setState({["dir_" + cleanPath(path)]: error}))
  }

  getItems() {
    return this.state["dir_" + cleanPath(this.props.path)]
  }
  render() {
    const items = this.getItems()
    if (!items) {
      return (
        <div>
          Fetching...
        </div>
      )
    }

    if (items instanceof Error) {
      switch (items.code) {
        case 404:
        return <div>Not Found</div>
        case 403:
        return <div>Permission denied</div>
        default:
        return <div>{items.message}</div>
      }
    }

    return (
      <Paper>
        <List style={{columnCount: 4}}>
          {items.map(name=>(
              <ListItem
                key={name}
                style={{columnSpan: 0}}
                onClick={()=>this.props.onChange(this.props.path + "/" + name)}
                primaryText={"/" + name}
              />
          ))}
        </List>
      </Paper>
    )
  }
}
