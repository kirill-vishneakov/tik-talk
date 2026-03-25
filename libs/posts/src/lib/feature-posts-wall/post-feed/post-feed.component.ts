import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  Renderer2,

  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { postsActions, selectPosts } from '@tt/posts';
import {

  InputComponent,

} from '@tt/common-ui';

import { FormsModule } from '@angular/forms';
import { PostComponent } from '../post/post.component';
import { selectMeLoaded } from '@tt/data-access/profile';


@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [InputComponent, FormsModule, PostComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostFeedComponent {
  store = inject(Store);
  feed = this.store.selectSignal(selectPosts);

  hostElement = inject(ElementRef);
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  r2 = inject(Renderer2);

  profile = this.store.selectSignal(selectMeLoaded);

  title!: string;

  @HostListener('window:resize')
  onWindowResize() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 74;

    this.r2.setStyle(this.hostElement.nativeElement, 'height', height + 'px');
  }

  constructor() {
    this.store.dispatch(postsActions.postsGet());
  }

  ngAfterViewInit() {
    this.onWindowResize();
  }

  onCreatePost(postText: string) {
    if (this.title)
      this.store.dispatch(
        postsActions.postCreate({
          post: {
            title: this.title,
            content: postText,
            authorId: this.profile()!.id,
          },
        })
      );
    this.title = '';
  }
}
