import {
  FETCH_FOLDERS_SUCCESS,
  ADD_FOLDER_SUCCESS,
  REMOVE_FOLDER,
  REMOVE_FOLDER_SUCCESS,
  REMOVE_FOLDER_FAILURE
} from "../actions"

export function removedReducer(state = [], action) {
  switch (action.type) {
    case REMOVE_FOLDER:
      return state.concat({
        folderPath: action.folderPath,
        secret: action.secret,
        pending: true
      })
    case REMOVE_FOLDER_FAILURE:
      return state.filter(f=>f.folderPath!==action.folderPath).concat({
        folderPath: action.folderPath,
        secret: action.secret,
        error: action.error
      })
    case REMOVE_FOLDER_SUCCESS:
      return state.filter(f=>f.folderPath!==action.folderPath).concat({
        folderPath: action.folderPath,
        secret: action.secret
      })
    case ADD_FOLDER_SUCCESS:
      return state.filter(f=>f.folderPath!==action.folderPath)
    case FETCH_FOLDERS_SUCCESS:
      const paths = action.folders.map(f=>f.Path)
      const newState = state.filter(f=>!paths.includes(f.folderPath))
      if (newState.length === state.length) {
        return state
      }
      return newState
  }
  return state
}
