import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService, zh_CN } from 'ng-zorro-antd';
import { DeviceService } from '../../services/device.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ChooseAddressComponent } from '../../directive/choose-address/choose-address.component';
import { ChooseEnterpriseComponent } from '../../directive/choose-enterprise/choose-enterprise.component';
import { Observable } from 'rxjs'
declare var AMap: any;

@Component({
  selector: 'app-device-edit',
  templateUrl: './device-edit.component.html',
  styleUrls: ['./device-edit.component.css']
})
export class DeviceEditComponent implements OnInit {
  @ViewChild(ChooseAddressComponent)
  choose_address: ChooseAddressComponent;
  bodyStyle = {'width':'1000px','height':'660px'};
  isVisible = false;
  editForm;
  longitude;
  deviceInfo = {
      device_name:'',
      device_number:'',
      number_define: '',
      station_id:'',
      address:'',
      longitude:'',
      latitude:'',
      device_type:'',
      device_remarks:'',
      provider:'',
      province_id:'0',
      city_id:'0',
      district_id:'0',
      province:'',
      city:'',
      district:''
  }
  constructor(private deviceService: DeviceService, 
              private router: Router, 
              private routerInfo: ActivatedRoute,
              private message: NzMessageService
    ) { }

  ngOnInit() {
      this.getDeviceDetail()
  }
  getDeviceDetail() {
      const condition = {
          id : this.routerInfo.snapshot.params.id
      }
      this.deviceService.get(condition).subscribe((res)=>{
          console.log(res)
          this.deviceInfo = res['data']
          this.choose_address.provinceOption = {id:this.deviceInfo.province_id,name:this.deviceInfo.province};
          this.choose_address.cityOption = {id:this.deviceInfo.city_id,name:this.deviceInfo.city};
          this.choose_address.districtOption = {id:this.deviceInfo.district_id,name:this.deviceInfo.district};
          this.longitude = this.deviceInfo.longitude + ',' + this.deviceInfo.latitude

      })
  }
  submit(form) {
      console.log(form)
      if(form.value.device_name === ''){
          this.message.warning('请输入设备名称')
          return false
      }
      if(form.value.device_number === ''){
          this.message.warning('请输入设备串号')
          return false
      }
      if(form.value.station_id === ''){
          this.message.warning('请选择归属区域')
          return false
      }
      if(!this.choose_address.provinceOption || this.choose_address.provinceOption.name == '全部'){
          this.message.warning('请选择省份')
          return false
      }
      if(!this.choose_address.cityOption || this.choose_address.cityOption.name == '全部'){
          this.message.warning('请选择城市')
          return false
      }
      if(!this.choose_address.districtOption || this.choose_address.districtOption.name == '全部'){
          this.message.warning('请选择区县')
          return false
      }
      if(form.value.address === ''){
          this.message.warning('请输入详细地址')
          return false
      }
      if(form.value.device_remarks === ''){
          this.message.warning('请输入类型说明')
          return false
      }
      if(this.deviceInfo.longitude === ''){
        this.message.warning('请选择经纬度')
        return false
      }
      const arr = this.deviceInfo.longitude.split(',')
      const condition = form.value
      condition.id = this.routerInfo.snapshot.params.id;
      condition.province_id = this.choose_address.provinceOption.id;
      condition.city_id = this.choose_address.cityOption.id;
      condition.district_id = this.choose_address.districtOption.id;
      condition.province = this.choose_address.provinceOption.name;
      condition.city = this.choose_address.cityOption.name;
      condition.district = this.choose_address.districtOption.name;
      condition.longitude = arr[0];
      condition.latitude = arr[1];
      this.deviceService.update(condition).subscribe((res)=>{
          console.log(res)
          if(res['code'] === 0){
              this.router.navigate(['/device'])
          }
      })
  }
  getMap() {
    const that = this
    this.isVisible = true
    const map = new AMap.Map("container", {
        resizeEnable: true,
        zoom: 12, //初始地图级别
        center: [121.498586, 31.239637], //初始地图中心点
    });
    //为地图注册click事件获取鼠标点击出的经纬度坐标
    const clickEventListener = map.on('click', function(e) {
        const lng = e.lnglat.lng,
              lat = e.lnglat.lat
        that.longitude = lng + ',' + lat
    });
    function select(e) {
        if (e.poi && e.poi.location) {
            map.setZoom(15);
            map.setCenter(e.poi.location);
        }
    }
  }
  handleOk() {
      this.isVisible = false
      this.deviceInfo.longitude = this.longitude
  }
  handleCancel() {
      this.isVisible = false
  }
}
