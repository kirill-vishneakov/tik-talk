import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  Chat,
  LastMessageRes,
  Message,
  RenMessageRes,
} from '../interfaces/chats.interface';
import { map } from 'rxjs';
import { DateTime } from 'luxon';
import { selectMeLoaded } from '../../profile';
import { Store } from '@ngrx/store';
import { ChatWsServiceI } from '@tt/data-access/chats/interfaces/chat-ws-service.interface';
import { AuthService } from '../../auth';
import { ChatWsService } from '@tt/data-access/chats/services/chat.ws.service';
import { chatsActions } from '@tt/data-access/chats';
import { ChatWsMessage } from '@tt/data-access/chats/interfaces/chat-ws-message.interface';
import {
  isErrorMessage,
  isNewMessage,
  isUnreadMessage,
} from '@tt/data-access/chats/interfaces/type-guards';
import { url } from '@tt/data-access/shared/tools/global-url';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  http = inject(HttpClient);
  store = inject(Store);
  authService = inject(AuthService);
  me = this.store.selectSignal(selectMeLoaded);

  wsAdapter: ChatWsServiceI = new ChatWsService();

  connectWs() {
    return this.wsAdapter.connect({
      url: `${url}chat/ws`,
      token: this.authService.token ?? '',
      handleMessage: this.handleWsMessage,
    });
  }

  handleWsMessage = (message: ChatWsMessage) => {
    if (!('action' in message)) return;

    if (isUnreadMessage(message)) {
      this.store.dispatch(chatsActions.unreadMessages(message.data));
      this.store.dispatch(chatsActions.chatsFiltered({ search: '' }));
    }

    if (isNewMessage(message)) {
      this.store.dispatch(
        chatsActions.getChatById({ chatId: message.data.chat_id })
      );
      this.store.dispatch(chatsActions.chatsFiltered({ search: '' }));
    }
    if (isErrorMessage(message)) {
      this.wsAdapter.disconnect();
      this.wsAdapter.connect({
        url: `${url}chat/ws`,
        token: this.authService.token ?? '',
        handleMessage: this.handleWsMessage,
      });
    }
  };

  groupMessagesByDay(messages: Message[]) {
    const groups: { [key: string]: Message[] } = {};

    for (const message of messages) {
      if (!groups[message.day]) {
        groups[message.day] = [];
      }
      groups[message.day].push(message);
    }

    return Object.keys(groups).map((day) => ({
      day,
      messages: groups[day],
    }));
  }

  createChat(userId: number) {
    return this.http.post<Chat>(`${url}chat/${userId}`, {});
  }

  getMyChats() {
    return this.http.get<LastMessageRes[]>(`${url}chat/get_my_chats/`);
  }

  getChatById(chatId: number) {
    return this.http.get<Chat>(`${url}chat/${chatId}`).pipe(
      map((chat) => {
        return {
          ...chat,
          companion:
            chat.userFirst.id === this.me()?.id
              ? chat.userSecond
              : chat.userFirst,
          messagesGroup: this.groupMessagesByDay(
            chat.messages.map((message) => {
              const date = DateTime.fromISO(message.createdAt).plus({
                hour: 3,
              });
              const dateNow = DateTime.now();

              const yesterday = dateNow.minus({ days: 1 });
              let day: string;

              if (date.hasSame(dateNow, 'day')) {
                day = 'Сегодня';
              } else if (date.hasSame(yesterday, 'day')) {
                day = 'Вчера';
              } else {
                day = date.toLocaleString(DateTime.DATE_SHORT);
              }
              return {
                ...message,
                user:
                  chat.userFirst.id === message.userFromId
                    ? chat.userFirst
                    : chat.userSecond,
                isMine: message.userFromId === this.me()?.id,
                day,
              };
            })
          ),
        };
      })
    );
  }

  sendMessage(chatId: number, message: string) {
    return this.http.post<Message>(
      `${url}message/send/${chatId}`,
      {},
      {
        params: {
          message,
        },
      }
    );
  }

  renMessage(messageId: number, text: string) {
    return this.http.patch<RenMessageRes>(
      `${url}message/${messageId}`,
      {},
      {
        params: {
          text,
        },
      }
    );
  }

  deleteMessage(messageId: number) {
    return this.http.delete<string>(`${url}message/${messageId}`);
  }
}
