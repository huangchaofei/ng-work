import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MycommonModule } from '../../modules/mycommon/mycommon.module';
import { RouterModule, Routes } from '@angular/router';
import { EnterpriseListComponent } from '../../components/enterprise-list/enterprise-list.component';
import { EnterpriseAddComponent } from '../../components/enterprise-add/enterprise-add.component';
import { EnterpriseEditComponent } from '../../components/enterprise-edit/enterprise-edit.component';

const routes: Routes = [
    { path: '', component: EnterpriseListComponent},
    { path: 'add', component: EnterpriseAddComponent},
    { path: 'edit/:id', component: EnterpriseEditComponent}
]
@NgModule({
  imports: [
    CommonModule,
    MycommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
      EnterpriseListComponent,
      EnterpriseAddComponent,
      EnterpriseEditComponent
  ]
})
export class EnterpriseModule { }
