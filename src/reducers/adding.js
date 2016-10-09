import {
  SHOW_ADD_NEW,
  HIDE_ADD_NEW,
  ADD_FOLDER,
  ADD_FOLDER_SUCCESS,
  ADD_FOLDER_FAILURE
} from "../actions"

export function addingReducer(state = {show: false, pending: false, error: null}, action) {
  switch (action.type) {
    case ADD_FOLDER:
      return {...state, pending: true}
    case ADD_FOLDER_SUCCESS:
      return {...state, show: false, pending: false, error: null}
    case ADD_FOLDER_FAILURE:
      return {...state, pending: false, error: action.error}
    case SHOW_ADD_NEW:
      return {...state, show: true}
    case HIDE_ADD_NEW:
      if (state.pending) {
        return state
      }
      return {...state, show: false, error: null}
  }

  return state
}
