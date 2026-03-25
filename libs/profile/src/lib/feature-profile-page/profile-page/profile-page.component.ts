import { PostFeedComponent, postsActions } from '@tt/posts';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  profileActions,
  ProfileService,
  selectAccountLoaded,
  selectMeLoaded, selectSubLoaded
} from '@tt/profile';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { SvgComponent, ImgUrlPipe } from '@tt/common-ui';
import { ProfileHeaderComponent, ProfileDescriptionComponent } from '../../ui';
import { Store } from '@ngrx/store';


@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    ProfileHeaderComponent,
    AsyncPipe,
    ImgUrlPipe,
    RouterLink,
    SvgComponent,
    PostFeedComponent,
    ProfileDescriptionComponent
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfilePageComponent {
  profileService = inject(ProfileService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  store = inject(Store);

  me = this.store.select(selectMeLoaded);
  meSignal = this.store.selectSignal(selectMeLoaded);

  isMyPage = signal(false);

  subscribers$ = this.store.select(selectSubLoaded)
    .pipe(map((res) => res.slice(0, 6)));

  profile$ = this.route.params.pipe(
    switchMap(({ id }) => {
      this.isMyPage.set(id === 'me' || id === this.meSignal()?.id);
      if (this.isMyPage()) return this.me;
      this.store.dispatch(profileActions.accountGet({accountId: Number(id)}));
      return this.store.select(selectAccountLoaded);
    })
  );

  async sendMessage(userId: number) {
    this.router.navigate(['/chats/', 'new'], { queryParams: { userId } });
  }
}
