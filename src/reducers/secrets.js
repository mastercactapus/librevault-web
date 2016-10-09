import {FETCH_SECRETS} from "../actions"

export function secretsReducer(state = {}, action) {
  switch (action.type) {
    case FETCH_SECRETS:
      return {
        ...state,
        [action.folderPath]: action.secrets
      }
  }
  return state
}
