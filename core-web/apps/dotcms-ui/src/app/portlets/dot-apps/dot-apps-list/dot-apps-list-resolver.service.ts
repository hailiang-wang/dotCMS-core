import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { DotLicenseService } from '@dotcms/data-access';
import { map, mergeMap, take } from 'rxjs/operators';
import { DotAppsService } from '@dotcms/app/api/services/dot-apps/dot-apps.service';
import { DotAppsListResolverData, DotApps } from '@dotcms/dotcms-models';

/**
 * Returns apps list from the system
 *
 * @export
 * @class DotAppsListResolver
 * @implements {Resolve<DotApps[]>}
 */
@Injectable()
export class DotAppsListResolver implements Resolve<DotAppsListResolverData> {
    constructor(
        private dotLicenseService: DotLicenseService,
        private dotAppsService: DotAppsService
    ) {}

    resolve(
        _route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<DotAppsListResolverData> {
        return this.dotLicenseService.canAccessEnterprisePortlet(state.url).pipe(
            take(1),
            mergeMap((enterpriseLicense: boolean) => {
                if (enterpriseLicense) {
                    return this.dotAppsService.get().pipe(
                        take(1),
                        map((apps: DotApps[]) => {
                            return {
                                isEnterpriseLicense: enterpriseLicense,
                                apps: apps
                            };
                        })
                    );
                }

                return of({
                    isEnterpriseLicense: false,
                    apps: []
                });
            })
        );
    }
}
