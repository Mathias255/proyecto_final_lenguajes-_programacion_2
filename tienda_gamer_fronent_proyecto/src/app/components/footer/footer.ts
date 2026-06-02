import { Component } from '@angular/core';
import { AnimeDirective } from '../../directives/anime.directive';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [AnimeDirective],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css']
})
export class FooterComponent {}