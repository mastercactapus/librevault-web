import {REMOVE_FOLDER, ADD_FOLDER} from "../actions"

export function removedReducer(state = [], action) {
  switch (action.type) {
    case REMOVE_FOLDER:
      return state.concat({folderPath: action.folderPath, secret: action.secret})
    case ADD_FOLDER:
      return state.filter(f=>f.folderPath!==action.folderPath)
  }
  return state
}
