import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MycommonModule } from '../../modules/mycommon/mycommon.module';
import { RouterModule, Routes } from '@angular/router';
import { SystemUserGroupAddComponent } from '../../components/system-user-group-add/system-user-group-add.component';
import { SystemUserGroupListComponent } from '../../components/system-user-group-list/system-user-group-list.component';
import {  SystemUserGroupEditComponent } from '../../components/system-user-group-edit/system-user-group-edit.component';

const routes: Routes = [
    { path: '', component: SystemUserGroupListComponent},
    { path: 'add', component: SystemUserGroupAddComponent},
    { path: 'edit/:id', component:  SystemUserGroupEditComponent}
]

@NgModule({
  imports: [
    CommonModule,
    MycommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
      SystemUserGroupAddComponent,
      SystemUserGroupListComponent,
      SystemUserGroupEditComponent
  ]
})
export class SystemUserGroupModule { }
