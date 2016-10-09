import {combineReducers} from "redux"

import {sortedFoldersReducer as folders} from "./folders"
import {secretsReducer as secrets} from "./secrets"
import {addingReducer as adding} from "./adding"
import {removedReducer as removed} from "./removed"
import {daemonReducer as daemon} from "./daemon"

export default combineReducers({
  folders, secrets, adding, removed, daemon
})
