import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { SvgComponent, AvatarCircleComponent } from '@tt/common-ui';
import { RouterLink } from '@angular/router';
import { Profile } from '@tt/data-access/profile';

@Component({
  selector: 'app-chat-workspace-header',
  standalone: true,
  imports: [AvatarCircleComponent, SvgComponent, RouterLink],
  templateUrl: './chat-workspace-header.component.html',
  styleUrl: './chat-workspace-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatWorkspaceHeaderComponent {
  profile = input<Profile>();
}
