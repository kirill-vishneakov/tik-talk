import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SvgComponent, AvatarCircleComponent } from '@tt/common-ui';
import { SubscriberCardComponent } from './subscriber-card/subscriber-card.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  profileActions,
  selectMeLoaded,
  selectSubLoaded,
} from '@tt/profile';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { map } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  ChatsService,
  selectUnreadMessages,
} from '@tt/chat';
import { ThemeService } from '@tt/data-access/theme';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [

  SvgComponent,
    SubscriberCardComponent,
    RouterLink,
    RouterLinkActive,
    AsyncPipe,
    AvatarCircleComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  store = inject(Store);
  themeService = inject(ThemeService)


  subscribers$ = this.store
    .select(selectSubLoaded)
    .pipe(map((res) => res.slice(0, 3)));

  me = this.store.selectSignal(selectMeLoaded);

  menu = [
    { icon: 'home', value: 'Моя страница', link: '/profile/me' },
    {
      icon: 'chat',
      value: 'Чаты',
      link: '/chats',
    },
    {icon: 'communities', value: 'Сообщества', link: '/communities'},
    { icon: 'friends', value: 'Друзья', link: '/friends' },
    { icon: 'search', value: 'Поиск', link: '/search' },
  ];

  chatService = inject(ChatsService);

  unreadMessages = this.store.select(selectUnreadMessages);

  ngOnInit() {
    this.store.dispatch(profileActions.meGet());
    this.store.dispatch(profileActions.subscribersGet({}));
    this.store.dispatch(profileActions.subscriptionGet({}));
    this.chatService.connectWs().subscribe();
  }
}
