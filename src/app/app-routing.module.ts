import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { LoginComponent } from './components/login/login.component';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { MapComponent } from './components/map/map.component';
import { FullMapComponent } from './components/full-map/full-map.component';
import { WorkerMapComponent } from './components/worker-map/worker-map.component';

const routes: Routes = [
    { path: '', redirectTo: '/map', pathMatch: 'full'},
    { path: 'login', loadChildren: './modules/login/login.module#LoginModule'},
    { path: '', component: MainComponent, children: [
        // { path: 'index', component: IndexComponent },
        { path: 'map', component: MapComponent },
        { path: 'station', loadChildren: './modules/station/station.module#StationModule'},
        { path: 'enterprise', loadChildren: './modules/enterprise/enterprise.module#EnterpriseModule'},
        { path: 'systemUser', loadChildren: './modules/system-user/system-user.module#SystemUserModule'},
        { path: 'systemUserGroup', loadChildren: './modules/system-user-group/system-user-group.module#SystemUserGroupModule'},
        { path: 'device', loadChildren: './modules/device/device.module#DeviceModule'},
        { path: 'deviceGroup', loadChildren: './modules/device-group/device-group.module#DeviceGroupModule'},
        { path: 'work', loadChildren: './modules/work/work.module#WorkModule'},
        { path: 'log', loadChildren: './modules/log/log.module#LogModule'},
        { path: 'statistics', loadChildren: './modules/statistics/statistics.module#StatisticsModule'},
        { path: 'workMap', component: WorkerMapComponent}
    ]},
    { path: 'bigMap', component: FullMapComponent},
    { path: 'rights', loadChildren: './modules/rights/rights.module#RightsModule'}
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
