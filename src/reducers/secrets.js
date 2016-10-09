import {FETCH_SECRETS_SUCCESS} from "../actions"

export function secretsReducer(state = {}, action) {
  switch (action.type) {
    case FETCH_SECRETS_SUCCESS:
      return {
        ...state,
        [action.folderPath]: action.secrets
      }
  }
  return state
}
