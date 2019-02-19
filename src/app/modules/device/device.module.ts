import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MycommonModule } from '../../modules/mycommon/mycommon.module';
import { RouterModule, Routes } from '@angular/router';
import { LockComponent } from '../../components/lock/lock.component';
import { SmokeComponent } from '../../components/smoke/smoke.component';
import { DeviceDoorComponent } from '../../components/device-door/device-door.component';
import { WellCoverComponent } from '../../components/well-cover/well-cover.component';
import { DeviceListComponent } from '../../components/device-list/device-list.component';
import { DeviceAddComponent } from '../../components/device-add/device-add.component';
import { DeviceEditComponent } from '../../components/device-edit/device-edit.component';
import { DeviceMonitorComponent } from '../../components/device-monitor/device-monitor.component';

const routes: Routes = [
  {path: '', component: DeviceListComponent},
  {path: 'wellCover', component: WellCoverComponent},
  {path: 'lock', component: LockComponent},
  {path: 'smoke', component: SmokeComponent},
  {path: 'door', component: DeviceDoorComponent},
  { path: 'add/:type', component: DeviceAddComponent },
  { path: 'edit/:id/', component: DeviceEditComponent},
  { path: 'monitor', component: DeviceMonitorComponent}
];
@NgModule({
  imports: [
    CommonModule,
    MycommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    DeviceListComponent,
    WellCoverComponent,
    LockComponent,
    SmokeComponent,
    DeviceDoorComponent,
    DeviceAddComponent,
    DeviceEditComponent,
    DeviceMonitorComponent
  ]
})
export class DeviceModule { }
