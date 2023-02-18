import { type } from 'os';
import { typeMessage } from 'src/messages/messages.enum';
import { IMessagesResponse } from 'src/messages/messages.type';
import { DateUtils } from 'src/shared/common/dateUtils';

export class messageUtils {
  public static convertMessageOfGroup(message): IMessagesResponse {
    const {
      _id,
      isDeleted,
      replyMessage,
      replyUser,
      reactUsers,
      reacts,
      type,
      content,
    } = message;

    if (isDeleted)
      return {
        _id,
        isDeleted,
        user: message.user,
        createdAt: message.createdAt,
      };

    // convert replyMessageResult
    let replyMessageResult = null;
    if (replyMessage && replyMessage.length > 0) {
      const replyMessageData = replyMessage[0];
      const messagesId = replyMessageData._id;
      const replyUserData = replyUser[0];

      const user = {
        _id: replyUserData._id,
        name: replyUserData.name,
        avatar: replyUserData.avatar,
      };

      if (replyMessageData.isDeleted)
        replyMessageResult = {
          _id: messagesId,
          user,
          isDeleted: true,
          createdAt: message.createdAt,
        };
      else
        replyMessageResult = {
          _id: messagesId,
          user,
          content: replyMessageData.content,
          type: replyMessageData.type,
          createdAt: message.createdAt,
        };
    }
    // convert Reacts
    let reactsResult = [];

    if (reacts && reacts.length > 0) {
      reactsResult = reacts.map((reactEle) => {
        return {
          user: reactUsers.find(
            (userEle) => userEle._id + '' == reactEle.userId + '',
          ),
          type: reactEle.type,
        };
      });
    }

    delete message.isDeleted;
    delete message.reactUsers;
    delete message.replyUser;

    if (type === typeMessage.FILE) message.content = content.split(',,');

    return {
      ...message,
      replyMessage: replyMessageResult,
      reacts: reactsResult,
    };
  }

  public static convertMessageOfIndividual(message) {
    const {
      _id,
      isDeleted,
      userId,
      replyMessage,
      reacts,
      participants,
      userInfos,
    } = message;

    const user = this.getUserForIndividualConversation(
      userId,
      participants,
      userInfos,
    );

    if (isDeleted)
      return {
        _id,
        isDeleted,
        user,
        createdAt: message.createdAt,
      };

    // convert replyMessage
    let replyMessageResult = {};
    if (replyMessage && replyMessage.length > 0) {
      const replyMessageData = replyMessage[0];
      const messageId = replyMessageData._id;
      const { userId } = replyMessageData;

      const user = this.getUserForIndividualConversation(
        userId,
        participants,
        userInfos,
      );

      if (replyMessageData.isDeleted)
        replyMessageResult = {
          _id: messageId,
          user,
          isDeleted: true,
          createdAt: message.createdAt,
        };
      else
        replyMessageResult = {
          _id: messageId,
          user,
          content: replyMessageData.content,
          type: replyMessageData.type,
          createdAt: message.createdAt,
        };
    }
    // convert reacts
    let reactsResult = [];

    if (reacts && reacts.length > 0) {
      reactsResult = reacts.map((reactEle) => {
        return {
          user: this.getUserForIndividualConversation(
            reactEle.userId,
            participants,
            userInfos,
          ),
          type: reactEle.type,
        };
      });
    }

    delete message.isDeleted;
    delete message.members;
    delete message.userInfos;
    delete message.userId;

    message.createdAt = DateUtils.formatAMPM(message.createdAt);

    return {
      ...message,
      user,
      replyMessage: replyMessageResult,
      reacts: reactsResult,
    };
  }

  public static getUserForIndividualConversation(
    userId,
    participants,
    userInfos,
  ) {
    const participantsSearch = participants.find(
      (participantEle) => participantEle.userId + '' == userId + '',
    );

    const userInfoSearch = userInfos.find(
      (userInfoEle) => userInfoEle._id + '' == userId + '',
    );

    return {
      _id: userId,
      name: participantsSearch.name,
      avatar: userInfoSearch.avatar ? userInfoSearch.avatar : '',
    };
  }

  public static convertImageStringToArray(message) {
    console.log('message: ', message);
  }
}
