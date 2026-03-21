import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DarkModeService {
  private _darkMode = signal<boolean>(localStorage.getItem('darkMode') === 'true');
  darkMode = this._darkMode.asReadonly();

  toggle() {
    this._darkMode.update((value) => {
      const newValue = !value;
      localStorage.setItem('darkMode', String(newValue));
      this.updateDarkModeClass(newValue);
      return newValue;
    });
  }

  updateDarkModeClass(isDark: boolean = this._darkMode()) {
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  constructor() {
    this.updateDarkModeClass(this._darkMode());
  }
}
