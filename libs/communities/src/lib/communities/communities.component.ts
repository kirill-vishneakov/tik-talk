import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommunitiesFiltersTsComponent } from "./communities-filters/communities-filters.component";

@Component({
  selector: 'tt-communities',
  standalone: true,
  imports: [ReactiveFormsModule, CommunitiesFiltersTsComponent],

templateUrl: './communities.component.html',
  styleUrl: './communities.component.scss',
})
export class CommunitiesComponent {

}
