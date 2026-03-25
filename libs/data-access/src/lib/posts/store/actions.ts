import {  CommentCreateDto } from '../interfaces/post.interface';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Post, PostCreateDto } from '../interfaces/post.interface';

export const postsActions = createActionGroup({
  source: 'posts',
  events: {
    'posts get': emptyProps(),
    'posts loaded': props<{ posts: Post[] }>(),
    'post create': props<{ post: PostCreateDto }>(),
    'post ren': props<{ postId: number; title: string; content: string }>(),
    'post delete': props<{ postId: number }>(),
    'comment create': props<{ comment: CommentCreateDto }>(),
    'comment delete': props<{ commentId: number }>(),
    'comment ren': props<{ commentId: number; text: string }>(),
  },
});
