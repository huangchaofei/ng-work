import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MycommonModule } from '../../modules/mycommon/mycommon.module';
import { RouterModule, Routes } from '@angular/router';
import { StationListComponent } from '../../components/station-list/station-list.component';
import { StationAddComponent } from '../../components/station-add/station-add.component';
import { StationEditComponent } from '../../components/station-edit/station-edit.component';
import { DeviceGroupDetailComponent } from '../../components/device-group-detail/device-group-detail.component';

const routes: Routes = [
    {path: '', component: StationListComponent},
    {path: 'add', component: StationAddComponent},
    {path: 'edit/:id', component: StationEditComponent},
    {path: 'detail/:id', component: DeviceGroupDetailComponent}
]

@NgModule({
  imports: [
    CommonModule,
    MycommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
      StationListComponent,
      StationAddComponent,
      StationEditComponent,
      DeviceGroupDetailComponent
  ]
})
export class StationModule { }
