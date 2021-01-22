import ConnectyCube from 'react-native-connectycube'

export function preparationUploadImg(file) {
  console.log("File: ", file)
  const str = file.path.split('/')
  const name = str[str.length - 1]
  return {
    caption: '',
    duration: null,
    height: file.height,
    name,
    path: file.path,
    size: file.size,
    type: file.mime,
    width: file.width,
    uri: `file://${file.path}`
  }
}

export function preparationAttachment(file, uid) {
  const str = file.path.split('/')
  const name = str[str.length - 1]
  return {
    height: file.height,
    name,
    uid: uid ? uid : file.path,
    url: file.path,
    size: file.size,
    type: file.mime,
    width: file.width,
  }
}

export function preparationUploadVoiceMessage(file) {
  console.log("File: ", file)
  const str = file.path.split('/')
  const name = str[str.length - 1]
  return {
    name,
    path: file.path,
    size: file.size,
    type: "audio/aac",
    uri: `file://${file.path}`,
  }
}

export function preparationVoiceAttachment(file) {
  const str = file.path.split('/')
  const name = str[str.length - 1]
  const uidStr = name.split('.')
  const uid = uidStr[0]
  return {
    name,
    uid: uid,
    url: file.path,
    size: file.size,
    type: "audio/aac",
  }
}

export function getImageLinkFromUID(uid) {
  if (!uid) {
    return null
  }
  return ConnectyCube.storage.privateUrl(uid)
}


export function getCbToken(uri) {
  const source = { uri, headers: {} }
  const matchResult = uri.match(/^(.+)\?token=(.+)/i)
  source.uri = matchResult[1]
  source.headers['CB-Token'] = matchResult[2]
  return source
}