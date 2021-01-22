// import { getImageLinkFromUID } from '../helpers/file'
export default class ConnectyCubeUser {
  constructor(user) {
    this.id = user.id
    this.login = user.login
    this.full_name = user.full_name
    this.phone = user.phone
    this.email = user.email
    this.password = user.password
  }
}