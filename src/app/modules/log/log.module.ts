import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MycommonModule} from '../../modules/mycommon/mycommon.module';
import { RouterModule, Routes } from '@angular/router';
import { LogComponent } from '../../components/log/log.component';
// import { NgZorroAntdModule } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
registerLocaleData(zh);

const routes: Routes = [
  { path: '', component: LogComponent}
];
@NgModule({
  imports: [
    CommonModule,
    MycommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    LogComponent
  ]
})
export class LogModule { }
