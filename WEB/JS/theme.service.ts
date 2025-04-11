import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkTheme = false;
  
  theme(){
    this.isDarkTheme = !this.isDarkTheme;
  
    document.body.classList.toggle('dark-theme', this.isDarkTheme);
  }

  isDark(){
    return this.isDarkTheme
  }
}
