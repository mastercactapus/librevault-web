import {combineReducers} from "redux"

import {sortedFoldersReducer as folders} from "./folders"
import {secretsReducer as secrets} from "./secrets"
import {addingReducer as adding} from "./adding"
import {removedReducer as removed} from "./removed"

export default combineReducers({
  folders, secrets, adding, removed
})
