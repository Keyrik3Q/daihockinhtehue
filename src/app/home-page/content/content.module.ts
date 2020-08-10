import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentComponent } from './content.component';
import { RouterModule } from '@angular/router';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { ApiService } from '../../common/api-service/api.service';
import { GManageFileModule } from './g-manage-file/g-manage-file.module'; 



@NgModule({
  declarations: [ContentComponent],
  imports: [
    TransferHttpCacheModule,
    CommonModule,
    RouterModule.forChild([
      {
        // ng g module home-page/content/sellTicket --module content
        // ng g c home-page/content/sellTicket
        path: '',
        component: ContentComponent,
        children: [ 
          {
            path: 'h1-change-pass-word',
            loadChildren: () =>
              import('./h1-change-pass-word/h1-change-pass-word.module').then(m => m.H1ChangePassWordModule)
          },
          {
            path: 'a1-system-menu',
            loadChildren: () =>
              import('./a1-system-menu/a1-system-menu.module').then(
                m => m.A1SystemMenuModule
              )
          },
          {
            path: 'a2-setting-website',
            loadChildren: () =>
              import('./a2-setting-website/a2-setting-website.module').then(
                m => m.A2SettingWebsiteModule
              )
          },
          {
            path: 'a3-system-function',
            loadChildren: () =>
              import('./a3-system-function/a3-system-function.module').then(
                m => m.A3SystemFunctionModule
              )
          },
          {
            path: 'a4-manager-member',
            loadChildren: () =>
              import('./a4-manager-member/a4-manager-member.module').then(
                m => m.A4ManagerMemberModule
              )
          },
          {
            path: 'a5-define-position',
            loadChildren: () =>
              import('./a5-define-position/a5-define-position.module').then(
                m => m.A5DefinePositionModule
              )
          },
          {
            path: 'a6-manager-website',
            loadChildren: () =>
              import('./a6-manager-website/a6-manager-website.module').then(
                m => m.A6ManagerWebsiteModule
              )
          },
          {
            path: 'a7-manager-interface',
            loadChildren: () =>
              import('./a7-manager-interface/a7-manager-interface.module').then(
                m => m.A7ManagerInterfaceModule
              )
          },
          {
            path: 'a8-manager-banner',
            loadChildren: () =>
              import('./a8-manager-banner/a8-manager-banner.module').then(
                m => m.A8ManagerBannerModule
              )
          },
          {
            path: 'b1-manager-post',
            loadChildren: () =>
              import('./b1-manager-post/b1-manager-post.module').then(
                m => m.B1ManagerPostModule
              )
          },
          {
            path: 'b2-manager-news-notice',
            loadChildren: () =>
              import(
                './b2-manager-news-notice/b2-manager-news-notice.module'
              ).then(m => m.B2ManagerNewsNoticeModule)
          },
          {
            path: 'b3-manager-text-document',
            loadChildren: () =>
              import(
                './b3-manager-text-document/b3-manager-text-document.module'
              ).then(m => m.B3ManagerTextDocumentModule)
          },
          {
            path: 'c1-manager-album',
            loadChildren: () =>
              import('./c1-manager-album/c1-manager-album.module').then(
                m => m.C1ManagerAlbumModule
              )
          },
          {
            path: 'c2-manager-image',
            loadChildren: () =>
              import('./c2-manager-image/c2-manager-image.module').then(
                m => m.C2ManagerImageModule
              )
          },
          {
            path: 'd1-manager-support-online',
            loadChildren: () =>
              import(
                './d1-manager-support-online/d1-manager-support-online.module'
              ).then(m => m.D1ManagerSupportOnlineModule)
          },
          {
            path: 'd2-manager-info-contact',
            loadChildren: () =>
              import(
                './d2-manager-info-contact/d2-manager-info-contact.module'
              ).then(m => m.D2ManagerInfoContactModule)
          },
          {
            path: 'd3-link-website',
            loadChildren: () =>
              import('./d3-link-website/d3-link-website.module').then(
                m => m.D3LinkWebsiteModule
              )
          },
          {
            path: 'd4-manager-contact-suggest',
            loadChildren: () =>
              import(
                './d4-manager-contact-suggest/d4-manager-contact-suggest.module'
              ).then(m => m.D4ManagerContactSuggestModule)
          },
          {
            path: 'd5-questionnaire',
            loadChildren: () =>
              import('./d5-questionnaire/d5-questionnaire.module').then(
                m => m.D5QuestionnaireModule
              )
          },
          {
            path: 'e1-area-link',
            loadChildren: () =>
              import('./e1-area-link/e1-area-link.module').then(
                m => m.E1AreaLinkModule
              )
          },
          {
            path: 'e2-link',
            loadChildren: () =>
              import('./e2-link/e2-link.module').then(m => m.E2LinkModule)
          },
          {
            path: 'f1-carlender-work',
            loadChildren: () =>
              import('./f1-carlender-work/f1-carlender-work.module').then(
                m => m.F1CarlenderWorkModule
              )
          }

          // {
          //     path: 'home',
          //     loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
          // },
        ]
      }
    ]),
    GManageFileModule
    // MatDialogModule,
    // MatCardModule,
  ],
  providers: [ApiService],
  entryComponents: []
})
export class ContentModule {}
