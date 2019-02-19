import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MycommonModule } from '../mycommon/mycommon.module';
import { RouterModule, Routes} from '@angular/router';
import { AlarmStatisticsComponent } from '../../components/alarm-statistics/alarm-statistics.component';
import { PushStatisticsComponent } from '../../components/push-statistics/push-statistics.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';

const routes: Routes = [
  {path: '', component: AlarmStatisticsComponent},
  { path: 'pushStatistics', component: PushStatisticsComponent}
];
@NgModule({
  imports: [
    CommonModule,
    MycommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    AlarmStatisticsComponent,
    PushStatisticsComponent
  ]
})
export class StatisticsModule { }
