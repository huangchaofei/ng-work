import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MycommonModule } from '../../modules/mycommon/mycommon.module';
import { DeviceGroupComponent } from '../../components/device-group/device-group.component';

const routes: Routes = [
    { path:'', component: DeviceGroupComponent}
]

@NgModule({
  imports: [
    CommonModule,
    MycommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
      DeviceGroupComponent
  ]
})
export class DeviceGroupModule { }
