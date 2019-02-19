import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../../global';

@Injectable({
  providedIn: 'root'
})
export class IndexService {

  constructor(private http: HttpClient) { }
  // 获取绑定的设备组信息-用户首页地图显示
  Map() {
      return this.http.post( API + '/index/index/map', null)
  }
  // 获取顶部的设备总数和报警总数
  head() {
      return this.http.post( API + '/index/index/head', null)
  }
  // 获取不同类型的设备
  device() {
      return this.http.post( API + '/index/index/device', null)
  }
  // 获取首页报警列表数据
  warning(condition) {
      return this.http.post( API + '/index/index/warning',{content: JSON.stringify(condition)})
  }
  // 统计菜单下 推送统计
  statistics(condition) {
    return this.http.post( API + '/statistics/push/statistics', {content: JSON.stringify(condition)})
  }
  // 地图页获取设备信息
  mapDevice(condition){
    return this.http.post( API + '/index/map/device', {content: JSON.stringify(condition)})
  }
  // 地图页获取最新报警信息
  mapWarning(){
    return this.http.post( API + '/index/map/warning', null)
  }
}
