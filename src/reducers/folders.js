import {
  FETCH_FOLDERS_SUCCESS,
  ADD_FOLDER_SUCCESS,
  REMOVE_FOLDER,
} from "../actions"
import {isEqual} from "lodash-es"


export function foldersReducer(state = [], action) {
  switch (action.type) {
    case FETCH_FOLDERS_SUCCESS:
      if (!action.folders) {
        return state
      }
      return action.folders
    case ADD_FOLDER_SUCCESS:
      return state.filter(f=>f.Path!==action.folderPath).concat(action.folder)
    case REMOVE_FOLDER:
      return state.filter(f=>f.Path!==action.folderPath)
  }
  return state
}

function sortState(state) {
  return state.sort((a,b)=>{
    if (a.Path < b.Path) {
      return -1
    }
    if (a.Path > b.Path) {
      return 1
    }

    return 0
  })
}

export function sortedFoldersReducer(state = [], action) {
  const newState = foldersReducer(state, action)
  if (newState === state) {
    return state
  }

  return sortState(newState)
}
