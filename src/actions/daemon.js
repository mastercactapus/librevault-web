export const REFRESH_FOLDERS = "REFRESH_FOLDERS"

export function refreshFolders() {
  return dispatch => {
    return fetch("/api/folders")
    .then(resp=>{
      if (!resp.ok) throw new Error(resp.statusText)
      return resp.json()
    })
    .then(folders=>dispatch({type: REFRESH_FOLDERS, folders}))
  }
}

export const ADD_FOLDER = "ADD_FOLDER"
export function addFolder(folderPath, secret) {
  return dispatch => {
    return fetch(encodeURI("/api/folders"), {
      method: "POST",
      body: JSON.stringify({
        secret,
        path: folderPath
      })
    })
    .then(resp => {
      if (!resp.ok) throw new Error(resp.statusText)
      return resp.json()
    })
    .then(folder=>{
      dispatch({type: ADD_FOLDER, folderPath, folder})
    })
  }
}

export const REMOVE_FOLDER = "REMOVE_FOLDER"
export function removeFolder(folderPath) {
  return dispatch => {
    return fetch(encodeURI("/api/folders/" + encodeURIComponent(folderPath)), {
      method: "DELETE"
    })
    .then(resp=>{
      if (!resp.ok) throw new Error(resp.statusText)
      return resp.text()
    })
    .then(secret => {
      dispatch({type: REMOVE_FOLDER, folderPath, secret})
    })
  }
}

export const FETCH_SECRETS = "FETCH_SECRETS"
export function fetchSecrets(folderPath) {
  return dispatch => {
    return fetch(encodeURI("/api/folders/" + encodeURIComponent(folderPath) + "/secrets"))
    .then(resp=>{
      if (!resp.ok) throw new Error(resp.statusText)
      return resp.json()
    })
    .then(secrets=>dispatch({type: FETCH_SECRETS, folderPath, secrets}))
  }
}
