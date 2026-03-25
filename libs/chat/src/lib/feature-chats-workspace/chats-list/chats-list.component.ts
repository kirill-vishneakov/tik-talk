import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  Renderer2,
} from '@angular/core';
import { ChatsBtnComponent } from '../chats-btn/chats-btn.component';
import { chatsActions, ChatsService, selectFilteredChatsList, selectFilters } from '@tt/chat';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, startWith} from 'rxjs';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-chats-list',
  standalone: true,
  imports: [
    ChatsBtnComponent,
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule,
  ],
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatsListComponent {
  store = inject(Store);

  filterChatsControl = new FormControl(
    this.store.selectSignal(selectFilters)()
  );

  lastMessageRes = this.store.selectSignal(selectFilteredChatsList);

  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);

  @HostListener('window:resize')
  onWindowResize() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 24;

    this.r2.setStyle(this.hostElement.nativeElement, 'height', height + 'px');
  }

  ngAfterViewInit() {
    this.onWindowResize();
  }

  chatService = inject(ChatsService);

  constructor() {
      this.filterChatsControl.valueChanges
      .pipe(startWith(this.filterChatsControl.value), debounceTime(300), takeUntilDestroyed())
      .subscribe((val) => {
        if (!val) val = '';
        this.store.dispatch(chatsActions.chatsFiltered({ search: val }));
      });


      // this.chatService.connectWs().pipe(
      //   takeUntilDestroyed()
      // ).subscribe()

  }

}
