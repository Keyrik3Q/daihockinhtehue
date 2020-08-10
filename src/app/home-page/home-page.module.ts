import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page.component';
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { LoginCookie } from '../common/core/login-cookie';
import { ApiService } from '../common/api-service/api.service';
import { AuthGuard } from '../common/_helpers';

@NgModule({
    declarations: [
        HomePageComponent,
        MenuComponent,
        FooterComponent,
    ],
    imports: [
        TransferHttpCacheModule,
        CommonModule,
        RouterModule.forChild([
            {
                path: '', component: HomePageComponent, children: [
                    {
                        path: '',
                        loadChildren: () => import('./content/content.module').then(m => m.ContentModule),
                        canActivate: [AuthGuard],
                    },
                ],
            }
        ]),

    ],
    providers: [LoginCookie, ApiService]
})
export class HomePageModule { }
