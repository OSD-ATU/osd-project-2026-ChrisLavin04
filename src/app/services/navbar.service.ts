import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NavbarService {
  private _menuOpen = signal<boolean>(false);
  menuOpen = this._menuOpen.asReadonly();

  toggleMenu() {
    this._menuOpen.update(open => !open);
  }

  closeMenu() {
    this._menuOpen.set(false);
  }
}
