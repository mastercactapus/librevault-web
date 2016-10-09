
import {
  FETCH_FOLDERS_SUCCESS,
  FETCH_FOLDERS_FAILURE
} from "../actions"

export function daemonReducer(state={connected: false}, action) {
  switch (action.type) {
    case FETCH_FOLDERS_SUCCESS:
      return {...state, connected: true, error: null}
    case FETCH_FOLDERS_FAILURE:
      return {...state, connected: false, error: action.error}
  }

  return state
}
