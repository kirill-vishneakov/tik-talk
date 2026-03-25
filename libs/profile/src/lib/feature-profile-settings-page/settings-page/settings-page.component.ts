import { profileActions, ProfileService, selectFilteredProfiles, selectMeLoaded } from '@tt/profile';
import { ChangeDetectionStrategy, Component, effect, inject, ViewChild } from '@angular/core';
import { ProfileHeaderComponent, AvatarUploadComponent, ProfileDescriptionComponent } from '../../ui';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ImgUrlPipe, SvgComponent } from '@tt/common-ui';
import { firstValueFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    ProfileHeaderComponent,
    ReactiveFormsModule,
    SvgComponent,
    AvatarUploadComponent,
    ProfileDescriptionComponent,
    RouterLink,
    ImgUrlPipe
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsPageComponent {
  fb = inject(FormBuilder);
  profileService = inject(ProfileService);
  store = inject(Store);
  me = this.store.selectSignal(selectMeLoaded);



  @ViewChild(AvatarUploadComponent) avatarUploader!: AvatarUploadComponent;

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: [''],
    username: this.fb.nonNullable.control(this.me()?.username,[Validators.required]),
    description: [''],
    stack: [''],
  });

  constructor() {
    effect(() => {
      this.form.patchValue({
        ...this.me(),

        stack: this.mergeStack(this.me()?.stack),
      });
    });

    this.form.controls.username.disable()
  }

  onSave() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) return;

    if (this.avatarUploader.avatar) {
      firstValueFrom(
        this.profileService.uploadAvatar(this.avatarUploader.avatar)
      );
    }

    this.store.dispatch(profileActions.meUpload({
      ...this.form.value,
      //@ts-ignore
      stack: this.splitStack(this.form.value.stack),
    }))
  }

  splitStack(stack: string | null | string[] | undefined): string[] {
    if (!stack) return [];
    if (Array.isArray(stack)) return stack;

    return stack.split(',');
  }

  mergeStack(stack: string | null | string[] | undefined) {
    if (!stack) return '';
    if (Array.isArray(stack)) return stack.join(',');

    return stack;
  }

  clearForm(){
    this.form.reset()
  }
}
