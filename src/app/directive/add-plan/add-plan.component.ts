import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { DeviceService } from '../../services/device.service';
import { DictService } from '../../services/dict.service';

@Component({
  selector: 'app-add-plan',
  templateUrl: './add-plan.component.html',
  styleUrls: ['./add-plan.component.css']
})
export class AddPlanComponent implements OnInit {
  isOperate = false;
  @Input() singleDevice;
  @Output() close: EventEmitter<String> = new EventEmitter<String>();
  constructor(private message: NzMessageService,
              private deviceService: DeviceService,
              private dictService: DictService) { }

  ngOnInit() {
      console.log(this.singleDevice)
        this.searchPushConfigs();
  }
  pushconfigs = [];
  date = [
      {value:'0',label:'0:00'},
      {value:'1',label:'1:00'},
      {value:'2',label:'2:00'},
      {value:'3',label:'3:00'},
      {value:'4',label:'4:00'},
      {value:'5',label:'5:00'},
      {value:'6',label:'6:00'},
      {value:'7',label:'7:00'},
      {value:'8',label:'8:00'},
      {value:'9',label:'9:00'},
      {value:'10',label:'10:00'},
      {value:'11',label:'11:00'},
      {value:'12',label:'12:00'},
      {value:'13',label:'13:00'},
      {value:'14',label:'14:00'},
      {value:'15',label:'15:00'},
      {value:'16',label:'16:00'},
      {value:'17',label:'17:00'},
      {value:'18',label:'18:00'},
      {value:'19',label:'19:00'},
      {value:'20',label:'20:00'},
      {value:'21',label:'21:00'},
      {value:'22',label:'22:00'},
      {value:'23',label:'23:00'}
  ]
  searchPushConfigs(){
      const condition = {
      type:'pushconfig',
      query:'',
      limit:999,
      offset:0
    }
    this.dictService.search(condition).subscribe((res)=>{
      this.pushconfigs = res['data']
    })
  }
  // 单个设备添加工作计划
  addWorkPlan() {
      if(this.singleDevice.cur_interval === ''){
          this.message.warning('请输入心跳间隔')
          return false
      }
      if(!this.singleDevice.open_push){
        if(this.singleDevice.open_type === '' || this.singleDevice.open_type == '0'){
          this.message.warning('请选择开启方式')
          return false
        }
      }
      const condition = {
          id:this.singleDevice.id,
          cur_interval: this.singleDevice.cur_interval,
          open_push:this.singleDevice.open_push === true ? 1 : 0,
          open_type:this.singleDevice.open_type,
          manufacturer_id:this.singleDevice.manufacturer_id,
          push_st:this.singleDevice.push_st,
          push_et:this.singleDevice.push_et
      }
      this.deviceService.heart(condition).subscribe((res)=>{
          if(res['code'] === 0){
              this.message.success('设置成功')
              this.close.emit('ok');
          }
      })
  }
  changeInterval(e){
      console.log(e);
      const val = e.target.value;
      if(val.length > 4){
          e.target.value = val.slice(0,4)
      }
  }
  cancleDevice(){
      this.close.emit('123');
  }
}
