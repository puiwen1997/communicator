import ConnectyCube from 'react-native-connectycube'
import { CREDENTIALS, CONFIG } from '../config/ConnectyCubeConfig';
import AsyncStorage from '@react-native-async-storage/async-storage'
import ConnectCubeUser from '../models/ConnectyCubeUser';

class ConnectyCubeAuthService {

    static CURRENT_USER_SESSION_KEY = 'CURRENT_USER_SESSION_KEY'
    static DEVICE_SUBSCRIPTION_ID = 'DEVICE_SUBSCRIPTION_ID'
    static CURRENT_USER_ID = ''

    async connectyInit(navigation) {
        console.log("Initializing Connecty Cube.....")
        await ConnectyCube.init(CREDENTIALS, CONFIG)
        console.log("Initialized Connecty Cube!")
        return this.connectyAutoSignIn(navigation)
    }

    // async updateCurrentUser({ image, full_name, login }) {
    //     const updateData = {}
    //     if (full_name) {
    //         updateData.full_name = full_name
    //     }
    //     if (login) {
    //         updateData.login = login
    //     }
    //     if (image) {
    //         const file = preparationUploadImg(image)
    //         const resultUploadImg = await ConnectyCube.storage.createAndUpload({ file })
    //         updateData.avatar = resultUploadImg.uid
    //     }
    //     const responseUpdateUser = await ConnectyCube.users.update(updateData)
    //     const prewSession = await this.getUserSession()
    //     responseUpdateUser.user.avatar = getImageLinkFromUID(responseUpdateUser.user.avatar)
    //     const newSession = Object.assign(JSON.parse(prewSession), responseUpdateUser.user)
    //     await this.setUserSession(newSession)
    //     store.dispatch(updateCurrentUser(responseUpdateUser.user))
    // }

    async connectyAutoSignIn(navigation) {
        console.log("Auto login to Connecty Cube......")
        const checkUserSessionFromStore = await this.getUserSession()
        if (checkUserSessionFromStore) {
            console.log("Connecty Cube Session found!");
            const data = JSON.parse(checkUserSessionFromStore)
            console.log("Connecty Cube Session Data: ", data);
            if (data.login != null) {
                await this.connectySignIn({ login: data.login, password: data.password }, navigation)
                return (() => navigation.push("Screen", { screen: 'Main' }));
            }
        }
    }

    async connectySignIn(params, navigation) {
        console.log("Signing in to Connecty Cube......");
        const session = await ConnectyCube.createSession({ login: params.login, password: params.password })
        console.log("SignIn Session: ", session.user)
        const currentUser = new ConnectCubeUser(session.user)
        console.log("SignIn CurrentUser: ", currentUser)
        // session.user.avatar = getImageLinkFromUID(session.user.avatar)
        // store.dispatch(setCurrentUser(session))
        const customSession = Object.assign({}, currentUser, { password: params.password }, { occupants_Ids: "" })
        this.setUserSession(customSession)
        console.log("SignIn CustomSession", customSession)
        console.log("Connecting Connecty Cube Chat.....")
        this.connect(customSession.id, customSession.password)
        navigation.push("Screen", { screen: "Main" })
    }

    async connectySignUp(params, navigation) {
        console.log("Signing up to Connecty Cube....");
        await ConnectyCube.createSession()
        await ConnectyCube.users.signup(params)
        console.log("Signing in after sign up to Connecty Cube.....")
        return this.connectySignIn(params, navigation)
    }

    async setUserSession(userSession) {
        console.log("Set Connecty Cube Session.....")
        return AsyncStorage.setItem(ConnectyCubeAuthService.CURRENT_USER_SESSION_KEY, JSON.stringify(userSession))
    }

    async getUserSession() {
        console.log("Get Connecty Cube Session.....")
        return await AsyncStorage.getItem(ConnectyCubeAuthService.CURRENT_USER_SESSION_KEY)
    }

    async mergeUserSession(item) {
        console.log("Merging Connecty Cube session....")
        const merged = await AsyncStorage.mergeItem(ConnectyCubeAuthService.CURRENT_USER_SESSION_KEY, JSON.stringify(item));
        const checkUserSessionFromStore = await this.getConnectyCurrentUser()
        console.log("Merged Session Data: ", checkUserSessionFromStore);
        console.log("Merged Session Data ID: ", checkUserSessionFromStore.id);
        return merged;
    }

    async unsubscribePushNotifications() {
        const subscriptionIdToDelete = await this.getStoreDeviceSubscriptionId()
        ConnectyCube.pushnotifications.subscriptions.delete(subscriptionIdToDelete);
    }

    async getStoreDeviceSubscriptionId() {
        return await AsyncStorage.getItem(ConnectyCubeAuthService.DEVICE_SUBSCRIPTION_ID)
    }

    async connectySignOut() {
        await AsyncStorage.clear()
        await ConnectyCube.chat.disconnect();
        await ConnectyCube.logout().catch((error) => { console.log("Sign out error: ", error) });
    }

    async connect(userId, password) {
        console.log("Connecting Chat.....")
        await ConnectyCube.chat.connect({ userId, password })
    }

    async getConnectyCurrentUser() {
        // console.log("Getting Connecty Cube Current User Id...")
        const checkUserSessionFromStore = await this.getUserSession()
        if (checkUserSessionFromStore) {
            console.log("Connecty Cube Session found!");
            const data = JSON.parse(checkUserSessionFromStore)
            console.log("Connecty Cube Session Data to get CurrentUserId: ", data.id);
            return data;
        } else {
            console.log("Connecty Cube Session not found!");
        }
    }
}

const connectyCubeAuthService = new ConnectyCubeAuthService()

export default connectyCubeAuthService;