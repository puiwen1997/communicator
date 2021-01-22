// import { getImageLinkFromUID } from '../helpers/file'
const defaultProfilePic = "https://firebasestorage.googleapis.com/v0/b/myreactnative-33c0a.appspot.com/o/profilePicture%2Fdefault.png?alt=media&token=0d991cf8-8268-4db0-9650-dfad8e712189";
export default class User {
  constructor(user) {
    this.id = user.id
    this.full_name = user.full_name
    this.login = user.login
    this.phone = user.phone
    this.email = user.email
    this.password = user.password
    this.emergencyContact = user.emergencyContact
    this.photoURL = user.photoURL
  }
}