import {combineReducers} from "redux"

import {sortedFoldersReducer as folders} from "./folders"
import {secretsReducer as secrets} from "./secrets"

export default combineReducers({
  folders, secrets
})
