import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Pageble } from '../../shared';
import { Profile } from '../interfaces/profile.interface';
import { url } from '@tt/data-access/shared/tools/global-url';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  http: HttpClient = inject(HttpClient);

  getMe() {
    return this.http.get<Profile>(`${url}account/me`);
  }

  getAccount(id: number) {
    return this.http.get<Profile>(`${url}account/${id}`);
  }

  getSubscribers() {
    return this.http.get<Pageble<Profile>>(`${url}account/subscribers/`);
  }

  getSubscription() {
    return this.http.get<Pageble<Profile>>(`${url}account/subscriptions/`);
  }

  patchProfile(profile: Partial<Profile>) {
    return this.http.patch<Profile>(`${url}account/me`, profile);
  }

  uploadAvatar(file: File) {
    const fd = new FormData();
    fd.append('image', file);
    return this.http.post<Profile>(`${url}account/upload_image`, fd);
  }

  filterProfiles(params: Record<string, any>) {
    return this.http.get<Pageble<Profile>>(`${url}account/accounts`, {
      params,
    });
  }
}
