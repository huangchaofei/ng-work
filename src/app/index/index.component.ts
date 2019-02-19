import { Component, OnInit, AfterViewInit } from '@angular/core';
import { IndexService } from '../services/index.service';
import { SystemUserService } from '../services/system-user.service';
import G2 from '@antv/g2';
declare var AMap: any;

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit, AfterViewInit {

  constructor(private indexService: IndexService, private systemUserService: SystemUserService) { }
  // 站点列表
  station_list = [];
  // 不同类型的设备
  device_list = [];
  // 底部告警统计
  warning_list = [];
  // 饼图
  user_list = [];
  // 头部信息
  head = {
      device_total:0,
      device_warn:0
  }
  chart;
  chart2;
  chart3;
  c1_data = [];
  c2_data = [];
  c3_data = [];
   // 获取绑定的设备组信息
  searchStationGroup(){
      this.indexService.Map().subscribe((res)=>{
          console.log(res)
          this.station_list = res['data']
          for(var i = 0; i<this.station_list.length;i++){
              this.addMarker(this.station_list[i])
          }
      })
  }
  // 获取顶部的设备总数和报警总数
  searchHead(){
      this.indexService.head().subscribe((res)=>{
          console.log(res)
          this.head = res['data']
      })
  }
  // 获取不同类型的设备
  searchDevice(){
      this.indexService.device().subscribe((res)=>{
          console.log(res)
          this.device_list = res['data']
          const arr = []
          for(var i = 0; i< this.device_list.length;i++){
              const obj = {name:this.device_list[i].name,'设备数量':this.device_list[i].value}
              arr.push(obj)
          }
          this.chart.changeData(arr)
      })
  }

  //
  searchWarning(){
      const condition = {
          order:'asc'
      }
      this.indexService.warning(condition).subscribe((res)=>{
          console.log(res)
          this.warning_list = res['data'];
          const arr = []
          for(var i = 0; i< this.warning_list.length;i++){
              const obj = {uploaded_at:this.warning_list[i].uploaded_at,'报警数量':this.warning_list[i].value}
              arr.push(obj)
          }
          this.chart3.changeData(arr);
      })
  }
  searchUser(){
      this.systemUserService.statistics().subscribe((res)=>{
          this.user_list = res['data']
          const arr = [];
          for(var i = 0;i < this.user_list.length;i++){
              const key = this.user_list[i].name;
              const value = this.user_list[i].value;
              const obj = {name: key,count:value}
              arr.push(obj)
          }
          this.chart2.changeData(arr)
      })
  }
  ngOnInit() {
    this.systemUserService.getcurrent().subscribe((res=>{
        if(res['code'] == 0){
            setTimeout(()=>{
            // 图表1
            this.chart = new G2.Chart({
              container: 'c1',
              forceFit: true,
              height: 300,
              // padding:'auto'
            });
            this.chart.source(this.device_list);
            this.chart.scale('设备数量', {
              type:'linear',
              nice:true,
              min:0,
              // tickInterval:5
              tickCount:5
            });
            this.chart.interval().position('name*设备数量');
            this.chart.render();
            // 图表2
            this.chart2 = new G2.Chart({
              container: 'c2',
              forceFit: true,
              height: 300,
              // padding:'auto'
            });
            this.chart2.source(this.c2_data,{
                percent:{
                    format:function formatter(val){
                        val = val *100 + '%'
                        return val;
                    }
                }
            });
            this.chart2.coord('theta', {
              radius: 0.75
            });
            this.chart2.tooltip({
              showTitle: false,
              itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
            });
            this.chart2.intervalStack().position('count').color('name').label('count', {
              formatter: function formatter(val, item) {
                return item.point.name + ': ' + val;
              }
            })
            this.chart2.render();

            // 图表3
            this.chart3 = new G2.Chart({
              container: 'c3',
              forceFit: true,
              height: 300,
              padding:'auto'
            });
            this.chart3.source(this.c3_data);
            this.chart3.scale('报警数量', {
              type:'linear',
              nice:true,
              min:0,
              tickCount:5
              // tickInterval:5
            });
            this.chart3.scale('uploaded_at',{
                tickCount:16,
            })
            this.chart3.axis('报警数量',{
                line:{
                    stroke:'#ccc',
                    lineWidth:2
                }
            })
            this.chart3.line().position('uploaded_at*报警数量');
            this.chart3.render();

            this.searchStationGroup();
            this.searchHead();
            this.searchDevice();
            this.searchWarning();
            this.searchUser();

        },200)
        }
    }))
  }
  map;
  ngAfterViewInit() {
    this.map = new AMap.Map('map',{
        resizeEnable: true,
        zoom:3
    });          // 创建地图实例
  }
  //添加点标记
  addMarker(device) {
    const longitude = [device.longitude,device.latitude]
      const marker = new AMap.Marker({
          position: longitude,
          map: this.map
      });
      // let marker;
      //   switch (device.device_type_name) {
      //       case "烟感":
      //           marker = new AMap.Marker({
      //               position: longitude,
      //               map: this.map,
      //               icon:device.status==='报警'?'../../assets/img/smoke_gj.png':'../../assets/img/smoke_zc.png',
      //           });
      //           break;
      //       case "智能节点":
      //           marker = new AMap.Marker({
      //               position: longitude,
      //               map: this.map,
      //               icon:device.status==='报警'?'../../assets/img/jinggai_gj.png': '../../assets/img/jinggai_zc.png',
      //           });
      //           break;
      //       case "门磁":
      //           marker = new AMap.Marker({
      //               position: longitude,
      //               map: this.map,
      //               icon:device.status==='报警'?'../../assets/img/mc_gj.png' : '../../assets/img/mc_zc.png',
      //           });
      //           break;
      //       case "智能锁":
      //           marker = new AMap.Marker({
      //               position: longitude,
      //               map: this.map,
      //               icon:'../../assets/img/suo_zc.png',
      //           });
      //           break;
      //       case "断路监测仪":
      //           marker = new AMap.Marker({
      //               position: longitude,
      //               map: this.map,
      //               icon:'../../assets/img/dljcy.png',
      //           });
      //           break;
      //   }
  }
}
