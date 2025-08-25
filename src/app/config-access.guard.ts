import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ConfigAccessGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const hasAccess = this.checkUserAccess();
    if (!hasAccess) {
      this.router.navigate(['/view']); // Reindirizza se non autorizzato
    }
    return hasAccess;
  }

  private checkUserAccess(): boolean {
    // Logica per verificare l'accesso (es. basata su ruoli, token, ecc.)
    return true; // Modifica secondo la logica della tua applicazione
  }
}
