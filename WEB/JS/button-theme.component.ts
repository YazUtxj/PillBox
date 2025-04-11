import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme/theme.service';

@Component({
  selector: 'app-button-theme',
  imports: [],
  templateUrl: './button-theme.component.html',
  styleUrl: './button-theme.component.css'
})
export class ButtonThemeComponent {
  constructor(private themeService: ThemeService){}

  toggleTheme(){
    this.themeService.theme()
  }
}
