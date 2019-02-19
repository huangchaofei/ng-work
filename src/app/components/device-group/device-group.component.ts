import { Component, OnInit } from '@angular/core';
import { SystemUserService } from '../../services/system-user.service';
import { DeviceGroupService } from '../../services/device-group.service';
import { DictService } from '../../services/dict.service';
import { NzMessageService, zh_CN } from 'ng-zorro-antd';
import G2 from '@antv/g2';
@Component({
  selector: 'app-device-group',
  templateUrl: './device-group.component.html',
  styleUrls: ['./device-group.component.css']
})
export class DeviceGroupComponent implements OnInit {
  left_systemUserId;
  right_systemUserId;
  left_systemUser;
  right_systemUser;
  constructor(private systemUserService: SystemUserService, 
              private deviceGroupService: DeviceGroupService,
              private dictService : DictService,
              private message: NzMessageService) { }

  ngOnInit() {
      // 图表
    this.chart = new G2.Chart({
      container: 'c2',
      forceFit: true,
      height: 300
    });
    this.chart.source(this.user_list);
    this.chart.interval().position('name*设备数量');
    this.chart.render();

    this.searchUser();
    this.searchSystem();
    this.searchDevice();
  }
  user_list = []
  chart;
  searchUser(){
      this.systemUserService.statistics().subscribe((res)=>{
          this.user_list = res['data']
          const arr = [];
          for(var i = 0;i < this.user_list.length;i++){
              const key = this.user_list[i].name;
              const value = this.user_list[i].value;
              const obj = {name: key,'设备数量':value}
              arr.push(obj)
          }
          this.chart.changeData(arr)
      })
  }
  systemUser_list = [];
  right_systemUser_list = [];
  chooseStationList = [];
  assign = false;
  assignDevice(){
      this.assign = true;
  }
  cancel(){
      this.assign = false;
  }
  // 确认分配
  confirm(){
      const arr = [];
      for(var i = 0;i<this.chooseStationList.length;i++){
          arr.push(this.chooseStationList[i].id)
      }
      const condition = {
          station_ids: arr,
          bind_user_id: this.right_systemUserId
      }
      this.deviceGroupService.assign(condition).subscribe((res)=>{
          console.log(res)
          if(res['code']===0){
              this.message.success('分配成功')
              this.chooseStationList = [];
              this.searchDevice();
          }
      })
  }
  searchSystem(){
      const condition = {
          type:'systemuser',
          query:'',
          limit:99,
          offset:0
      }
      this.dictService.search(condition).subscribe((res)=>{
          console.log(res)
          this.systemUser_list = res['data']
          this.left_systemUserId = JSON.parse(window.localStorage.getItem('systemInfo')).id;
          const arr = this.systemUser_list.filter((item,index)=>{
              return item.id === this.left_systemUserId
          })
          const enterprise_id = arr[0].enterprise_id;
          this.searchRightSystem(enterprise_id);
      })
  }
  searchRightSystem(ent_id){
      const condition = {
          type:'systemuser',
          enterprise_id:ent_id,
          query:'',
          limit:99,
          offset:0
      }
      this.dictService.search(condition).subscribe((res)=>{
          console.log(res)
          this.right_systemUser_list = res['data']
      })
  }
  // 更改左边系统用户
  changeSystemUser($event){
      this.chooseStationList = [];
      this.info.bind_user_id = $event;
      this.right_systemUserId = '';
      const arr = this.systemUser_list.filter((item,index)=>{
          return item.id === $event
      })
      const enterprise_id = arr[0].enterprise_id;
      this.searchRightSystem(enterprise_id);
      this.searchDevice();
  }
  deviceNumberChange(){
      this.searchDevice();
  }
  info = {
      loading:false,
      bind_user_id:JSON.parse(window.localStorage.getItem('systemInfo')).id,
      query:'',
      order_by:'created_at',
      order:'desc',
      offset:0,
      limit:20,
      total:0
  }
  device_list = [];
  searchDevice(){
      const condition = {
          bind_user_id:this.info.bind_user_id,
          query:this.info.query,
          order_by:this.info.order_by,
          order:this.info.order,
          offset:this.info.offset,
          limit:this.info.limit,
          total:this.info.total
      }
      this.systemUserService.assignSearch(condition).subscribe((res)=>{
          console.log(res)
          this.device_list = res['data']['list'];
          this.info.total = res['data']['total'];
      })
  }
  changeChecked($event,data){
      console.log($event)
      console.log(data)
      if($event === true){
          this.chooseStationList.push(data);
      }else{
          this.chooseStationList.filter((item,index)=>{
              return item.id != data.id
          })
      }
  }
  // 删除所选的设备组
  deleteChoose(data){
      const arr = this.chooseStationList.filter((item,index)=>{
          return item.id != data.id
      })
      this.chooseStationList = arr;
  }
  changePage($event) {
    this.info.offset = ($event - 1) * this.info.limit;
    this.searchDevice();
  }
}
