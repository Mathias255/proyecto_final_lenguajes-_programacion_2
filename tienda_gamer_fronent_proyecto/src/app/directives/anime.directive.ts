import { Directive, ElementRef, Input, afterNextRender } from '@angular/core';
import { animate } from 'animejs';

@Directive({
  selector: '[appAnime]',
  standalone: true
})
export class AnimeDirective {
  @Input('appAnime') config: any;

  constructor(private el: ElementRef) {
    afterNextRender(() => {
      const { targets, ...rest } = this.config || {};
      const finalTargets = targets || this.el.nativeElement;

      animate(finalTargets, {
        duration: 1000,
        ease: 'outExpo',
        ...rest
      });
    });
  }
}
