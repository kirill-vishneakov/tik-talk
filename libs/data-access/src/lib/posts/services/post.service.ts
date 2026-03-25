import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CommentCreateDto, PostCreateDto, Comment, Post } from '../index';
import { map } from 'rxjs';
import { url } from '@tt/data-access/shared/tools/global-url';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  #http = inject(HttpClient);

  createPost(payload: PostCreateDto) {
    return this.#http.post<Post>(`${url}post/`, payload);
  }

  renPost(postId: number, title: string, content: string) {
    return this.#http.patch<Post>(`${url}post/${postId}`, {
      title,
      content,
    });
  }

  fetchPosts() {
    return this.#http.get<Post[]>(`${url}post/`);
  }

  deletePost(postId: number) {
    return this.#http.delete<Comment>(`${url}post/${postId}`);
  }

  createComment(payload: CommentCreateDto) {
    return this.#http.post<Comment>(`${url}comment/`, payload);
  }

  renComment(commentId: number, text: string) {
    return this.#http.patch<Comment>(`${url}comment/${commentId}`, {
      text,
    });
  }

  deleteComment(commentId: number) {
    return this.#http.delete<Comment>(`${url}comment/${commentId}`);
  }

  getCommentsByPostId(postId: number) {
    return this.#http.get<Post>(`${url}post/${postId}`).pipe(
      map((res) => {
        return res.comments;
      })
    );
  }
}
