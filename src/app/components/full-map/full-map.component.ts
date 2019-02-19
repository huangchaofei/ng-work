import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IndexService } from '../../services/index.service';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
declare var AMap: any;
import { NzMessageService } from 'ng-zorro-antd';
import { DeviceService } from '../../services/device.service';
import { ChooseAddressComponent } from '../../directive/choose-address/choose-address.component';
import {
  trigger,  // 动画封装触发，外部的触发器
  state, // 转场状态控制
  style, // 用来书写基本的样式
  transition, // 用来实现css3的 transition
  animate, // 用来实现css3的animations
  keyframes // 用来实现css3 keyframes的
} from "@angular/animations";
@Component({
  selector: 'app-full-map',
  templateUrl: './full-map.component.html',
  styleUrls: ['./full-map.component.css'],
  animations: [
      trigger('flyIn', [
      state('hidden', style({right:'-260px'})), // 默认平移0
      state('appera',style({right:'0'})),
      transition('hidden => appera',[
            animate('500ms')
      ]),
      transition('appera => hidden',[
          animate('500ms')
      ])
    ]),
  ]
})
export class FullMapComponent implements OnInit, OnDestroy {

  constructor(private router: Router,
              private indexService: IndexService,
              private deviceService: DeviceService,
              private msg: NzMessageService
      ) { }

  ngOnInit() {
      this.initMap();
      this.search();
      this.searchWarningList();
      this.myInterval();
  }
  ngAfterViewInit(){
        // const input = document.getElementById('input');
        // this.inputChange = fromEvent(input,'keyup').pipe(
        //     debounceTime(1000)
        // )
        // .subscribe((event:any)=>{
        //     this.changeQuery(event.target.value);

        // })
  }
  ngOnDestroy(){
      // this.inputChange.unsubscribe();
      if(this.interval !== undefined){
          clearTimeout(this.interval);
      }
      if(this.map !== undefined){
          this.map.destroy();
      }
  }
  myInterval(){
      this.interval = setTimeout(()=>{
          this.search();
          this.searchWarningList();
          this.myInterval();
      },30*1000)
  }
  @ViewChild('address')
  address: ChooseAddressComponent;
  inputChange;
  map:any;
  interval:any;
  mapInfo = {
      check_num: 0,
      cover_num: 0,
      door_num: 0,
      lock_num: 0,
      normal_num: 0,
      offline_num: 0,
      smoke_num: 0,
      total_num: 0,
      unknown_num: 0,
      warning_num: 0,
      list: []
  }
  stations = [];
  info = {
      // query: '',
      type: [],
      status: [],
      show_search_dropdown: false,
      province_id: 0,
      city_id: 0,
      district_id: 0,
      area: []
  }
  flyIn = 'appera';
  showRight(){
      this.flyIn = this.flyIn == 'appera' ? 'hidden' : 'appera';
  }
  initMap(){
      const systemInfo = JSON.parse(window.localStorage.getItem('systemInfo'));
      console.log(systemInfo);
      this.map = new AMap.Map("map", {
          resizeEnable: true,
          center: [systemInfo.longitude, systemInfo.latitude],
          zoom: 14,
          mapStyle: 'normal',
      });
  }
  // clear(){
  //     this.info.query = '';
  // }
  // 搜索框失去焦点时
  blur(){
      setTimeout(()=>{
          this.info.show_search_dropdown = false
      },200)
  }
  search(){
      this.map.clearMap();
      const condition = {
          // query: this.info.query,
          select_type: this.info.type,
          status: this.info.status,
          province_id: this.info.area.length == 0 ? 0 : this.info.area[0].value,
          city_id: this.info.area.length == 0 ? 0 : this.info.area[1].value,
          district_id: this.info.area.length == 0 ? 0 : this.info.area[2].value
      }
      this.indexService.mapDevice(condition).subscribe((res)=>{
          console.log(res);
          this.mapInfo = res['data'];
          for(let i = 0; i < this.mapInfo.list.length; i++){
              this.addMarker(this.mapInfo.list[i]);
          }
      })
  }
  // 筛选时的查询
  secondSearch(){
      if(this.map !== undefined){
          this.map.clearMap();
      }
      const condition = {
          // query: this.info.query,
          select_type: this.info.type,
          select_status: this.info.status,
          province_id: this.info.area.length == 0 ? 0 : this.info.area[0].value,
          city_id: this.info.area.length == 0 ? 0 : this.info.area[1].value,
          district_id: this.info.area.length == 0 ? 0 : this.info.area[2].value
      }
      this.indexService.mapDevice(condition).subscribe((res)=>{
          console.log(res);
          this.mapInfo = res['data'];
          for(let i = 0; i < this.mapInfo.list.length; i++){
              this.addMarker(this.mapInfo.list[i]);
          }
          if(this.mapInfo.list.length > 0){
              const device = this.mapInfo.list[0];
              this.map.setZoomAndCenter(14,[device.longitude,device.latitude]);
          }
      })
  }
  // 点击不同的设备类型
  isWellCover = false;
  isLock = false;
  isSmoke = false;
  isDoor = false
  isMonitor = false
  typeCondition = '';
  changeType(type){
      // this[type] = this[type] == true ? false : true;
      let arr = [];
      // if(this.isSmoke){
      //     arr.push(1)
      // }
      // if(this.isWellCover){
      //     arr.push(2)
      // }
      // if(this.isDoor){
      //     arr.push(3)
      // }
      // if(this.isLock){
      //     arr.push(4)
      // }
      // if(this.isMonitor){
      //     arr.push(5)
      // }
      if(type == ''){
          arr = []
      }else{
          arr = [Number(type)]
      }
      this.info.type = arr;
      this.secondSearch();
  }
  // 点击不同的设备状态
  isUnknow = false;
  isNormal = false;
  isWarning = false;
  isOutLine = false;
  statusCondition = '';
  changeStatus(status){
      // this[status] = this[status] == true ? false : true;
      let arr = [];
      // if(this.isUnknow){
      //     arr.push(1)
      // }
      // if(this.isNormal){
      //     arr.push(2)
      // }
      // if(this.isWarning){
      //     arr.push(3)
      //     arr.push(4)
      //     arr.push(5)
      // }
      // if(this.isOutLine){
      //     arr.push(6)
      // }
      if(status == ''){
          arr = []
      }
      if(status == 'isUnknow'){
          arr = [1]
      }
      if(status == 'isNormal'){
          arr = [2]
      }
      if(status == 'isWarning'){
          arr = [3,4,5]
      }
      if(status == 'isOutLine'){
          arr.push(6)
      }
      this.info.status = arr;
      // this.search();
      this.secondSearch();
  }
  addressChange($event){
      this.info.province_id= this.info.area.length == 0 ? 0 : this.info.area[0].value;
      this.info.city_id=this.info.area.length == 0 ? 0 : this.info.area[1].value;
      this.info.district_id=this.info.area.length == 0 ? 0 : this.info.area[2].value;
      this.secondSearch();
  }
  // 获取告警列表
  warningList = [];
  searchWarningList(){
      this.indexService.mapWarning().subscribe((res)=>{
          console.log(res);
          this.warningList = res['data']['list'];
      })
  }
  // 点击设备类型跳转
  goDeviceByType(type){
      const condition = {
          province_id: this.info.area.length == 0 ? 0 : this.info.area[0].value,
          city_id: this.info.area.length == 0 ? 0 : this.info.area[1].value,
          district_id: this.info.area.length == 0 ? 0 : this.info.area[2].value,
          select_type:this.info.type,
          select_status: this.info.status,
          click_type:[type],
          click_status: []
      }
      window.localStorage.setItem('mapCondition',JSON.stringify(condition))
      this.router.navigate(['/device'])
  }
  // 点击设备类型跳转
  goDeviceByStatus(status){
      let arr = [];
      if(status == 'normal'){
          arr = [2]
      }
      if(status == 'warning'){
          arr = [3,4,5]
      }
      if(status == 'offline'){
          arr = [6]
      }
      if(status == 'unknow'){
          arr = [1]
      }
      const condition = {
          province_id: this.info.area.length == 0 ? 0 : this.info.area[0].value,
          city_id: this.info.area.length == 0 ? 0 : this.info.area[1].value,
          district_id: this.info.area.length == 0 ? 0 : this.info.area[2].value,
          select_type:this.info.type,
          select_status:this.info.status,
          click_type:[],
          click_status: arr
      }
      window.localStorage.setItem('mapCondition',JSON.stringify(condition))
      this.router.navigate(['/device'])
  }
  // 左上角搜索
  // changeQuery(val){
  //     const condition = {
  //         query: val,
  //         type: [],
  //         status: []
  //     }
  //     this.indexService.mapDevice(condition).subscribe((res)=>{
  //         console.log(res);
  //         this.mapInfo.total_num = res['data']['total_num'];
  //         this.stations = res['data']['list']
  //         if(this.map !== undefined){
  //             this.map.clearMap();
  //         }
  //         for(let i in this.stations){
  //             this.addMarker(this.stations[i]);
  //         }
  //         if(this.stations.length > 0){
  //             this.info.show_search_dropdown = true;
  //         }
  //         if(this.stations.length > 0){
  //             const device = this.stations[0];
  //             this.map.setZoomAndCenter(14,[device.longitude,device.latitude]);
  //         }
  //     })
  // }
  // // 点击搜索出的结果，调整地图层级并重新定位中心点
  // clickStationDropdownList(x){
  //     console.log(x);
  //     this.info.show_search_dropdown = false;
  //     this.info.query = x.device_name;
  //     const longitude = x.longitude;
  //     const latitude = x.latitude;
  //     this.map.setZoomAndCenter(14,[longitude,latitude]);
  // }
  infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
  //添加点标记
  addMarker(device) {
    const longitude = [device.longitude,device.latitude]
    const Device = device;
    const type = device.device_type;
    const type_name = device.device_type_name;
    const status = device.device_status;
    const status_name = device.status_name;
    const id = Device.id;
        let marker;
        switch (type) {
            // 烟感
            case "1":
                marker = new AMap.Marker({
                    position: longitude,
                    map: this.map,
                    icon: status == 3 || status == 4 || status == 5 ?'../../../assets/img/smoke_gj.png':
                          status == 2 || status == 5 ? '../../../assets/img/smoke_zc.png':
                          status == 6 || status == 1 ? '../../../assets/img/smoke_lx.png': '',
                    title: '设备名称:'+device.device_name + '\n' + '状态:'+status_name
                });
                break;
            // 智能井盖
            case "2":
                marker = new AMap.Marker({
                    position: longitude,
                    map: this.map,
                    icon: status == 3 || status == 4 || status == 5 ?'../../../assets/img/jinggai_gj.png':
                          status == 2 || status == 5 ? '../../../assets/img/jinggai_zc.png':
                          status == 6 || status == 1 ? '../../../assets/img/jinggai_lx.png': '',
                    title: '设备名称:'+device.device_name + '\n' + '状态:'+status_name
                });
                break;
            // 门磁
            case "3":
                marker = new AMap.Marker({
                    position: longitude,
                    map: this.map,
                    icon: status == 3 || status == 4 || status == 5 ?'../../../assets/img/mc_gj.png' :
                          status == 2 || status == 5 ? '../../../assets/img/mc_zc.png' :
                          status == 6 || status == 1 ? '../../../assets/img/mc_lx.png' : '',
                    title: '设备名称:'+device.device_name + '\n' + '状态:'+status_name
                });
                break;
            // 智能锁
            case "4":
                marker = new AMap.Marker({
                    position: longitude,
                    map: this.map,
                    icon: status == 3 || status == 4 || status == 5 ? '../../../assets/img/suo_gj.png' :
                          status == 2 || status == 5 ? '../../../assets/img/suo_zc.png' : 
                          status == 6 || status == 1 ? '../../../assets/img/suo_lx.png' : '',
                    title: '设备名称:'+device.device_name + '\n' + '状态:'+status_name
                });
                break;
            // 故障指示器
            case "5":
                marker = new AMap.Marker({
                    position: longitude,
                    map: this.map,
                    icon: status == 3 || status == 4 || status == 5 ? '../../../assets/img/dljcy_gj.png' :
                          status == 2 || status == 5 ? '../../../assets/img/dljcy_zc.png' : 
                          status == 6 || status == 1 ? '../../../assets/img/dljcy_lx.png' : '',
                    title: '设备名称:'+device.device_name + '\n' + '状态:'+status_name
                });
                break;
        }
        if(status == 3 || status == 4 || status == 5){
            // marker.setAnimation('AMAP_ANIMATION_BOUNCE');
            marker.setAnimation('AMAP_ANIMATION_DROP');
        }
        // let content = '';
        // switch(type){
        //   // 烟感
        //   case "1":
        //       content = `<div style="min-width:200px;font-size:13px;color:black;">
        //                       <p>类型:${Device.device_type_name}</p>
        //                       <p>名称:${Device.device_name}</p>
        //                       <p>设备号:${Device.device_number}</p>
        //                       <p>设备组:${Device.station_name}</p>
        //                       <p>设备状态:${Device.status_name}</p>
        //                       <p>电池电压:${Device.real_voltage}</p>
        //                       <p>温度:${Device.temperature}</p>
        //                       <p>湿度:${Device.dampness}</p>
        //                       <p>最后上报时间:${Device.uploaded_at}</p>
        //                    </div>
        //                   `
        //         break;
        //   // 智能井盖
        //   case "2":
        //         content = `<div style="min-width:200px;font-size:13px;color:black;">
        //                       <p>类型:${Device.device_type_name}</p>
        //                       <p>名称:${Device.device_name}</p>
        //                       <p>设备号:${Device.device_number}</p>
        //                       <p>设备组:${Device.station_name}</p>
        //                       <p>设备状态:${Device.status_name}</p>
        //                       <p>电池电压:${Device.real_voltage}</p>
        //                       <p>光照:${Device.beam}</p>
        //                       <p>水浸:${Device.inundate}</p>
        //                       <p>最后上报时间:${Device.uploaded_at}</p>
        //                    </div>
        //                   `
        //         break;
        //   // 门磁
        //   case "3":
        //         content = `<div style="min-width:200px;font-size:13px;color:black;">
        //                       <p>类型:${Device.device_type_name}</p>
        //                       <p>名称:${Device.device_name}</p>
        //                       <p>设备号:${Device.device_number}</p>
        //                       <p>设备组:${Device.station_name}</p>
        //                       <p>电池电压:${Device.real_voltage}</p>
        //                       <p>门状态:${Device.status_name}</p>
        //                       <p>最后上报时间:${Device.uploaded_at}</p>
        //                    </div>
        //                   `
        //         break;
        //   // 智能锁
        //   case "4":
        //         content = `<div style="min-width:200px;font-size:13px;color:black;">
        //                       <p>类型:${Device.device_type_name}</p>
        //                       <p>名称:${Device.device_name}</p>
        //                       <p>设备号:${Device.device_number}</p>
        //                       <p>设备组:${Device.station_name}</p>
        //                       <p>设备状态:${Device.status_name}</p>
        //                       <p>信号强度:${Device.signal}</p>
        //                       <p>电池电压:${Device.real_voltage}</p>
        //                       <p>湿度:${Device.dampness}</p>
        //                       <p>温度:${Device.temperature}</p>
        //                       <p>门状态:${Device.door_status}</p>
        //                       <p>锁状态:${Device.lock_status}</p>
        //                       <p>最后上报时间:${Device.uploaded_at}</p>
        //                    </div>
        //                   `
        //         content +='<p>'+
        //           '<button id="mapBtn" class="'+id+'" style="padding:3px 5px;background:#1ab394;color:#fff;border-radius:3px;">开启</button>'+
        //           '</p>'
        //         setTimeout(()=>{
        //             let btn = document.getElementById('mapBtn')
        //             console.log(btn);
        //             if(btn != undefined){
        //                 btn.addEventListener('click',(e:any)=>{
        //                     console.log(e.target.className)
        //                     if(e.target.id == 'mapBtn'){
        //                         this.unlock(e.target.className)
        //                     }
        //                 })
        //             }
        //         })
        //         break;
        //   // 故障指示器
        //   case "5":
        //         content = `<div style="min-width:200px;font-size:13px;color:black;">
        //                       <p>类型:${Device.device_type_name}</p>
        //                       <p>名称:${Device.device_name}</p>
        //                       <p>设备号:${Device.device_number}</p>
        //                       <p>设备组:${Device.station_name}</p>
        //                       <p>设备状态:${Device.status_name}</p>
        //                       <p>信号强度:${Device.signal}</p>
        //                       <p>电池电量:${Device.real_quantity}</p>
        //                       <p>停电类型:${Device.warning_type}</p>
        //                       <p>停电原因:${Device.warning_content}</p>
        //                       <p>最后上报时间:${Device.uploaded_at}</p>
        //                    </div>
        //                   `
        //         break;
        // }
        // marker.content = content
        // marker.on('click', this.markerClick.bind(this));
        marker.id = device.id;
        marker.type = type;
        marker.on('click', this.markerClick.bind(this));
  }
  markerClick(e){
      console.log(e);
      console.log(e.target.id);
      let id = e.target.id;
      const condition = {
          id: id
      }
      this.deviceService.get(condition).subscribe((res)=>{
          console.log(res)
          const device = res['data'];
          let content = '';
          switch (e.target.type) {
              // 烟感
              case "1":
                  content = `<div style="min-width:200px;font-size:13px;color:black;">
                                  <p>类型:${device.device_type_name}</p>
                                  <p>名称:${device.device_name}</p>
                                  <p>设备号:${device.number_define}</p>
                                  <p>出厂编号: ${device.device_number}</p>
                                  <p>设备组:${device.station_name}</p>
                                  <p>设备状态:${device.status_name}</p>
                                  <p>电池电压:${device.real_voltage}</p>
                                  <p>温度:${device.temperature}</p>
                                  <p>湿度:${device.dampness}</p>
                                  <p>最后上报时间:${device.uploaded_at}</p>
                               </div>
                              `
                    break;
              // 智能井盖
              case "2":
                    content = `<div style="min-width:200px;font-size:13px;color:black;">
                                  <p>类型:${device.device_type_name}</p>
                                  <p>名称:${device.device_name}</p>
                                  <p>设备号:${device.number_define}</p>
                                  <p>出厂编号: ${device.device_number}</p>
                                  <p>设备组:${device.station_name}</p>
                                  <p>设备状态:${device.status_name}</p>
                                  <p>电池电压:${device.real_voltage}</p>
                                  <p>光照:${device.beam}</p>
                                  <p>水浸:${device.inundate}</p>
                                  <p>最后上报时间:${device.uploaded_at}</p>
                               </div>
                              `
                    break;
              // 门磁
              case "3":
                    content = `<div style="min-width:200px;font-size:13px;color:black;">
                                  <p>类型:${device.device_type_name}</p>
                                  <p>名称:${device.device_name}</p>
                                  <p>设备号:${device.number_define}</p>
                                  <p>出厂编号: ${device.device_number}</p>
                                  <p>设备组:${device.station_name}</p>
                                  <p>电池电压:${device.real_voltage}</p>
                                  <p>门状态:${device.status_name}</p>
                                  <p>最后上报时间:${device.uploaded_at}</p>
                               </div>
                              `
                    break;
              // 智能锁
              case "4":
                    content = `<div style="min-width:200px;font-size:13px;color:black;">
                                  <p>类型:${device.device_type_name}</p>
                                  <p>名称:${device.device_name}</p>
                                  <p>设备号:${device.number_define}</p>
                                  <p>出厂编号: ${device.device_number}</p>
                                  <p>设备组:${device.station_name}</p>
                                  <p>设备状态:${device.status_name}</p>
                                  <p>信号强度:${device.signal}</p>
                                  <p>电池电压:${device.real_voltage}</p>
                                  <p>湿度:${device.dampness}</p>
                                  <p>温度:${device.temperature}</p>
                                  <p>门状态:${device.door_status}</p>
                                  <p>锁状态:${device.lock_status}</p>
                                  <p>最后上报时间:${device.uploaded_at}</p>
                               </div>
                              `
                    content +='<p>'+
                      '<button id="mapBtn" class="'+ id +'" style="padding:3px 5px;background:#1ab394;color:#fff;border-radius:3px;">开启</button>'+
                      '</p>'
                    setTimeout(()=>{
                        let btn = document.getElementById('mapBtn')
                        console.log(btn);
                        if(btn != undefined){
                            btn.addEventListener('click',(e:any)=>{
                                console.log(e.target.className)
                                if(e.target.id == 'mapBtn'){
                                    this.unlock(e.target.className)
                                }
                            })
                        }
                    })
                    break;
              // 故障指示器
              case "5":
                    content = `<div style="min-width:200px;font-size:13px;color:black;">
                                  <p>类型:${device.device_type_name}</p>
                                  <p>名称:${device.device_name}</p>
                                  <p>设备号:${device.number_define}</p>
                                  <p>出厂编号: ${device.device_number}</p>
                                  <p>设备组:${device.station_name}</p>
                                  <p>设备状态:${device.status_name}</p>
                                  <p>信号强度:${device.signal}</p>
                                  <p>电池电量:${device.real_quantity}</p>
                                  <p>停电类型:${device.warning_type}</p>
                                  <p>停电原因:${device.warning_content}</p>
                                  <p>最后上报时间:${device.uploaded_at}</p>
                               </div>
                              `
                    break;
          }
          this.infoWindow.setContent(content);
          this.infoWindow.open(this.map, e.target.getPosition());
      })
  }
  // 解锁
  unlock(id){
    console.log(id)
    const condition = {
        id:id
    }
    // this.isSpinning = true;
    this.deviceService.unlock(condition).subscribe((res)=>{
        // this.isSpinning = false
        this.msg.success('解锁成功');
        this.search();
        this.infoWindow.close();
    })
  }
}
