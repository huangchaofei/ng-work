import { Component, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { NzMessageService , zh_CN } from 'ng-zorro-antd';
import { DeviceService } from '../../services/device.service';
import { DictService } from '../../services/dict.service';
import { EnterpriseService } from '../../services/enterprise.service';
import { ChooseAddressComponent } from '../../directive/choose-address/choose-address.component';
import { Observable, of, fromEvent } from 'rxjs';
import { delay, debounceTime } from 'rxjs/operators'
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
declare var AMap: any;
@Component({
  selector: 'app-device-add',
  templateUrl: './device-add.component.html',
  styleUrls: ['./device-add.component.css']
})
export class DeviceAddComponent implements OnInit, OnChanges {
  name = '';
  provinceOption = {id:0,name:''}
  @ViewChild(ChooseAddressComponent)
  choose_address: ChooseAddressComponent
  station_id;
  isVisible = false
  bodyStyle = {'width':'1000px','height':'660px'};
  lng;
  lat;
  longitude;
  info = {
      type:'1',
      device_remarks:'独立式烟雾报警器',
      longitude:'',
      provider:'库存设备',
      address:'',
      manufacturer_id:'',
      mapAddress: '',
      open_used_at: ''
  }
  station;
  manufacturer = [];
  addressList = [];
  constructor(private deviceService: DeviceService, 
              private message: NzMessageService, 
              private router: Router,
              private routerInfo: ActivatedRoute,
              private dictService: DictService,
              private enterpriseService: EnterpriseService) { }

  ngOnInit() {
    this.searchType();
    this.searchManufacturer();
  }
  ngOnChanges(value: SimpleChanges){
    console.log(value)
  }
  ngAfterViewInit(){
      const input = document.getElementById('input')
      fromEvent(input,'keyup').pipe(
          debounceTime(1000)
      ).subscribe((event:any)=>{
          let val = event.target.value
          this.getCity(val);
      })
  }
  searchManufacturer(){
    const condition = {
      type:'manufacturer',
      query:'',
      limit:999,
      offset:0
    }
    this.dictService.search(condition).subscribe((res)=>{
      this.manufacturer = res['data']
    })
  }
  stationChange($event){
      console.log($event)
      this.longitude = $event.longitude+','+$event.latitude;
      this.choose_address.provinceOption = {id:$event.province_id,name:$event.province}
      this.choose_address.cityOption = {id:$event.city_id,name:$event.city}
      this.choose_address.districtOption = {id:$event.district_id,name:$event.district}
      this.info.address = $event.address
  }
  searchType(){
    // 获取路由参数设置设备类型
    const type = this.routerInfo.snapshot.params.type
    console.log(type)
    switch (type) {
      case "1":
        this.info.type = String(type);
        this.info.device_remarks = '独立式烟雾报警器';
        break;
      case "2":
        this.info.type = String(type);
        this.info.device_remarks = 'Nb-IoT智能井盖';
        break;
      case "3":
        this.info.type = String(type);
        this.info.device_remarks = "门磁感应检测";
        break;
      case "4":
        this.info.type = String(type);
        this.info.device_remarks = "智能锁";
        break;
      case "5":
        this.info.type = String(type);
        this.info.device_remarks = "故障指示";
        break;
    }
  }
  map:any;
  getMap() {
    const that = this
    this.isVisible = true
    this.map = new AMap.Map("container", {
        resizeEnable: true,
        zoom: 12, //初始地图级别
        center: [121.498586, 31.239637], //初始地图中心点
    });
    //为地图注册click事件获取鼠标点击出的经纬度坐标
    const clickEventListener = this.map.on('click', function(e) {
        const lng = e.lnglat.lng,
              lat = e.lnglat.lat
        console.log(lng + ':' + lat)
        that.lng = lng
        that.lat = lat
        that.longitude = lng + ',' + lat
    });
    function select(e) {
        if (e.poi && e.poi.location) {
            this.map.setZoom(15);
            this.map.setCenter(e.poi.location);
        }
    }
  }
  handleOk() {
      this.isVisible = false
      this.info.longitude = this.longitude;
  }
  handleCancel() {
      this.isVisible = false
  }
  canCel(){
    switch (this.info.type) {
      case "1":
        this.router.navigate(['/device/smoke'])
        break;
      case "2":
        this.router.navigate(['/device/wellCover'])
        break;
      case "3":
        this.router.navigate(['/device/door'])
        break;
      case "4":
        this.router.navigate(['/device/lock'])
        break;
      case "5":
        this.router.navigate(['/device/monitor'])
        break;
      default:
        this.router.navigate(['/device'])
        break;
    }
  }
  submit(form){
      console.log(form.value);
      if(form.value.device_name === ''){
          this.message.warning('请输入设备名称')
          return false
      }
      if(form.value.device_number === ''){
          this.message.warning('请输入出厂编号')
          return false
      }
      if(form.value.station_id == undefined){
          this.message.warning('请选择归属设备组')
          return false
      }
      if(form.value.manufacturer_id == ''){
        this.message.warning('请选择供应商');
        return false;
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
      if(form.value.address == ''){
          this.message.warning('请输入详细地址')
          return false
      }
      if(this.longitude === ''){
        this.message.warning('请选择经纬度')
        return false
      }
      const arr = this.longitude.split(',')
      const value = form.value
      let condition:any = {
          device_name: value.device_name,
          device_number:value.device_number,
          number_define: value.number_define,
          station_id:value.station_id.id,
          address:value.address,
          device_remarks:value.device_remarks,
          device_type:value.device_type,
          provider:value.provider,
          manufacturer_id:value.manufacturer_id,
          open_used_at:value.open_used_at !== '' ? moment(value.open_used_at).format('YYYY-MM-DD') : ''
      }
      condition.province_id = this.choose_address.provinceOption.id;
      condition.city_id = this.choose_address.cityOption.id;
      condition.district_id = this.choose_address.districtOption.id;
      condition.province = this.choose_address.provinceOption.name;
      condition.city = this.choose_address.cityOption.name;
      condition.district = this.choose_address.districtOption.name;
      condition.longitude = arr[0];
      condition.latitude = arr[1];
      console.log(form)
      this.deviceService.add(condition).subscribe((res)=>{
          console.log(res)
          if(res['code']===0){
              this.message.success('创建成功')
              switch (this.info.type) {
                case "1":
                  this.router.navigate(['/device/smoke'])
                  break;
                case "2":
                  this.router.navigate(['/device/wellCover'])
                  break;
                case "3":
                  this.router.navigate(['/device/door'])
                  break;
                case "4":
                  this.router.navigate(['/device/lock'])
                  break;
                case "5":
                  this.router.navigate(['/device/monitor'])
                  break;
                default:
                  this.router.navigate(['/device'])
                  break;
              }
          }
      })
  }
  showDropdownFlag = false;
  getCity(val){
      if(val == '') {
          this.showDropdownFlag = false;
          return false
      }
      const condition = {
          query: val
      }
      this.enterpriseService.address(condition).subscribe((res)=>{
          this.addressList = res['data'];
          if(this.addressList.length > 0){
              this.showDropdownFlag = true;
          }
      })
  }
  clickAddress(address){
      let longitude = [address.longitude,address.latitude]
      this.map.setZoom(15);
      this.map.setCenter(longitude);
      this.showDropdownFlag = false;
  }
}

