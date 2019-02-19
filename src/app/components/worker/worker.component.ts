import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { WorkService } from '../../services/work.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-worker',
  templateUrl: './worker.component.html',
  styleUrls: ['./worker.component.css'],
})
export class WorkerComponent implements OnInit {
  info = {
    offset:0,
    limit:20,
    order_by:'uploaded_at',
    order:'desc',
    total:0,
    query: '',
    type: '0'
  }
  warning_list = []
  searchManage(){
    const condition = {
      offset:this.info.offset,
      limit:this.info.limit,
      order_by:this.info.order_by,
      order:this.info.order,
      query:this.info.query,
      type:this.info.type
      // total:this.info.total
    }
    this.workService.manage(condition).subscribe((res)=>{
      console.log(res)
      this.warning_list = res['data']['list'];
      this.info.total = res['data']['total'];
    })
  }
  search(){
      this.searchManage();
  }
  selectWorkStatus = '0';
  selectedValue = '空';
  selectAssign = '山西电网';
  isVisible = false;
  addForm: FormGroup;
  showModal(): void {
    this.isVisible = true;
  }
  handleCancel(): void {
    this.isVisible = false;
  }
  handleOk(): void {
    console.log('123');
  }
  submitForm() {
    console.log(this.addForm.value);
  }

  constructor(private fb: FormBuilder, 
              private workService: WorkService,
              private router: Router) {

  }

  ngOnInit() {
    this.searchManage()
    this.addForm = this.fb.group({
      selectDevice: [null, [Validators.required]],
      selectAssign: [null, [Validators.required]],
      title: [null, [Validators.required]],
      content: [null, [Validators.required]],
    });
  }
  changePage($event){
      console.log($event)
      this.info.offset = ($event - 1) * this.info.limit;
      this.searchManage();
  }
  goDetail(item){
    // [routerLink]="['/work/detail',item.id]"
    const id = item.id
    this.router.navigate(['/work/detail',item.id])
    
  }

}
