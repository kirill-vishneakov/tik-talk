import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { AvatarCircleComponent, DateAgoPipe } from '@tt/common-ui';
import { LastMessageRes } from '@tt/chat';

@Component({
  selector: 'button[chats]',
  standalone: true,
  imports: [AvatarCircleComponent, DateAgoPipe],
  templateUrl: './chats-btn.component.html',
  styleUrl: './chats-btn.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatsBtnComponent {
  chat = input<LastMessageRes>();
}
