import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { profileActions } from '@tt/profile';
import { Store } from '@ngrx/store';
import { auditTime, debounceTime, distinctUntilChanged, filter, find, from, fromEvent, Observable, of, share, shareReplay, take, tap, throttleTime, throwError, timer} from 'rxjs'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  // store = inject(Store);
  // constructor() {
  //   this.store.dispatch(profileActions.meGet())
  // }

  // constructor() {
  //   const obs$ = fromEvent(document.body, 'click')
  //   .pipe(
  //     tap(() => {
  //       console.log('click');
  //     }),
  //     auditTime(1000)
  //   )

  //   obs$.subscribe(console.log)
  // }
}
