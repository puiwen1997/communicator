import ConnectyCube from 'react-native-connectycube'
import Dialog from '../models/Dialogs'
import User from '../models/ConnectyCubeUser'
import { AppState } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
// import { fetchDialogs, sortDialogs, updateDialog, addNewDialog, deleteDialog } from '../actions/dialogs'
// import { pushMessage, fetchMessages, lazyFetchMessages, updateMessages, deleteAllMessages } from '../actions/messages'
// import { selectDialog, unselectDialog } from '../actions/selectedDialog'
// import { fetchUsers } from '../actions/users'
// import store from '../store'
import { Message, FakeMessage } from '../models/Messages'
import ConnectyCubeUser from '../models/ConnectyCubeUser'
import ConnectyCubeAuthService from './ConnectyCubeAuthService';
import { DIALOG_TYPE } from '../constants/ConnectyCubeConstants';
import { preparationUploadImg, preparationUploadVoiceMessage, preparationAttachment, preparationVoiceAttachment } from '../components/ChatRoomComponents/file'
// import { DIALOG_TYPE } from '../helpers/constants'
import {
    STATUS_DELIVERED,
    STATUS_READ,
    STATUS_SENT
} from '../models/Messages'
import ChatDialogsService from 'react-native-connectycube/lib/messaging/cubeDialog'

class ConnectyCubeChatService {
    state = {
        historyMessages: []
    }

    // static occupants = []


    setUpListeners() {
        ConnectyCube.chat.onMessageListener = this.onMessageListener.bind(this)
        ConnectyCube.chat.onSentMessageCallback = this.onSentMessageListener.bind(this)
        ConnectyCube.chat.onDeliveredStatusListener = this.onDeliveredStatus.bind(this)
        ConnectyCube.chat.onReadStatusListener = this.onReadStatus.bind(this)
        AppState.addEventListener('change', this.handleAppStateChange)
    }

    async fetchDialogsFromServer() {
        console.log("Fetching dialog from server....")
        const dialogsFromServer = await ConnectyCube.chat.dialog.list();
        const data = await ConnectyCubeAuthService.getConnectyCurrentUser();
        console.log("Connecty Current User Data: ", data);
        const currentUserId = data.id;
        console.log("Connecty Current User Id: ", currentUserId);
        let privatChatIdsUser = []

        const dialogs = await dialogsFromServer.items.map(elem => {
            if (elem.type === DIALOG_TYPE.PRIVATE) {
                elem.occupants_ids.forEach(elem => {
                    elem != currentUserId && privatChatIdsUser.push(elem)
                })
            }
            return new Dialog(elem)
        })
        let occupantsIds = Object.assign({}, { occupants_Ids: JSON.stringify(privatChatIdsUser) })
        await ConnectyCubeAuthService.mergeUserSession(occupantsIds);
        console.log("Fetched Dialogs: ", dialogs)
        // console.log("Array length privatChatIdsUser: ", privatChatIdsUser.length)
        return dialogs;
        // if (privatChatIdsUser.length !== 0) {
        //     let userInfo = await this.getUsersList(privatChatIdsUser)
        //     console.log("Type: ", typeof userInfo)
        //     console.log("userInfo: ", userInfo)
        //     console.log("Array length usersInfo: ", userInfo.length)
        //     if (userInfo.length != 0) {
        //         console.log("Here!")
        //         userInfo.map((elem) => {
        //             console.log("Elem: ", elem);
        //             console.log("Id: ", elem.id);
        //         })
        //     }
        // }

    }

    // async getUsersList(ids) {
    //     console.log("Getting users list...")
    //     let privateChatIdsUserInfo = []
    //     const usersList = await ConnectyCube.users.get({
    //         per_page: 100,
    //         filter: {
    //             field: 'id', param: 'in', value: ids,
    //         },
    //     }).then((result) => {
    //         console.log("Result: ", result)
    //         result.items.map(elem => {
    //             console.log("User: ", JSON.stringify(elem.user))
    //             console.log("Id: ", elem.user.id)
    //             privateChatIdsUserInfo.push(elem.user)
    //         })

    //     })
    //     console.log("PrivateChatIdsUserInfo: ", JSON.stringify(privateChatIdsUserInfo))
    //     return privateChatIdsUserInfo;
    //     // .catch((error) => {});
    //     // console.log("Type of User List", typeof usersList)
    //     // return usersList;
    //     // return usersList.items.map(elem => {
    //     //     console.log("User: ", elem.user)
    //     //     // return new UserModel(elem.user)
    //     //     return elem.user;
    //     // })
    // }

    // async checkSenderId(message) {
    //     const currentUser = await ConnectyCubeAuthService.getConnectyCurrentUser();
    //     const isOtherSender = message.sender_id !== currentUser.id ? true : false
    //     console.log("IsOtherSender in services: ", isOtherSender)
    //     return isOtherSender;
    // }
    async retrieveUserInfo(id) {
        const response = await ConnectyCube.users.get({
            per_page: 100,
            filter: {
                field: "id", param: "in", value: id,
            },
        })
        let userInfo = [] 
        let usersList = response.items;
        if (usersList.length == 1) {
            usersList.map(elem => {
                return new User (elem.user)
            })
        } else {
            usersList.map(elem => {
                userInfo.push( new User(elem.user) )
            })
            return userInfo
        }
    }

    async listUsersByFullName(name) {
        const currentUser = await ConnectyCubeAuthService.getConnectyCurrentUser();
        const occupants_Ids = JSON.parse(currentUser.occupants_Ids)
        // console.log(currentUserId)
        console.log("currentUserId: ", currentUser.id)
        console.log("occupantsId: ", occupants_Ids)
        const allUsers = await ConnectyCube.users.get({ per_page: 100, full_name: name })
        console.log("All users: ", JSON.stringify(allUsers))
        let contacts = []

        // usersIdsToIgnore = [2792335, 2793588, 2804296]
        allUsers.items.map(elem => {
            console.log("Elem: ", elem)
            console.log("Id: ", elem.user.id)
            let existed = 0;
            occupants_Ids.map(item => {
                if (item == elem.user.id || item == currentUser.id ) {
                    existed += 1;
                }
            })
            console.log("existed: ", existed)
            if (existed < 1) {
                contacts.push(elem.user)
            }
        })
        //     console.log("Elem: ", elem)
        //     console.log("Id: ", elem.user.id)
        //     if (occupants_Ids.map(item => {
        //         console.log("Item: ", item)
        //         if (item != elem.user.id) {
        //             contacts.push(elem.user)
        //         }
        //         //  else {
        //         //     console.log("Already exists!")
        //         // }
        //     })
        //     )
        // })
        console.log("Whole contacts: ", contacts)
        return contacts
    }


    async createPrivateDialog(userId) {
        console.log("Creating dialog....")
        const params = {
            type: DIALOG_TYPE.PRIVATE, // type 3 refer to private dialog type
            occupants_ids: [userId],
        };

        // navigation.navigate("ChatRoomHome")
        const response = await ConnectyCube.chat.dialog.create(params);
        // return response;
        console.log("Create Dialog Response: ", response)
        const dialog = new Dialog(response)
        // console.log("Dialog: ", dialog)
        return dialog;
    }

    async sendMessage(dialog, messageText, attachments = false) {
        console.log("Sending messages....")
        const currentUser = await ConnectyCubeAuthService.getConnectyCurrentUser();
        // console.log("Connecty User: ", currentUser)
        const text = messageText.trim()
        const date = Math.floor(Date.now() / 1000)
        
        const recipient_id = dialog.type === DIALOG_TYPE.PRIVATE ? dialog.occupants_ids.find(elem => elem != currentUser.id)
            : dialog.xmpp_room_jid

        let msg = {
            type: dialog.xmpp_type,
            body: text,
            extension: {
                save_to_history: 1,
                dialog_id: dialog.id,
                sender_id: currentUser.id,
                date_sent: date,
            },
            markable: 1
        }

        msg.id = this.messageUniqueId

        // If send message as Attachment
        if (attachments) {
            return this.sendMessageAsAttachment(dialog, recipient_id, msg, attachments)
        }

        // const message = new FakeMessage(msg)
        // store.dispatch(pushMessage(message, dialog.id))
        const returnData = await ConnectyCube.chat.send(recipient_id, msg)
        console.log("Return data after sending message: ", returnData)
        return this.getHistoryMessages(dialog)

        // store.dispatch(sortDialogs(message))
    }

    get messageUniqueId() {
        return ConnectyCube.chat.helpers.getBsonObjectId()
    }

    async sendMessageAsAttachment(dialog, recipient_id, msg, attachments) {
        console.log("Sending Message as Attachment....")
        //create fake data for render img
        const attachment = preparationAttachment(attachments)
        msg.extension.attachments = [attachment]
        const message = new FakeMessage(msg)
        // store.dispatch(pushMessage(message, dialog.id))

        // create real data for attachment
        const response = await this.uploadPhoto(attachments)
        const updateAttach = preparationAttachment(attachments, response.uid)
        msg.extension.attachments = [updateAttach]
        const returnData = await ConnectyCube.chat.send(recipient_id, msg)
        console.log("Return data after sending message: ", returnData)
        // store.dispatch(sortDialogs(message))
        return this.getHistoryMessages(dialog)
    }

    async sendVoiceMessage(dialog, messageText, attachments = false) {
        console.log("Sending voice messages....")
        const currentUser = await ConnectyCubeAuthService.getConnectyCurrentUser();
        // console.log("Connecty User: ", currentUser)
        const text = messageText.trim()
        const date = Math.floor(Date.now() / 1000)
        
        const recipient_id = dialog.type === DIALOG_TYPE.PRIVATE ? dialog.occupants_ids.find(elem => elem != currentUser.id)
            : dialog.xmpp_room_jid

        let msg = {
            type: dialog.xmpp_type,
            body: text,
            extension: {
                save_to_history: 1,
                dialog_id: dialog.id,
                sender_id: currentUser.id,
                date_sent: date,
            },
            markable: 1
        }

        msg.id = this.messageUniqueId

        // If send message as Attachment
        if (attachments) {
            return this.sendVoiceMessageAsAttachment(dialog, recipient_id, msg, attachments)
        }

    }

    async sendVoiceMessageAsAttachment(dialog, recipient_id, msg, attachments) {
        console.log("Sending Message as Attachment....")
        //create fake data for render img
        const attachment = preparationAttachment(attachments)
        msg.extension.attachments = [attachment]
        const message = new FakeMessage(msg)
        // store.dispatch(pushMessage(message, dialog.id))

        const response = await this.uploadVoiceMessage(attachments)
        const updateAttach = preparationVoiceAttachment(attachments, response.uid)
        msg.extension.attachments = [updateAttach]
        const returnData = await ConnectyCube.chat.send(recipient_id, msg)
        console.log("Return data after sending message: ", returnData)
        // store.dispatch(sortDialogs(message))
        return this.getHistoryMessages(dialog)
    }
    // updateDialogsUnreadMessagesCount = (dialog) => {
    //     const updateObj = Object.assign(dialog, { unread_messages_count: 0 })
    //     store.dispatch(updateDialog(updateObj))
    //     return true
    // }

    async getHistoryMessages(dialog) {
        console.log("Getting history messages....")
        const currentUser = await ConnectyCubeAuthService.getConnectyCurrentUser();
        // console.log("Current User: ", currentUser)

        // If the first entry into the chat
        const historyFromServer = await ConnectyCube.chat.message.list({
            chat_dialog_id: dialog.id,
            sort_desc: 'date_sent'
        })
        const messages = historyFromServer.items.map(elem => (
            new Message(elem, currentUser.id)
        ))
        console.log("History messages: ", messages)
        return messages
    }

    async getMessages(dialog, message) {
        console.log("Get messages....")
        // console.log("Dialog id: ", dialog.id)
        // const currentUser = await ConnectyCubeAuthService.getConnectyCurrentUser();
        // console.log("Connecty User: ", currentUser)
        let amountMessages = null

        // If the first entry into the chat
        // if (!dialog.isAlreadyMessageFetch || dialog.unread_messages_count > 0 && !dialog.isAlreadyMessageFetch) {
        //     const messages = this.getHistoryMessages(dialog);
        //     const newObj = Object.assign(dialog, { isAlreadyMessageFetch: true })
        //     if (dialog.unread_messages_count > 0) {
        //         const firstUnreadMsg = messages[dialog.unread_messages_count - 1]
        //         this.readAllMessages(dialog.id)
        //         this.sendReadStatus(firstUnreadMsg.id, firstUnreadMsg.sender_id, firstUnreadMsg.dialog_id)
        //     }
        //     // this.updateDialogsUnreadMessagesCount(newObj)
        //     // store.dispatch(fetchMessages(dialog.id, messages))
        //     amountMessages = messages.length
        // }
        // else {

            // If the second entry into the chat
            console.log("before dialog.unread_messages_count: ", dialog.unread_messages_count)
            if (dialog.unread_messages_count > 0) {
                console.log("Enter here!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                const messages = message;
                console.log("Message: ", messages)
                const firstUnreadMsg = messages[dialog.unread_messages_count - 1]
                console.log("Message[0]:", message[0])
                console.log("after dialog.unread_messages_count: ", dialog.unread_messages_count)
                console.log("firstUnreadMsg:", firstUnreadMsg)
                this.readAllMessages(dialog.id)
                await this.sendReadStatus(firstUnreadMsg.id, firstUnreadMsg.sender_id, firstUnreadMsg.dialog_id)
                // this.updateDialogsUnreadMessagesCount(dialog)
            }
            // amountMessages = isAlredyUpdate.length
        // }
        return amountMessages
    }

    // // Message loading if more than 100
    // getMoreMessages = async (dialog) => {
    //     const currentMessages = this.getMessagesByDialogId(dialog.id)
    //     const lastMessageDate = currentMessages[currentMessages.length - 1]
    //     const updateObj = Object.assign(dialog, { last_messages_for_fetch: lastMessageDate.date_sent })

    //     const filter = {
    //         chat_dialog_id: dialog.id,
    //         date_sent: { lt: lastMessageDate.date_sent },
    //         sort_desc: 'date_sent'
    //     }

    //     const moreHistoryFromServer = await ConnectyCube.chat.message.list(filter)
    //     const messages = moreHistoryFromServer.items.map(elem => new Message(elem))
    //     store.dispatch(updateDialog(updateObj))
    //     const amountMessages = store.dispatch(lazyFetchMessages(dialog.id, messages))
    //     return amountMessages.history.length
    // }

    async onMessageListener(senderId, msg, dialogProps) {
        const message = new Message(msg)
        const currentUser = await ConnectyCubeAuthService.getConnectyCurrentUser();
        // console.log("Connecty User: ", currentUser)
        // const user = this.currentUser
        const dialog = dialogProps.id;
        if (senderId !== currentUser.id) {
            if (dialog === message.dialog_id) {
                // store.dispatch(sortDialogs(message))
                this.readMessage(message.id, message.dialog_id)
                this.sendReadStatus(msg.extension.message_id, msg.extension.sender_id, msg.dialog_id)
            } else {
                this.sendDeliveredStatus(msg.extension.message_id, msg.extension.sender_id, msg.dialog_id)
                // store.dispatch(sortDialogs(message, true))
            }
            // store.dispatch(pushMessage(message, message.dialog_id))
        }
    }

    async readAllMessages(dialogId) {
        return ConnectyCube.chat.message.update(null, {
            chat_dialog_id: dialogId,
            read: 1
        })
    }

    async readMessage(messageId, dialogId) {
        this.onReadStatus(messageId, dialogId)
        return ConnectyCube.chat.message.update(null, {
            chat_dialog_id: dialogId,
            read: 1
        })
    }

    async uploadPhoto(params) {
        console.log("Uploading photo to ConnectyCube Storage....")
        const file = preparationUploadImg(params)
        return ConnectyCube.storage.createAndUpload({ file })
    }

    async uploadVoiceMessage(params) {
        console.log("Uploading voice message to ConnectyCube Storage....")
        const file = preparationUploadVoiceMessage(params)
        return ConnectyCube.storage.createAndUpload({ file })
    }

    // async updateDialogInfo({ img, name, dialogId }) {
    //     const params = {}
    //     const image = img ? await this.uploadPhoto(img) : null
    //     if (image) {
    //         params.photo = image.uid
    //     }
    //     if (name) {
    //         params.name = name
    //     }
    //     const response = await ConnectyCube.chat.dialog.update(dialogId, params)
    //     const updateData = new Dialog(response)
    //     store.dispatch(updateDialog(updateData))
    // }

    async deleteDialog(dialogId) {
        await ConnectyCube.chat.dialog.delete(dialogId)
        // store.dispatch(deleteAllMessages(dialogId))
        // store.dispatch(deleteDialog(dialogId))
    }

    // async addOccupantsToDialog(dialog_id, occupants) {
    //     const participantIds = occupants.map(elem => elem.id)
    //     const params = {
    //         push_all: { occupants_ids: participantIds }
    //     }
    //     const response = await ConnectyCube.chat.dialog.update(dialog_id, params)
    //     const updateData = new Dialog(response)
    //     store.dispatch(fetchUsers(occupants))
    //     store.dispatch(updateDialog(updateData))
    //     return updateData
    // }

    handleAppStateChange = (AppState) => {
        if (AppState === 'active') {
            ConnectyCube.chat.markActive()
        } else {
            ConnectyCube.chat.markInactive()
        }
    }

    // // ConnectyCube listeners
    // onSentMessageListener(failedMessage, msg) {
    //     if (failedMessage) {
    //         return
    //     }
    //     store.dispatch(updateMessages(msg.extension.dialog_id, msg.id, { send_state: STATUS_SENT }))
    // }

    // // ConnectyCube listeners
    // onDeliveredStatus(messageId, dialogId, userId) {
    //     store.dispatch(updateMessages(dialogId, messageId, { send_state: STATUS_DELIVERED }))
    // }

    // ConnectyCube listeners
    // onReadStatus(messageId, dialogId, userId) {
    //     store.dispatch(updateMessages(dialogId, messageId, { send_state: STATUS_READ }))
    // }

    sendReadStatus(messageId, userId, dialogId) {
        ConnectyCube.chat.sendReadStatus({ messageId, userId, dialogId })
    }

    sendDeliveredStatus(messageId, userId, dialogId) {
        ConnectyCube.chat.sendDeliveredStatus({ messageId, userId, dialogId })
    }

    // pushMessageToStore(dialogId, messages) {
    //     store.dispatch(pushMessage(dialogId, messages.map(message => new Message(message))))
    // }

    // getDialogById(dialogId) {
    //     return store.getState().dialogs.find(elem => elem.id === dialogId)
    // }

    // getMessagesByDialogId(dialogId) {
    //     const result = store.getState().messages
    //     return result[dialogId]
    // }

    // async getUserFromServerById(id) {
    //     return ConnectyCube.users.get(id)
    // }

    async getFriendList() {
        const friendList = []
        ConnectyCube.chat.contactlist.get((contactlist) => {
            contactlist.map((contact) => {
                friendList.push(contact)
            })
        });
        return friendList;
    }

}

const connectyCubeChatService = new ConnectyCubeChatService()

export default connectyCubeChatService