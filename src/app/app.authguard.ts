import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';
import { UserInfoService } from './providers/user-info.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard extends KeycloakAuthGuard {
  constructor(
    protected override readonly router: Router,
    protected readonly keycloak: KeycloakService,
    private readonly userInfo: UserInfoService
  ) {
    super(router, keycloak);
  }

  public async isAccessAllowed(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // Force the user to log in if currently unauthenticated.
    if (!this.authenticated) {
      await this.keycloak.login({
        redirectUri: window.location.origin + state.url
      });
    }

    const userRoles = this.userInfo.systemProfile?.roles ?? [];

    // Get the roles required from the route.
    const requiredRole = route.data['role'];

    // Allow the user to proceed if no additional roles are required to access the route.
    if (!requiredRole) {
      return true;
    }

    // Allow the user to proceed if all the required roles are present.
    userRoles.includes(requiredRole);
    return true;
  }
}
