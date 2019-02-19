import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DeviceService } from '../../services/device.service';
import { StationService } from '../../services/station.service';
import { NzMessageService } from 'ng-zorro-antd';
import { DictService } from '../../services/dict.service';
declare var AMap: any;
import G2 from '@antv/g2';
import * as moment from 'moment';
@Component({
  selector: 'app-device-group-detail',
  templateUrl: './device-group-detail.component.html',
  styleUrls: ['./device-group-detail.component.css']
})
export class DeviceGroupDetailComponent implements OnInit {
  bodyStyle = {'height':'auto'};
  isOperate = false;
  isSpinning = false;
  map;
  // 开启推送
  open_push = true;
  singleDevice = {
      id:'',
      station_id:'',
      device_name:'',
      device_number:'',
      device_type_name:'',
      device_remarks:'',
      provider:'',
      warning:[],
      heart:[],
      cur_interval:'',
      open_push:true,
      open_type:'',
      manufacturer_id:'',
      number_define: '',
      open_used_at: ''
  }
  info = {
      loading:false,
      offset:0,
      limit:20,
      total:0
  }
  device_list = [];
  manufacturer = [];
  pushconfigs = [];
  warningList = [];
  heartList = [];
  constructor(private routerInfo: ActivatedRoute, 
              private deviceService: DeviceService,
              private stationService: StationService,
              private message: NzMessageService,
              private dictService: DictService) { }

  ngOnInit() {
      this.searchStationDetail();
      this.search();
      // this.searchManufacturer();
      // this.searchPushConfigs();
      // setTimeout(()=>{
      //   this.renderChart()
      // },0)
  }
  ngAfterViewInit(){
    this.map = new AMap.Map('map',{
        resizeEnable: true,
        zoom:16
    }); 
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
  search(){
      const condition = {
          query:'',
          type:0,
          offset:this.info.offset,
          limit:this.info.limit,
          order_by:'created_at',
          order:'desc',
          total:this.info.total,
          station_id:this.routerInfo.snapshot.params.id
      }
      this.deviceService.search(condition).subscribe((res)=>{
          console.log(res)
          this.device_list = res['data']['list']
          for(var i =0;i<this.device_list.length;i++){
              this.addMarker(this.device_list[i])
          }
      })

  }
  stationDetail = {
      longitude:'',
      latitude:''
  }
  searchStationDetail(){
      const condition = {
          id: this.routerInfo.snapshot.params.id
      }
      this.stationService.get(condition).subscribe((res)=>{
          console.log(res)
          this.stationDetail = res['data']
          const arr = [this.stationDetail.longitude,this.stationDetail.latitude]
          this.map.setCenter(arr)
      })

  }
  changePage($event) {
    this.info.offset = ($event - 1) * this.info.limit;
    this.search();
  }
  unlock(id){
      console.log(id)
      const condition = {
          id:id
      }
      this.isSpinning = true;
      this.deviceService.unlock(condition).subscribe((res)=>{
          this.isSpinning = false
          if(res['code'] == 0){
              this.message.success('解锁成功');
              this.search();
              this.infoWindow.close();
          }
      })
  }
  infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
  //添加点标记
  addMarker(device) {
    const longitude = [device.longitude,device.latitude]
    const Device = device;
    const type = device.device_type;
    const status = device.device_status;
    const id = Device.id;
        let marker;
        // switch (device.device_type_name) {
        //     case "烟感":
        //         marker = new AMap.Marker({
        //             position: longitude,
        //             map: this.map,
        //             icon:device.device_status == 3 ?'../../../assets/img/smoke_gj.png':'../../../assets/img/smoke_zc.png',
        //         });
        //         break;
        //     case "智能井盖":
        //         marker = new AMap.Marker({
        //             position: longitude,
        //             map: this.map,
        //             icon:device.device_status == 3 ?'../../../assets/img/jinggai_gj.png': '../../../assets/img/jinggai_zc.png',
        //         });
        //         break;
        //     case "门磁":
        //         marker = new AMap.Marker({
        //             position: longitude,
        //             map: this.map,
        //             icon:device.device_status == 3 ? '../../../assets/img/mc_gj.png' : '../../../assets/img/mc_zc.png',
        //         });
        //         break;
        //     case "智能锁":
        //         marker = new AMap.Marker({
        //             position: longitude,
        //             map: this.map,
        //             icon:'../../../assets/img/suo_zc.png',
        //         });
        //         break;
        //     case "故障指示器":
        //         marker = new AMap.Marker({
        //             position: longitude,
        //             map: this.map,
        //             icon:device.device_status == 3 ? '../../../assets/img/dljcy-gj.png':'../../../assets/img/dljcy.png',
        //         });
        //         break;
        // }
        switch (type) {
            // 烟感
            case "1":
                marker = new AMap.Marker({
                    position: longitude,
                    map: this.map,
                    icon: status == 3 ?'../../../assets/img/smoke_gj.png':
                          status == 2 || status == 5 ? '../../../assets/img/smoke_zc.png':
                          status == 6 || status == 1 ? '../../../assets/img/smoke_lx.png': ''
                });
                break;
            // 智能井盖
            case "2":
                marker = new AMap.Marker({
                    position: longitude,
                    map: this.map,
                    icon: status == 3 ?'../../../assets/img/jinggai_gj.png':
                          status == 2 || status == 5 ? '../../../assets/img/jinggai_zc.png':
                          status == 6 || status == 1 ? '../../../assets/img/jinggai_lx.png': '',
                });
                break;
            // 门磁
            case "3":
                marker = new AMap.Marker({
                    position: longitude,
                    map: this.map,
                    icon: status == 3 ?'../../../assets/img/mc_gj.png' :
                          status == 2 || status == 5 ? '../../../assets/img/mc_zc.png' :
                          status == 6 || status == 1 ? '../../../assets/img/mc_lx.png' : '',
                });
                break;
            // 智能锁
            case "4":
                marker = new AMap.Marker({
                    position: longitude,
                    map: this.map,
                    icon: status == 3 ? '../../../assets/img/suo_gj.png' :
                          status == 2 || status == 5 ? '../../../assets/img/suo_zc.png' : 
                          status == 6 || status == 1 ? '../../../assets/img/suo_lx.png' : '',
                });
                break;
            // 故障指示器
            case "5":
                marker = new AMap.Marker({
                    position: longitude,
                    map: this.map,
                    icon: status == 3 ? '../../../assets/img/dljcy_gj.png' :
                          status == 2 || status == 5 ? '../../../assets/img/dljcy_zc.png' : 
                          status == 6 || status == 1 ? '../../../assets/img/dljcy_lx.png' : '',
                });
                break;
        }
        let content = '';
        // switch(Device.device_type_name){
        //   case "烟感":
        //       content = `<div style="min-width:200px;font-size:13px;color:black;">
        //                       <p>类型:${Device.device_type_name}</p>
        //                       <p>设备号:${Device.number_define}</p>
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
        //   case "智能井盖":
        //         content = `<div style="min-width:200px;font-size:13px;color:black;">
        //                       <p>类型:${Device.device_type_name}</p>
        //                       <p>设备号:${Device.number_define}</p>
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
        //   case "门磁":
        //         content = `<div style="min-width:200px;font-size:13px;color:black;">
        //                       <p>类型:${Device.device_type_name}</p>
        //                       <p>设备号:${Device.number_define}</p>
        //                       <p>设备号:${Device.device_number}</p>
        //                       <p>设备组:${Device.station_name}</p>
        //                       <p>电池电压:${Device.real_voltage}</p>
        //                       <p>门状态:${Device.status_name}</p>
        //                       <p>最后上报时间:${Device.uploaded_at}</p>
        //                    </div>
        //                   `
        //         break;
        //   case "智能锁":
        //         content = `<div style="min-width:200px;font-size:13px;color:black;">
        //                       <p>类型:${Device.device_type_name}</p>
        //                       <p>设备号:${Device.number_define}</p>
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
        //   case "故障指示器":
        //         content = `<div style="min-width:200px;font-size:13px;color:black;">
        //                       <p>类型:${Device.device_type_name}</p>
        //                       <p>设备号:${Device.number_define}</p>
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
        switch(type){
          // 烟感
          case "1":
              content = `<div style="min-width:200px;font-size:13px;color:black;">
                              <p>类型:${Device.device_type_name}</p>
                              <p>名称:${Device.device_name}</p>
                              <p>设备号:${Device.number_define}</p>
                              <p>出厂编号: ${Device.device_number}</p>
                              <p>设备组:${Device.station_name}</p>
                              <p>设备状态:${Device.status_name}</p>
                              <p>电池电压:${Device.real_voltage}</p>
                              <p>温度:${Device.temperature}</p>
                              <p>湿度:${Device.dampness}</p>
                              <p>最后上报时间:${Device.uploaded_at}</p>
                           </div>
                          `
                break;
          // 智能井盖
          case "2":
                content = `<div style="min-width:200px;font-size:13px;color:black;">
                              <p>类型:${Device.device_type_name}</p>
                              <p>名称:${Device.device_name}</p>
                              <p>设备号:${Device.number_define}</p>
                              <p>出厂编号: ${Device.device_number}</p>
                              <p>设备组:${Device.station_name}</p>
                              <p>设备状态:${Device.status_name}</p>
                              <p>电池电压:${Device.real_voltage}</p>
                              <p>光照:${Device.beam}</p>
                              <p>水浸:${Device.inundate}</p>
                              <p>最后上报时间:${Device.uploaded_at}</p>
                           </div>
                          `
                break;
          // 门磁
          case "3":
                content = `<div style="min-width:200px;font-size:13px;color:black;">
                              <p>类型:${Device.device_type_name}</p>
                              <p>名称:${Device.device_name}</p>
                              <p>设备号:${Device.number_define}</p>
                              <p>出厂编号: ${Device.device_number}</p>
                              <p>设备组:${Device.station_name}</p>
                              <p>电池电压:${Device.real_voltage}</p>
                              <p>门状态:${Device.status_name}</p>
                              <p>最后上报时间:${Device.uploaded_at}</p>
                           </div>
                          `
                break;
          // 智能锁
          case "4":
                content = `<div style="min-width:200px;font-size:13px;color:black;">
                              <p>类型:${Device.device_type_name}</p>
                              <p>名称:${Device.device_name}</p>
                              <p>设备号:${Device.number_define}</p>
                              <p>出厂编号: ${Device.device_number}</p>
                              <p>设备组:${Device.station_name}</p>
                              <p>设备状态:${Device.status_name}</p>
                              <p>信号强度:${Device.signal}</p>
                              <p>电池电压:${Device.real_voltage}</p>
                              <p>湿度:${Device.dampness}</p>
                              <p>温度:${Device.temperature}</p>
                              <p>门状态:${Device.door_status}</p>
                              <p>锁状态:${Device.lock_status}</p>
                              <p>最后上报时间:${Device.uploaded_at}</p>
                           </div>
                          `
                content +='<p>'+
                  '<button id="mapBtn" class="'+id+'" style="padding:3px 5px;background:#1ab394;color:#fff;border-radius:3px;">开启</button>'+
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
                              <p>类型:${Device.device_type_name}</p>
                              <p>名称:${Device.device_name}</p>
                              <p>设备号:${Device.number_define}</p>
                              <p>出厂编号: ${Device.device_number}</p>
                              <p>设备组:${Device.station_name}</p>
                              <p>设备状态:${Device.status_name}</p>
                              <p>信号强度:${Device.signal}</p>
                              <p>电池电量:${Device.real_quantity}</p>
                              <p>停电类型:${Device.warning_type}</p>
                              <p>停电原因:${Device.warning_content}</p>
                              <p>最后上报时间:${Device.uploaded_at}</p>
                           </div>
                          `
                break;
        }
        if(status == 3){
            marker.setAnimation('AMAP_ANIMATION_BOUNCE');
        }
        marker.content = content
        marker.on('click', this.markerClick.bind(this));
  }
  markerClick(e) {
      this.infoWindow.setContent(e.target.content);
      this.infoWindow.open(this.map, e.target.getPosition());
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
  }
  // 关闭信息窗体
  closeInfoWindow(that) {
      console.log(this)
      this.map.clearInfoWindow();
  }
  chart;
    renderChart(){
        const heart = this.heartList;
        let arr = []
        for(var i = 0; i < heart.length;i++){
            const obj = {
                date:heart[i].created,
                '光照度':heart[i].temperature,
                '温度':heart[i].beam
            }
            arr.push(obj)
        }
        this.chart = new G2.Chart({
          container: 'chart',
          forceFit: true,
          height: 500,
          padding:'auto'
        });
        this.chart.source(arr, {
          beam: {
            min: 0,
            tickInterval: 50,
            alias: '光照度'
          },
          temperature: {
            // min: 5,
            tickInterval: 5,
            alias: '温度'
          }
        });
        // 左侧 Y 轴，即光照轴
        this.chart.axis('beam', {
          label: {
            formatter: val => {
              return val + ' mm'; // 格式化坐标轴显示
            },
            textStyle: {
              fill: '#95ceff'
            }
          },
          line: null,
          tickLine: null
        });
        // 右侧第一个 Y 轴，即温度轴
        this.chart.axis('temperature', {
          line: null,
          tickLine: null,
          label: {
            formatter: val => {
              return val + ' °C'; // 格式化坐标轴显示
            },
            textStyle: {
              fill: '#90ed7d'
            }
          }
        });
        this.chart.legend({
          position: 'top'
        });
        this.chart.tooltip({
          crosshairs: {
            type: 'line'
          }
        });
        this.chart.line().position('date*光照度').color('blue').size(2); // 光照
        this.chart.line().position('date*温度').color('red').size(2).shape('smooth'); // 温度
        // this.chart.point().position('date*temperature').color('#90ed7d').shape('diamond');
        this.chart.render();

    }
    resetHeartChart(){
        const heart = this.heartList;
        let arr = []
        for(var i = 0; i < heart.length;i++){
            const obj = {
                date:heart[i].created,
                '光照度':heart[i].temperature,
                '温度':heart[i].beam
            }
            arr.push(obj)
        }
        this.chart.changeData(arr);
    }
  mapClick(Device){
      const lng = Device.longitude;
      const lat = Device.latitude;
      const type = Device.device_type;
      const status = Device.device_status;
      this.map.setZoomAndCenter(13,[lng,lat])
      let content;
      const id = Device.id;
      switch(type){
          // 烟感
          case "1":
              content = `<div style="min-width:200px;font-size:13px;color:black;">
                              <p>类型:${Device.device_type_name}</p>
                              <p>名称:${Device.device_name}</p>
                              <p>设备号:${Device.number_define}</p>
                              <p>出厂编号: ${Device.device_number}</p>
                              <p>设备组:${Device.station_name}</p>
                              <p>设备状态:${Device.status_name}</p>
                              <p>电池电压:${Device.real_voltage}</p>
                              <p>温度:${Device.temperature}</p>
                              <p>湿度:${Device.dampness}</p>
                              <p>最后上报时间:${Device.uploaded_at}</p>
                           </div>
                          `
                break;
          // 智能井盖
          case "2":
                content = `<div style="min-width:200px;font-size:13px;color:black;">
                              <p>类型:${Device.device_type_name}</p>
                              <p>名称:${Device.device_name}</p>
                              <p>设备号:${Device.number_define}</p>
                              <p>出厂编号: ${Device.device_number}</p>
                              <p>设备组:${Device.station_name}</p>
                              <p>设备状态:${Device.status_name}</p>
                              <p>电池电压:${Device.real_voltage}</p>
                              <p>光照:${Device.beam}</p>
                              <p>水浸:${Device.inundate}</p>
                              <p>最后上报时间:${Device.uploaded_at}</p>
                           </div>
                          `
                break;
          // 门磁
          case "3":
                content = `<div style="min-width:200px;font-size:13px;color:black;">
                              <p>类型:${Device.device_type_name}</p>
                              <p>名称:${Device.device_name}</p>
                              <p>设备号:${Device.number_define}</p>
                              <p>出厂编号: ${Device.device_number}</p>
                              <p>设备组:${Device.station_name}</p>
                              <p>电池电压:${Device.real_voltage}</p>
                              <p>门状态:${Device.status_name}</p>
                              <p>最后上报时间:${Device.uploaded_at}</p>
                           </div>
                          `
                break;
          // 智能锁
          case "4":
                content = `<div style="min-width:200px;font-size:13px;color:black;">
                              <p>类型:${Device.device_type_name}</p>
                              <p>名称:${Device.device_name}</p>
                              <p>设备号:${Device.number_define}</p>
                              <p>出厂编号: ${Device.device_number}</p>
                              <p>设备组:${Device.station_name}</p>
                              <p>设备状态:${Device.status_name}</p>
                              <p>信号强度:${Device.signal}</p>
                              <p>电池电压:${Device.real_voltage}</p>
                              <p>湿度:${Device.dampness}</p>
                              <p>温度:${Device.temperature}</p>
                              <p>门状态:${Device.door_status}</p>
                              <p>锁状态:${Device.lock_status}</p>
                              <p>最后上报时间:${Device.uploaded_at}</p>
                           </div>
                          `
                content +='<p>'+
                  '<button id="mapBtn" class="'+id+'" style="padding:3px 5px;background:#1ab394;color:#fff;border-radius:3px;">开启</button>'+
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
                              <p>类型:${Device.device_type_name}</p>
                              <p>名称:${Device.device_name}</p>
                              <p>设备号:${Device.number_define}</p>
                              <p>出厂编号: ${Device.device_number}</p>
                              <p>设备组:${Device.station_name}</p>
                              <p>设备状态:${Device.status_name}</p>
                              <p>信号强度:${Device.signal}</p>
                              <p>电池电量:${Device.real_quantity}</p>
                              <p>停电类型:${Device.warning_type}</p>
                              <p>停电原因:${Device.warning_content}</p>
                              <p>最后上报时间:${Device.uploaded_at}</p>
                           </div>
                          `
                break;
        }
            this.infoWindow.setContent(content);
            this.infoWindow.open(this.map,[lng,lat]);
  }
  // 编辑设备
  operateDevice(device) {
      this.singleDevice = JSON.parse(JSON.stringify(device));
      this.singleDevice.open_push = Boolean(Number(this.singleDevice.open_push));
      this.getWarning(device.id);
      this.getHeart(device.id);
      this.isOperate = true;
  }
  operateCancel(){
      this.isOperate = false
  }
  operateOk(){
      this.isOperate = true
  }
  // 获取单个设备的报警记录
  getWarning(id){
      const condition = {
          id:id
      }
      this.deviceService.warning(condition).subscribe((res)=>{
          console.log(res)
          this.warningList = res['data']['list']
      })
  }
  // 获取单个设备的心跳记录
  getHeart(id){
      const condition = {
          id:id
      }
      this.deviceService.heartSearch(condition).subscribe((res)=>{
          this.heartList = res['data']['list']          
          // 获取设备心跳记录后 渲染图表
          // this.resetHeartChart();
      })
  }
  cancleDevice(){
      this.isOperate = false
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
          manufacturer_id:this.singleDevice.manufacturer_id
      }
      this.deviceService.heart(condition).subscribe((res)=>{
          if(res['code'] === 0){
              this.message.success('设置成功')
              this.isOperate = false;
              this.search();
          }
      })
  }
  // 编辑单个设备
  confirmEditDevice() {
      if(this.singleDevice.device_name === ''){
          this.message.warning('请输入设备名称')
          return false
      }
      if(this.singleDevice.device_number === ''){
          this.message.warning('请输入设备号')
          return false
      }
      if(this.singleDevice.station_id === ''){
          this.message.warning('请选择设备组')
          return false
      }
      if(this.singleDevice.manufacturer_id == ''){
        this.message.warning('请选择供应商');
        return false;
      }
      const condition = this.singleDevice;
      condition.open_used_at = this.singleDevice.open_used_at == null || this.singleDevice.open_used_at == '' ? '' : moment(this.singleDevice.open_used_at).format('YYYY-MM-DD');
      this.deviceService.update(condition).subscribe((res)=>{
          if(res['code'] === 0){
              this.message.success('修改成功');
              this.isOperate = false;
              this.search();
          }
      })
  }
  // 删除设备
  deleteDevice(device) {
      const condition = {
          id: device.id
      }
      this.deviceService.delete(condition).subscribe((res)=>{
          console.log(res)
          if(res['code'] === 0){
              this.message.success('删除成功');
              this.search();
          }
      })
  }
  planSuccess($event){
    if($event == 'ok'){
      this.search();
    }
    this.isOperate = false;
  }
}
