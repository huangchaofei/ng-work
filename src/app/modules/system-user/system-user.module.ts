import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MycommonModule } from '../../modules/mycommon/mycommon.module';
import { RouterModule, Routes } from '@angular/router';
import { SystemUserListComponent } from '../../components/system-user-list/system-user-list.component';
import { SystemUserAddComponent } from '../../components//system-user-add/system-user-add.component';
import { SystemUserEditComponent } from '../../components/system-user-edit/system-user-edit.component';

const routes: Routes = [
    { path: '', component: SystemUserListComponent },
    { path: 'add', component: SystemUserAddComponent },
    { path: 'edit/:id', component: SystemUserEditComponent },
    { path: ''}
]

@NgModule({
  imports: [
    CommonModule,
    MycommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
      SystemUserListComponent,
      SystemUserAddComponent,
      SystemUserEditComponent,
  ]
})
export class SystemUserModule { }
