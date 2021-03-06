import { InjectionToken } from '@angular/core';
import { TextPreviewComponent } from './text-preview/text-preview.component';
import { VideoPreviewComponent } from './video-preview/video-preview.component';
import { ImagePreviewComponent } from './image-preview/image-preview.component';
import { PdfPreviewComponent } from './pdf-preview/pdf-preview.component';
import { AudioPreviewComponent } from './audio-preview/audio-preview.component';

export const AVAILABLE_PREVIEWS = new InjectionToken<any>('AVAILABLE_PREVIEWS');

export class DefaultPreviews {
    text = TextPreviewComponent;
    video = VideoPreviewComponent;
    audio = AudioPreviewComponent;
    image = ImagePreviewComponent;
    pdf = PdfPreviewComponent;
}

