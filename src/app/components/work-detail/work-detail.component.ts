import { Component, OnInit, AfterViewInit } from '@angular/core';
import { WorkService } from '../../services/work.service';
import { DeviceService } from '../../services/device.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { NgForm } from '@angular/forms';
declare var AMap:any;
@Component({
  selector: 'app-work-detail',
  templateUrl: './work-detail.component.html',
  styleUrls: ['./work-detail.component.css']
})
export class WorkDetailComponent implements OnInit, AfterViewInit {
  constructor(private workeService: WorkService,
              private deviceService: DeviceService,
              private routerInfo: ActivatedRoute,
              private message: NzMessageService) { }

  ngOnInit() {
     this.getDetail();
  }

  ngAfterViewInit() {
    this.map = new AMap.Map('map',{
        resizeEnable: true,
        zoom:17
    });
  }
  isVisible = false;
  Detail = {
      id:0,
      device_id:'',
      device_name:'',
      device_number:'',
      warning_content:'',
      longitude:'',
      latitude:'',
      records:[],
      warn_status:2
  }
  map;
  isSpinning = false;
  getDetail(){
      const condition = {
          id: this.routerInfo.snapshot.params.id
      }
      this.workeService.get(condition).subscribe((res)=>{
          console.log(res)
          this.Detail = res['data']
          const longitude = [this.Detail.longitude,this.Detail.latitude]
          const marker = new AMap.Marker({
              position: longitude,
              map: this.map
          }); 
          this.map.setCenter(longitude);
      })
  }
  // 解锁
  deal(){
      this.isVisible = true;
  }
  //确认处理
  handleOk(form: NgForm){
      console.log(form)
      const condition = {
          id: this.Detail.id,
          deal_remark: form.value.deal_remark
      }
      this.isSpinning = true;
      this.workeService.detail(condition).subscribe((res)=>{
          this.isSpinning = false;
          this.message.success('处理成功');
          this.isVisible = false;
          form.resetForm();
          this.getDetail();
      })
  }
  // 取消处理
  handleCancel(form:NgForm){
      this.isVisible = false;
      form.resetForm();
  }
}
