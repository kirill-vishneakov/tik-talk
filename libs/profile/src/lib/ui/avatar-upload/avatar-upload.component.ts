import { ChangeDetectionStrategy, Component, Input, input, signal } from '@angular/core';
import { SvgComponent, DndDirective, AvatarCircleComponent } from '@tt/common-ui';


@Component({
  selector: 'app-avatar-upload',
  standalone: true,
  imports: [SvgComponent, DndDirective, AvatarCircleComponent],
  templateUrl: './avatar-upload.component.html',
  styleUrl: './avatar-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarUploadComponent {
  preview = signal<string>('');
  @Input() avatarUrl = 'assets/images/avatar-upload.jpg';

  avatar: File | null = null;

  fileBrowserHandler(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.processFile(file);
  }

  onFileDropped(file: File) {
    this.processFile(file);
  }

  processFile(file: File | null | undefined) {
    if (!file || !file.type.match('image')) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      this.preview.set(event.target?.result?.toString() ?? '');
    };

    reader.readAsDataURL(file);
    this.avatar = file;
  }

  ngOnInit() {
    this.preview.set(this.avatarUrl)
}}
