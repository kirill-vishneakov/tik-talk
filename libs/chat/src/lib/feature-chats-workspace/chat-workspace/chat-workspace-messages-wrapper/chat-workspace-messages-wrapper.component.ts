
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  Renderer2,
  signal,
  ViewChild,
} from '@angular/core';
import { ChatWorkspaceMessageComponent } from '../chat-workspace-message/chat-workspace-message.component';
import {  InputComponent} from '@tt/common-ui';
import { Chat, chatsActions, ChatsService } from '@tt/chat';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-chat-workspace-messages-wrapper',
  standalone: true,
  imports: [ChatWorkspaceMessageComponent, InputComponent],
  templateUrl: './chat-workspace-messages-wrapper.component.html',
  styleUrl: './chat-workspace-messages-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatWorkspaceMessagesWrapperComponent {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  chat = input.required<Chat>();
  store = inject(Store);
  value = signal('');
  ren= signal(false);
  id = signal(0);

  onRenComment(payload: {id: number, rename: boolean}) {
    this.id.set(payload.id);
    const message = this.chat().messages.filter(message => message.id === payload.id)[0]
    this.value.set(message.text)
    this.ren.set(!payload.rename)
  }

  deleteMessage(id: number) {
    const message = this.chat().messages.filter(message => message.id === id)[0]
    this.store.dispatch(chatsActions.messageDelete({messageId: message.id, chatId: this.chat().id}))
  }

  renComment(postText: string){
    this.store.dispatch(chatsActions.messageRen({ messageId: this.id(), text: postText }))
    this.ren.set(false)
  }

  chatService = inject(ChatsService)

  onSendMessage(postText: string) {

    this.chatService.wsAdapter.sendMessage(postText, this.chat().id)

    this.store.dispatch(chatsActions.chatsGet());
    this.store.dispatch(chatsActions.getChatById({chatId: this.chat().id}));
    setTimeout(() => this.scrollTheEnd(), 1000);
  }

  scrollTheEnd() {
    const container = this.scrollContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
  }

  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);

  @HostListener('window:resize')
  onWindowResize() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 24 - 24;

    this.r2.setStyle(this.hostElement.nativeElement, 'height', height + 'px');
  }

  ngAfterViewInit() {
    this.onWindowResize();
    this.scrollTheEnd();
  }
}
