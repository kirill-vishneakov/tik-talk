import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

enum TopicType {
  NONE = '',
  PROGRAMMING = 'PROGRAMMING',
  TECHNOLOGY = 'TECHNOLOGY',
  EDUCATION = 'EDUCATION',
  SPORT = 'SPORT',
  OTHER = 'OTHER'
}

@Component({
  selector: 'tt-communities-filters',
  standalone: true,
  imports: [ReactiveFormsModule],

templateUrl: './communities-filters.component.html',
  styleUrl: './communities-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunitiesFiltersTsComponent {
  TopicType = TopicType
  fb = inject(FormBuilder)
  searchForm = this.fb.group({
    title: this.fb.control<string>(''),
    theme: this.fb.nonNullable.control<TopicType>(TopicType.NONE),
    tegs: this.fb.control<string>(''),
  });

  constructor(){
    this.searchForm.valueChanges.pipe(takeUntilDestroyed()).subscribe(val => {
      console.log(val);
    })
  }
}
