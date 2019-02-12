import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main/main.component';
import { SettingComponent } from './setting/setting.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'settings', component: SettingComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  exports: [
    RouterModule,
  ],
  imports: [
    RouterModule.forRoot(routes)
  ]
})
export class AppRoutingModule { }
