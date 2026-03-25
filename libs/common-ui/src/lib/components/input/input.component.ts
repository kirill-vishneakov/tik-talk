import {
  Component,
  inject,
  Renderer2,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef, input,
  ChangeDetectionStrategy
} from '@angular/core';
import { AvatarCircleComponent } from '../avatar-circle/avatar-circle.component';
import { SvgComponent } from '../svg/svg.component';
import { FormsModule } from '@angular/forms';
import { selectMeLoaded } from '@tt/data-access/profile';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [AvatarCircleComponent, SvgComponent, FormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent {
  @Output() onClick = new EventEmitter<string>();
  value = input('')

  @ViewChild('textarea') textarea!: ElementRef;

  postText = '';
  r2 = inject(Renderer2);
  store = inject(Store);
  profile = this.store.selectSignal(selectMeLoaded);

  onTextareaInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;

    this.r2.setStyle(textarea, 'height', 'auto');
    this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px');
  }

  onClickBtn() {
    if (!this.postText) return;
    this.onClick.emit(this.postText);
    this.postText = '';

    this.r2.setStyle(this.textarea.nativeElement, 'height', 'auto');
  }

  ngOnInit(): void {
    if (!this.value) return;
    this.postText = this.value();
  }

  handleEnter(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    this.onClickBtn();
  }
}
