import { Component, afterNextRender } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { animate, stagger } from 'animejs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  constructor() {
    afterNextRender(() => {
      animate('.hero-content', {
        translateY: [50, 0],
        opacity: [0, 1],
        delay: 300,
        duration: 1000,
        ease: 'outExpo'
      });

      animate('.btn-hero', {
        scale: [0.9, 1],
        opacity: [0, 1],
        delay: stagger(200, { start: 800 }),
        duration: 800,
        ease: 'outBack'
      });
    });
  }
}