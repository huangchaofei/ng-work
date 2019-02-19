import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WorkerComponent } from '../../components/worker/worker.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WorkOrderComponent } from '../../components/work-order/work-order.component';
import { WorkDetailComponent } from '../../components/work-detail/work-detail.component';


const routes: Routes = [
  {path: '', component: WorkerComponent},
  {path:'detail/:id', component: WorkDetailComponent},
  {path: 'Order/:date', component: WorkOrderComponent},
];
@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    WorkerComponent,
    WorkOrderComponent,
    WorkDetailComponent
  ]
})
export class WorkModule { }
