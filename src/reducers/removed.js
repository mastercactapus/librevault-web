import {REFRESH_FOLDERS, REMOVE_FOLDER, ADD_FOLDER} from "../actions"

export function removedReducer(state = [], action) {
  switch (action.type) {
    case REMOVE_FOLDER:
      return state.concat({folderPath: action.folderPath, secret: action.secret})
    case ADD_FOLDER:
      return state.filter(f=>f.folderPath!==action.folderPath)
    case REFRESH_FOLDERS:
      const paths = action.folders.map(f=>f.Path)
      const newState = state.filter(f=>!paths.includes(f.folderPath))
      if (newState.length === state.length) {
        return state
      }
      return newState
  }
  return state
}
