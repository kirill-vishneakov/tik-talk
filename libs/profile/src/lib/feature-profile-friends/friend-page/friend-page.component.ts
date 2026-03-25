import { ChangeDetectionStrategy, Component, computed, ElementRef, HostListener, inject, OnInit, Renderer2, signal, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  Profile,
  profileActions,
  selectSubLoaded,
  selectSubnLoaded,
} from '@tt/data-access/profile';
import { ProfileCardComponent } from '../../ui/profile-card/profile-card.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-friend-page',
  standalone: true,
  templateUrl: './friend-page.component.html',
  styleUrls: ['./friend-page.component.scss'],
  imports: [ProfileCardComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FriendPageComponent {
  store = inject(Store);
  subscribers = this.store.selectSignal(selectSubLoaded);
  subscription = this.store.selectSignal(selectSubnLoaded);

  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);

  @HostListener('window:resize')
    onWindowResize() {
      const { top } = this.hostElement.nativeElement.getBoundingClientRect();
      const height = window.innerHeight - top;

      this.r2.setStyle(this.hostElement.nativeElement, 'height', height + 'px');
    }

    ngAfterViewInit() {
      this.onWindowResize();
  }
}
