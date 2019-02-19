import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MycommonModule } from '../../modules/mycommon/mycommon.module';
import { RouterModule, Routes } from '@angular/router';
import { RightsAddComponent } from '../../components/rights-add/rights-add.component';

const routes: Routes = [
    { path: 'add', component: RightsAddComponent}
]

@NgModule({
  imports: [
    CommonModule,
    MycommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
      RightsAddComponent
   ]
})
export class RightsModule { }
