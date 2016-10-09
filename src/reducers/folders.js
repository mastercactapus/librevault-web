import {REFRESH_FOLDERS, ADD_FOLDER, REMOVE_FOLDER} from "../actions"
import {isEqual, cloneDeep} from "lodash-es"

export function foldersReducer(state = [], action) {
  switch (action.type) {
    case REFRESH_FOLDERS:
      if (!action.folders || isEqual(state, action.folders)) {
        return state
      }
      return action.folders
    case ADD_FOLDER:
      return state.concat(action.folder)
    case REMOVE_FOLDER:
      return state.filter(f=>f.Path!==action.folderPath)
  }
  return state
}
