// import { Injectable } from "@angular/core";

// import { CanActivate, CanDeactivate } from "@angular/router/src/utils/preactivation";

// import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";

// @Injectable()
// export class ConfigActivator implements CanActivate, CanDeactivate {
//     component: Object;
//     path: ActivatedRouteSnapshot[];
//     route: ActivatedRouteSnapshot;
//     public constructor(private config: MyConfigService) {
//     }

//     public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
//         this.config.lazyModuleLoaded();
//         return true;
//     }

//     public canDeactivate(component: any, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): boolean {
//         this.config.lazyModuleUnloaded();
//         return true;
//     }
// }


// @Injectable()
// class CanActivateTeam implements CanActivate {
//   constructor(private permissions: Permissions, private currentUser: UserToken) {}

//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
//     return this.permissions.canActivate(this.currentUser, route.params.id);
//   }
// }