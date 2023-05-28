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
        id: replyUserData._id,
        name: replyUserData.name,
        avatar: replyUserData.avatar,
      };

      if (replyMessageData.isDeleted)
        replyMessageResult = {
          id: messagesId,
          user,
          isDeleted: true,
          createdAt: message.createdAt,
        };
      else
        replyMessageResult = {
          id: messagesId,
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
          type: reactEle.typeReaction,
        };
      });
    }

    message.createdAt = DateUtils.formatAMPM(message.createdAt);
    message.id = message._id;

    delete message.isDeleted;
    delete message.reactUsers;
    delete message.replyUser;
    delete message._id;

    message.user.id = message.user._id;
    delete message.user._id;

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
    const newParticipants = participants.map((p) => {
      const participantsSearch = userInfos.find(
        (participantEle) => participantEle._id + '' == p.userId + '',
      );
      p.avatar = participantsSearch.avatar;
      p.fullName = p.name;
      delete p.name;
      return p;
    });

    const user = messageUtils.getUserForIndividualConversation(
      userId,
      newParticipants,
      userInfos,
    );
    if (isDeleted)
      return {
        id: _id,
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

      const user = messageUtils.getUserForIndividualConversation(
        userId,
        participants,
        userInfos,
      );

      if (replyMessageData.isDeleted)
        replyMessageResult = {
          id: messageId,
          user,
          isDeleted: true,
          createdAt: message.createdAt,
        };
      else
        replyMessageResult = {
          id: messageId,
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
          user: messageUtils.getUserForIndividualConversation(
            reactEle.userId,
            participants,
            userInfos,
          ),
          type: reactEle.type,
        };
      });
    }
    message.id = message._id;

    delete message.isDeleted;
    delete message.members;
    delete message.userInfos;
    delete message.userId;
    delete message._id;

    message.createdAt = DateUtils.formatAMPM(message.createdAt);
    message.participants = newParticipants;

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
      id: userId,
      fullName: participantsSearch.fullName,
      avatar: userInfoSearch.avatar ? userInfoSearch.avatar : '',
    };
  }

  public static convertImageStringToArray(message) {
    console.log('message: ', message);
  }
}
