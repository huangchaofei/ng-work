import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService, zh_CN } from 'ng-zorro-antd';
import { Router, ActivatedRoute, Params } from '@angular/router';
import  * as moment  from 'moment';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { ChooseEnterpriseComponent } from '../../directive/choose-enterprise/choose-enterprise.component';
import { ChooseAddressComponent } from '../../directive/choose-address/choose-address.component';
import { StationService } from '../../services/station.service';
import { DictService } from '../../services/dict.service';
declare var AMap:any;
@Component({
  selector: 'app-station-edit',
  templateUrl: './station-edit.component.html',
  styleUrls: ['./station-edit.component.css']
})
export class StationEditComponent implements OnInit {
  @ViewChild(ChooseAddressComponent)
  choose_address: ChooseAddressComponent;

  @ViewChild('chooseEnterpriseChild')
  child: ChooseEnterpriseComponent;
  parent_provinceOption = null
  //经纬度弹窗
  isVisible:boolean = false;
  // 设备组所属人modal
  isVisibleUser = false;
  bind_user_id = '';
  bind_user = [];
  enterprise = {
    parent_id: ''
  };
  enterprises = [];
  bodyStyle = {'width':'1000px','height':'660px'};
  lng = '';
  lat = '';
  longitude = '';
  info = {
      station_name: '',
      address:'',
      status: '1',
      contacts:'',
      remarks: '',
      phone:'',
      longitude:'',
      latitude:'',
      open_forbin_date:null,
      dateRange: [],
      province_id: undefined,
      city_id: undefined,
      district_id: undefined,
      province: undefined,
      city: undefined,
      district: undefined,
      show_map: false,
      lng:null,
      lat:null
  }
  constructor(private message: NzMessageService, 
              private stationService: StationService, 
              private dictService: DictService, 
              private router: Router,
              private routerInfo: ActivatedRoute) { 
                  registerLocaleData(zh);
                  console.log('父组件执行')
                  this.getEnterpriseDetail()
              }

  ngOnInit() {
    const that = this;
    Object.defineProperty(this.enterprise, 'parent_id', {
      get: function() {
        return this._parent_id;
      },
      set: function(newValue) {
        this._parent_id = newValue;
        console.log(that.enterprise.parent_id);
        if(newValue === ''){
           that.bind_user = []
        }else{
          const condition = {
               type:'systemuser',
               enterprise_id:that.enterprise.parent_id
          }
          that.dictService.search(condition).subscribe((res)=>{
              console.log(res)
              that.bind_user = res['data']
          })
        }
      }
    });
    this.getEnterprise()
    this.renderMap()
  }
  // 选择归属公司
  chooseEnterprise() {
    console.log(this.child);
    this.child.showModal();
    console.log(this.enterprise.parent_id);
  }
  // 选择设备组所属人
  chooseUser(){
      if(this.enterprise.parent_id === '' || this.enterprise.parent_id === undefined){
          this.message.error('请先选择归属公司')
          return false
      }
      this.isVisibleUser = true
  }
  getEnterpriseDetail() {
      const condition = {
          id: this.routerInfo.snapshot.params['id']
      }
      this.stationService.get(condition).subscribe((res) => {
          console.log(res);
          const station = res['data'];
          // const arr:Array<any> = station.longitude.split(',');
          this.enterprise.parent_id = station.enterprise_id;
          this.bind_user_id = station.bind_user_id;
          this.info.station_name = station.name;
          this.choose_address.provinceOption = {id:station.province_id,name:station.province};
          this.choose_address.cityOption = {id:station.city_id,name:station.city};
          this.choose_address.districtOption = {id:station.district_id,name:station.district};
          this.info.address = station.address;
          this.info.contacts = station.contacts;
          this.info.phone = station.phone;
          // this.info.open_forbin_date = station.open_forbin_date;
          this.info.status = station.status;
          this.info.remarks = station.remarks;
          // this.info.latitude = station.latitude;
          this.info.longitude = station.longitude + ',' + station.latitude;
          this.info.lng = station.longitude;
          this.info.lat = station.latitude;
          console.log(this.choose_address)
      })
  }
  //初始化时先获取可以选择的归属公司
  getEnterprise() {
      const condition = {
          type:'enterprise',
          query:'',
          limit:999,
          offset:0
      }
      this.dictService.search(condition).subscribe((res) =>{
          console.log(res['data'])
          this.enterprises = res['data']
      })
  }
  // 获得子件组传递的公司id
  getEnterpriseId($event) {
    console.log($event);
    if($event.type){
      this.enterprises = $event.data
    }else{
      this.enterprise.parent_id = $event;
    }
  }

  // 更改时间
  onChange(result: Date): void {
    console.log(moment(result).format('YYYY-MM-DD'))
    this.info.open_forbin_date = moment(result).format('YYYY-MM-DD')
  }

  submit() {
    console.log(this.enterprise.parent_id);
    if (this.enterprise.parent_id === '' || this.enterprise.parent_id === undefined) {
      this.message.warning('请选择归属公司');
      return false;
    }
    if(this.bind_user_id === '' || this.bind_user_id === undefined){
        this.message.warning('请选择设备组所属人');
        return false;
    }
    if (this.info.station_name === '') {
      this.message.warning('请输入站点名称');
      return false;
    }
    if(this.choose_address.provinceOption.id === undefined){
        this.message.warning('请选择省份')
        return false
    }
    if(this.choose_address.cityOption.id === undefined){
        this.message.warning('请选择市')
        return false
    }
    if(this.choose_address.districtOption.id === undefined){
        this.message.warning('请选择区县')
        return false
    }
    if(this.info.contacts === ''){
        this.message.warning('请输入联系人')
        return false
    }
    if(this.info.phone === ''){
        this.message.warning('请输入联系电话')
        return false
    }
    // if(this.info.remarks === ''){
    //     this.message.warning('请输入备注')
    //     return false
    // }
    // if(this.info.open_forbin_date === null){
    //     this.message.warning('请选择投入使用时间')
    //     return false
    // }
    // if(this.info.longitude == ''){
    //     this.message.warning('请选择经纬度')
    //     return false
    // }
    const arr = this.info.longitude.split(',')
    const condition = {
        id: this.routerInfo.snapshot.params['id'],
        enterprise_id:this.enterprise.parent_id,
        bind_user_id:this.bind_user_id,
        name:this.info.station_name,
        province_id:this.choose_address.provinceOption.id,
        city_id:this.choose_address.cityOption.id,
        district_id:this.choose_address.districtOption.id,
        province:this.choose_address.provinceOption.name,
        city:this.choose_address.cityOption.name,
        district:this.choose_address.districtOption.name,
        address:this.info.address,
        // longitude:arr[0],
        // latitude:arr[1],
        contacts:this.info.contacts,
        phone:this.info.phone,
        remarks:this.info.remarks,
        status:this.info.status,
        // open_forbin_date:this.info.open_forbin_date
    }
    this.stationService.update(condition).subscribe((data)=>{
        console.log(data)
        const that = this
        if(data['code'] == 0){
            this.message.success('更新成功')
            that.router.navigate(['/station'])
        }
    })
  }
  renderMap() {
    
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
        console.log(lng + ':' + lat)
        that.lng = lng;
        that.lat = lat;
        that.longitude = lng + ',' + lat
        // document.getElementById("lnglat")['value'] = e.lnglat.getLng() + ',' + e.lnglat.getLat()
    });
    // const auto = new AMap.Autocomplete({
    //     input: "tipinput"
    // });
    // AMap.event.addListener(auto, "select", select);
    function select(e) {
        if (e.poi && e.poi.location) {
            map.setZoom(15);
            map.setCenter(e.poi.location);
        }
    }
  }
  handleOk() {
      this.isVisible = false
      this.info.longitude = this.longitude
      const arr = this.longitude.split(',');
      this.info.lng =arr[0];
      this.info.lat =arr[1];
  }
  handleCancel() {
      this.isVisible = false
  }
  bindUserCancel(){
    this.bind_user_id = '';
    this.isVisibleUser = false;
  }
  bindUserOk(){
    this.isVisibleUser = false;
  }
  
}
