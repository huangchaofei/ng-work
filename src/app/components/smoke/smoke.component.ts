import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NzMessageService , zh_CN } from 'ng-zorro-antd';
import { DeviceService } from '../../services/device.service';
import { DictService } from '../../services/dict.service';
declare var AMap: any;
import G2 from '@antv/g2';
import * as moment from 'moment';
@Component({
  selector: 'app-smoke',
  templateUrl: './smoke.component.html',
  styleUrls: ['./smoke.component.css']
})
export class SmokeComponent implements OnInit, AfterViewInit {
  auth = JSON.parse(window.localStorage.getItem('authId')) || [];
  isOperate = false;
  map;
  // infoWindow;
  // 心跳间隔
  cur_interval = '';
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
     type: 1,
     offset: 0,
     limit: 20,
     order_by: 'created_at',
     order: 'desc',
     total: 0,
     loading:false,
     status:0
  }
  device_list = [];
  manufacturer = [];
  pushconfigs = [];
  warningList = [];
  heartList = [];
  constructor(private deviceService: DeviceService, private message: NzMessageService,
              private dictService: DictService) { }
  
  ngOnInit() {
    this.statistics();
    this.search();
    // this.searchManufacturer();
    // this.searchPushConfigs();
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
  mapClick(Device){
      const lng = Device.longitude;
      const lat = Device.latitude;
      this.map.setZoomAndCenter(17,[lng,lat])
      const content = `<div style="min-width:200px;font-size:13px;color:black;">
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
         status:this.info.status
    }
    this.deviceService.search(condition).subscribe((res) =>{
        console.log(res)
        this.device_list = res['data']['list']
        this.info.total = res['data']['total']
        for(let i = 0;i<this.device_list.length;i++){
            const device = this.device_list[i]
            this.addMarker(this.device_list[i])
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
      type:this.info.type
    }
    this.deviceService.statistics(condition).subscribe((res) =>{
      console.log(res)
      this.deviceDetail = res['data']
    })
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
              this.search();
              this.isOperate = false;
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
      const condition = this.singleDevice;
      condition.open_used_at = this.singleDevice.open_used_at == null || this.singleDevice.open_used_at == '' ? '' : moment(this.singleDevice.open_used_at).format('YYYY-MM-DD');
      this.deviceService.update(condition).subscribe((res)=>{
          if(res['code'] === 0){
              this.message.success('修改成功');
              this.search();
              this.isOperate = false;
          }
      })
  }
  infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
  marker;
  //添加点标记
  addMarker(device) {
    const longitude = [device.longitude,device.latitude]
    const Device = device;
    const status = device.device_status;
        let marker;
            marker = new AMap.Marker({
                position: longitude,
                map: this.map,
                icon: status == 3 ?'../../../assets/img/smoke_gj.png':
                      status == 2 || status == 5 ? '../../../assets/img/smoke_zc.png':
                      status == 6 || status == 1 ? '../../../assets/img/smoke_lx.png': '',
                content:''
            });
        marker.content = `<div style="min-width:200px;font-size:13px;color:black;">
                              <p>类型:${Device.device_type_name}</p>
                              <p>设备号:${Device.device_number}</p>
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
        marker.on('click', this.markerClick.bind(this));
  }
    markerClick(e) {
        this.infoWindow.setContent(e.target.content);
        this.infoWindow.open(this.map, e.target.getPosition());
    }

   //构建自定义信息窗体
   createInfoWindow(title, content,that) {
        console.log(that)
        var info = document.createElement("div");
        info.className = "info";

        //可以通过下面的方式修改自定义窗体的宽高
        //info.style.width = "400px";
        // 定义顶部标题
        var top = document.createElement("div");
        var titleD = document.createElement("span");
        var closeX = document.createElement("img");
        top.className = "info-top";
        titleD.innerHTML = title;
        closeX.src = "https://webapi.amap.com/images/close2.gif";
        closeX.onclick = this.closeInfoWindow.bind(this);

        top.appendChild(titleD);
        top.appendChild(closeX);
        info.appendChild(top);

        // 定义中部内容
        var middle = document.createElement("div");
        middle.className = "info-middle";
        middle.style.backgroundColor = 'white';
        middle.innerHTML = content;
        info.appendChild(middle);

        // 定义底部内容
        var bottom = document.createElement("div");
        bottom.className = "info-bottom";
        bottom.style.position = 'relative';
        bottom.style.top = '0px';
        bottom.style.margin = '0 auto';
        var sharp = document.createElement("img");
        sharp.src = "https://webapi.amap.com/images/sharp.png";
        bottom.appendChild(sharp);
        info.appendChild(bottom);
        return info;
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
          container: 'chartSmoke',
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
    const status = device.device_status;
        let marker;
            marker = new AMap.Marker({
                position: longitude,
                map: this.bigMap,
                icon: status == 3 ?'../../../assets/img/smoke_gj.png':
                      status == 2 || status == 5 ? '../../../assets/img/smoke_zc.png':
                      status == 6 || status == 1 ? '../../../assets/img/smoke_lx.png': ''
            });
        let content = '';
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
