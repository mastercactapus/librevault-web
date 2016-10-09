
export const FETCH_SECRETS = "FETCH_SECRETS"
export const FETCH_SECRETS_SUCCESS = "FETCH_SECRETS_SUCCESS"
export const FETCH_SECRETS_FAILURE = "FETCH_SECRETS_FAILURE"
export function fetchSecrets(folderPath) {
  return dispatch => {
    dispatch({type: FETCH_SECRETS, folderPath})
    return fetch(encodeURI("/api/folders/" + encodeURIComponent(folderPath) + "/secrets"))
    .then(resp=>{
      if (!resp.ok) {
        return resp.text()
          .then(message=>{throw new Error(message)})
      }
      return resp.json()
    })
    .then(secrets=>dispatch({type: FETCH_SECRETS_SUCCESS, folderPath, secrets}))
    .catch(error=>dispatch({type: FETCH_SECRETS_FAILURE, folderPath, error}))
  }
}
