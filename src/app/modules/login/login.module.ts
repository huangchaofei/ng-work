import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MycommonModule } from '../../modules/mycommon/mycommon.module';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { LoginComponent } from '../../components/login/login.component';

const routes: Routes = [
  {path: '', component: LoginComponent}
];
@NgModule({
  imports: [
    CommonModule,
    MycommonModule,
    // FormsModule,
    // ReactiveFormsModule,
    // NgZorroAntdModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    LoginComponent
  ]
})
export class LoginModule { }
