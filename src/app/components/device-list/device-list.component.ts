import { Component, OnInit, AfterViewInit, AfterContentInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService , zh_CN } from 'ng-zorro-antd';
import { DeviceService } from '../../services/device.service';
import { DictService } from '../../services/dict.service';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
registerLocaleData(zh);
declare var AMap: any;
import * as moment from 'moment';
import G2 from '@antv/g2';
@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.css'],
})
export class DeviceListComponent implements OnInit, AfterViewInit, OnDestroy {
  auth = JSON.parse(window.localStorage.getItem('authId')) || [];
  isOperate = false;
  isSpinning = false;
  map;
  // 心跳间隔
  cur_interval = '2';
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
      manufacturer_id:'',
      open_type:'',
      number_define: '',
      open_used_at: ''
  }
  continuedValue = '5分钟';
  typeValue = '单次';
  planValue = '';
  bodyStyle = {'height':'auto'};
  deviceDetail = {
    total: 0,
    normal: 0,
    working: 0,
    warning: 0,
    offline: 0,
    unknown:0
  }
  info = {
     query: '',
     type: 0,
     offset: 0,
     limit: 20,
     order_by: 'created_at',
     order: 'desc',
     total: 0,
     loading:false,
     status:0,
     select_type: [],
     select_status: [],
     click_type: [],
     click_status: [],
     province_id :0,
     city_id: 0,
     district_id: 0
  }
  device_list = [];
  manufacturer = [];
  pushconfigs = [];
  warningList = [];
  heartList = [];
  constructor(private routerInfo: ActivatedRoute,
              private deviceService: DeviceService, 
              private message: NzMessageService,
              private dictService: DictService ) { }
  
  ngOnInit() {
    // console.log(this.routerInfo.snapshot.params)
    // const parmars = this.routerInfo.snapshot.params;
    // if(JSON.stringify(parmars) !== '{}'){
    if(window.localStorage.getItem('mapCondition') !== null){
        const parmars = JSON.parse(window.localStorage.getItem('mapCondition'))
        this.info.select_type = parmars.select_type;
        this.info.select_status = parmars.select_status;
        this.info.click_type = parmars.click_type;
        this.info.click_status = parmars.click_status;
        this.info.province_id = parmars.province_id;
        this.info.city_id = parmars.city_id;
        this.info.district_id = parmars.district_id;
        this.search();
    }else{
        this.search();
    }
    this.statistics()
    // this.search()
    // this.searchManufacturer();
    // setTimeout(()=>{
    //     this.renderChart()
    // },0)
  }
  ngAfterViewInit() {
    this.map = new AMap.Map('map',{
        resizeEnable: true,
        zoom:2
    });// 创建地图实例
  }
  ngOnDestroy(){
      if(window.localStorage.getItem('mapCondition') !== null){
          window.localStorage.removeItem('mapCondition')
      }
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
  mapClick(Device){
      const lng = Device.longitude;
      const lat = Device.latitude;
      this.map.setZoomAndCenter(13,[lng,lat])
      let content;
      const id = Device.id;
      switch(Device.device_type){
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
  // 清空查询输入框
  clear() {
      this.info.query = ''
  }
  // 查询设备
  search() {
    const that = this;
    const condition = {
         query: this.info.query,
         type: this.info.type,
         offset: this.info.offset,
         limit: this.info.limit,
         order_by: this.info.order_by,
         order: this.info.order,
         total: this.info.total,
         status:this.info.status,
         select_type: this.info.select_type,
         select_status: this.info.select_status,
         click_type: this.info.click_type,
         click_status: this.info.click_status,
         province_id: this.info.province_id,
         city_id: this.info.city_id,
         district_id: this.info.district_id
    }
    this.deviceService.search(condition).subscribe((res) =>{
        console.log(res)
        this.device_list = res['data']['list']
        this.info.total = res['data']['total']
        for(let i = 0;i < this.device_list.length; i++){
            const marker:any = this.addMarker(this.device_list[i])
        }
    })
  }
  // 查询不同状态的设备列表
  changeStatus(status){
      this.info.status = status;
      this.info.offset = 0;
      this.search();
  }
  changePage($event) {
    this.info.offset = ($event - 1) * this.info.limit;
    this.search();
  }
  // 获取顶部数据
  statistics() {
    const condition = {
      type:0
    }
    this.deviceService.statistics(condition).subscribe((res) =>{
      console.log(res)
      this.deviceDetail = res['data']
    })
  }
  // 编辑设备
  operateDevice(device) {
    console.log(device);
      this.open_push = true;
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
  onChange($event){
      console.log($event)
  }
  onOk(data){
      console.log(data)
  }
  // 获取单个设备的报警记录
  getWarning(id){
      const condition = {
          id:id
      }
      this.deviceService.warning(condition).subscribe((res)=>{
          console.log(res)
          // this.singleDevice.warning = res['data']['list']
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
          // this.renderChart();
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
  infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
  marker;
  //添加点标记
  addMarker(device) {
    const longitude = [device.longitude,device.latitude]
    const Device = device;
    const type = device.device_type;
    const status = device.device_status;
    const id = Device.id;
        let marker;
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
    bigMap;
    bigMapVisible = false;
    bigMapStyle = {height:'auto'}
    showAllDevice(){
        this.bigMapVisible = true;
        this.bigMap = new AMap.Map('bigMap',{
            resizeEnable: true,
            zoom:2
        });
        for(let i = 0;i < this.device_list.length; i++){
            const marker = this.bigMapAddMarker(this.device_list[i])
        }
    }
    bigCancel(){
      this.bigMapVisible= false;
    }
    //添加点标记
  bigMapAddMarker(device) {
    const longitude = [device.longitude,device.latitude]
    const Device = device;
    const type = device.device_type;
    const status = device.deivce_status;
        let marker;
        switch (type) {
            // 烟感
            case "1":
                marker = new AMap.Marker({
                    position: longitude,
                    map: this.bigMap,
                    icon: status == 3 ?'../../../assets/img/smoke_gj.png':
                          status == 2 || status == 5 ? '../../../assets/img/smoke_zc.png':
                          status == 6 || status == 1 ? '../../../assets/img/smoke_lx.png': ''
                });
                break;
            // 智能井盖
            case "2":
                marker = new AMap.Marker({
                    position: longitude,
                    map: this.bigMap,
                    icon: status == 3 ?'../../../assets/img/jinggai_gj.png':
                          status == 2 || status == 5 ? '../../../assets/img/jinggai_zc.png':
                          status == 6 || status == 1 ? '../../../assets/img/jinggai_lx.png': ''
                });
                break;
            // 门磁
            case "3":
                marker = new AMap.Marker({
                    position: longitude,
                    map: this.bigMap,
                    icon: status == 3 ?'../../../assets/img/mc_gj.png' :
                          status == 2 || status == 5 ? '../../../assets/img/mc_zc.png' :
                          status == 6 || status == 1 ? '../../../assets/img/mc_lx.png' : ''
                });
                break;
            // 智能锁
            case "4":
                marker = new AMap.Marker({
                    position: longitude,
                    map: this.bigMap,
                    icon: status == 3 ? '../../../assets/img/suo_gj.png' :
                          status == 2 || status == 5 ? '../../../assets/img/suo_zc.png' : 
                          status == 6 || status == 1 ? '../../../assets/img/suo_lx.png' : '',
                });
                break;
            // 故障指示器
            case "5":
                marker = new AMap.Marker({
                    position: longitude,
                    map: this.bigMap,
                    icon: status == 3 ? '../../../assets/img/dljcy_gj.png' :
                          status == 2 || status == 5 ? '../../../assets/img/dljcy_zc.png' : 
                          status == 6 || status == 1 ? '../../../assets/img/dljcy_lx.png' : ''
                });
                break;
        }
        let content = '';
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
          //智能锁
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
        marker.content = content
        marker.on('click', this.bigMapMarkerClick.bind(this));
  }
  bigMapMarkerClick(e) {
      this.infoWindow.setContent(e.target.content);
      this.infoWindow.open(this.bigMap, e.target.getPosition());
  }
  planSuccess($event){
    if($event == 'ok'){
      this.search();
    }
    this.isOperate = false;
  }
}
