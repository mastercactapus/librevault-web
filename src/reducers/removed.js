import {
  FETCH_FOLDERS_SUCCESS,
  ADD_FOLDER_SUCCESS,
  REMOVE_FOLDER,
  REMOVE_FOLDER_SUCCESS,
  REMOVE_FOLDER_FAILURE,
  REMOVE_FOLDER_ACCEPT
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
    case REMOVE_FOLDER_ACCEPT:
    case ADD_FOLDER_SUCCESS:
      return state.filter(f=>f.folderPath!==action.folderPath)
  }
  return state
}
