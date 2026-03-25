import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Profile } from '@tt/data-access/profile';


@Component({
  selector: 'app-profile-description',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-description.component.html',
  styleUrl: './profile-description.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileDescriptionComponent {
  profile = input.required<Profile>()
}
