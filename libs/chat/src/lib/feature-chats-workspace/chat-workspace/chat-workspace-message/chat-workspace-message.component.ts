import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, input, Output, signal } from '@angular/core';

import { TimePipe, AvatarCircleComponent, SvgComponent } from '@tt/common-ui';
import { Message } from '@tt/chat';

@Component({
  selector: 'app-chat-workspace-message',
  standalone: true,
  imports: [AvatarCircleComponent, TimePipe, SvgComponent],
  templateUrl: './chat-workspace-message.component.html',
  styleUrl: './chat-workspace-message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatWorkspaceMessageComponent {
  message = input.required<Message>();
  @Output() onRenComment: EventEmitter<{ id: number, rename: boolean }> = new EventEmitter();
  @Output() deleteMessage: EventEmitter< number> = new EventEmitter();
  @HostBinding('class.is-mine')
  get isMine() {
    return this.message().isMine;
  }

  ren = signal(false);

  onRen() {
    this.onRenComment.emit({ id: this.message().id, rename: this.ren() })
    this.ren.set(!this.ren());
  }
}
