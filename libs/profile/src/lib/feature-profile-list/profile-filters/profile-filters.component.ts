import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  profileActions,
  selectFilteredProfiles,
  selectSaveFilteredProfiles,
} from '@tt/profile';
import {
  BehaviorSubject,
  debounceTime,
  from,
  startWith,
  Subscription,
} from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-profile-filters',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile-filters.component.html',
  styleUrl: './profile-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileFiltersComponent {
  store = inject(Store);

  fb = inject(FormBuilder);

  searchForm = this.fb.group({
    firstName: [
      this.store.selectSignal(selectSaveFilteredProfiles)()['firstName'],
    ],
    lastName: [
      this.store.selectSignal(selectSaveFilteredProfiles)()['lastName'],
    ],
    stack: [this.store.selectSignal(selectSaveFilteredProfiles)()['stack']],
    city: [this.store.selectSignal(selectSaveFilteredProfiles)()['city']],
  });

  subscriberSearchForm!: Subscription;

  constructor() {
    this.subscriberSearchForm = this.searchForm.valueChanges
      .pipe(startWith({}), debounceTime(300))
      .subscribe(() => {
        this.store.dispatch(
          profileActions.filterEvents({ filters: this.searchForm.value })
        );
      });
  }

  ngOnDestroy() {
    this.subscriberSearchForm.unsubscribe();
  }
}
