import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ChatWorkspaceHeaderComponent } from './chat-workspace-header/chat-workspace-header.component';
import { ChatWorkspaceMessagesWrapperComponent } from './chat-workspace-messages-wrapper/chat-workspace-messages-wrapper.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Chat, chatsActions, selectChat } from '@tt/chat';
import { combineLatest, filter, map, switchMap, take, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-chat-workspace',
  standalone: true,
  imports: [
    ChatWorkspaceHeaderComponent,
    ChatWorkspaceMessagesWrapperComponent,
    AsyncPipe,
  ],
  templateUrl: './chat-workspace.component.html',
  styleUrl: './chat-workspace.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatWorkspaceComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  store = inject(Store)

  activeChat$= combineLatest([
    this.route.params.pipe(map(({ id }) => id)),
    this.route.queryParams.pipe(map(({ userId }) => userId))
  ]).pipe(
    switchMap(([id, userId]) => {
      if (id === 'new' && userId) {
        this.store.dispatch(chatsActions.chatCreate({ userId: Number(userId) }));
        return this.store.select(selectChat).pipe(
          filter((chat) => chat !== null),
          take(1),
          tap((chat) => {
            if (chat) {
              this.router.navigate(['chats', chat.id]);
            }
          }),
          map(() => null)
        );
      }

      this.store.dispatch(chatsActions.getChatById({ chatId: Number(id) }));
      return this.store.select(selectChat).pipe(
        filter((chat) => chat !== null)
      );
    })
  );

  // constructor() {
  //   timer(0, 10000).pipe(
  //     switchMap(() => this.activeChat$)
  //   ).subscribe()
  // }
}
