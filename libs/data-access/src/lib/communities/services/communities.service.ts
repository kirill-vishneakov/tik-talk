import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { AuthService } from '../../auth';
import { selectMeLoaded } from '../../profile';


@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  http = inject(HttpClient);
  store = inject(Store);
  authService = inject(AuthService);
  me = this.store.selectSignal(selectMeLoaded);
}
