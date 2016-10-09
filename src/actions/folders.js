export const FETCH_FOLDERS = "FETCH_FOLDERS"
export const FETCH_FOLDERS_SUCCESS = "FETCH_FOLDERS_SUCCESS"
export const FETCH_FOLDERS_FAILURE = "FETCH_FOLDERS_FAILURE"

export function fetchFolders() {
  return dispatch => {
    dispatch({type: FETCH_FOLDERS, pending: true})
    return fetch("/api/folders")
    .then(resp=>{
      if (!resp.ok) {
        return resp.text()
          .then(message=>{throw new Error(message)})
      }
      return resp.json()
    })
    .then(folders=>dispatch({type: FETCH_FOLDERS_SUCCESS, folders}))
    .catch(error=>dispatch({type: FETCH_FOLDERS_FAILURE, error}))
  }
}

export const ADD_FOLDER = "ADD_FOLDER"
export const ADD_FOLDER_SUCCESS = "ADD_FOLDER_SUCCESS"
export const ADD_FOLDER_FAILURE = "ADD_FOLDER_FAILURE"
export function addFolder(folderPath, secret) {
  return dispatch => {
    dispatch({type: ADD_FOLDER, folderPath, secret})
    return fetch(encodeURI("/api/folders"), {
      method: "POST",
      body: JSON.stringify({
        secret,
        path: folderPath
      })
    })
    .then(resp => {
      if (!resp.ok) {
        return resp.text()
          .then(message=>{throw new Error(message)})
      }
      return resp.json()
    })
    .then(folder=>dispatch({type: ADD_FOLDER_SUCCESS, folderPath, folder}))
    .catch(error=>dispatch({type: ADD_FOLDER_FAILURE, folderPath, error}))
  }
}

export const REMOVE_FOLDER = "REMOVE_FOLDER"
export const REMOVE_FOLDER_SUCCESS = "REMOVE_FOLDER_SUCCESS"
export const REMOVE_FOLDER_FAILURE = "REMOVE_FOLDER_FAILURE"
export function removeFolder(folderPath) {
  return dispatch => {
    dispatch({type: REMOVE_FOLDER, folderPath})
    return fetch(encodeURI("/api/folders/" + encodeURIComponent(folderPath)), {
      method: "DELETE"
    })
    .then(resp=>{
      if (!resp.ok) {
        return resp.text()
          .then(message=>{throw new Error(message)})
      }
      return resp.text()
    })
    .then(secret => dispatch({type: REMOVE_FOLDER_SUCCESS, folderPath, secret}))
    .catch(error => dispatch({type: REMOVE_FOLDER_FAILURE, folderPath, error}))
  }
}
