import {
  InputComponent,
  DateAgoPipe,
  AvatarCircleComponent,
} from '@tt/common-ui';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { Comment, postsActions } from '@tt/posts';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [InputComponent, AvatarCircleComponent, DateAgoPipe, InputComponent],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentComponent {
  ren = signal(false);
  comment = input<Comment>();
  store = inject(Store);

  onDelete() {
    this.store.dispatch(
      postsActions.commentDelete({ commentId: this.comment()!.id })
    );
  }

  onRen() {
    this.ren.set(!this.ren());
  }

  renCom(postText: string) {
    this.store.dispatch(
      postsActions.commentRen({ commentId: this.comment()!.id, text: postText })
    );

    this.onRen();
  }
}
