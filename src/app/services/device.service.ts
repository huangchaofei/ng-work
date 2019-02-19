import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../../global';
@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(private http: HttpClient) { }
  // 获取设备的心跳数据
  heartSearch(condition) {
      return this.http.post(API + '/device/heart/search',{content: JSON.stringify(condition)})
  }
  // 获取设备报警记录
  warning(condition) {
      return this.http.post(API + '/device/device/warning',{content: JSON.stringify(condition)})
  }
  // 获取设备总量
  statistics(condition) {
      return this.http.post(API + '/device/device/statistics',{content: JSON.stringify(condition)})
  }
  // 删除设备
  delete(condition) {
      return this.http.post( API + '/device/device/delete', {content: JSON.stringify(condition)})
  }
  // 获取设备列表接口
  totalSearch(condition){
      return this.http.post( API + '/device/device/search',{content: JSON.stringify(condition)})
  }
  // 新增设备接口
  add(condition) {
      return this.http.post( API + '/device/device/add',{content: JSON.stringify(condition)})
  }
  //编辑设备接口
  update(condition) {
      return this.http.post( API + '/device/device/update', {content: JSON.stringify(condition)})
  }
  // 获取设备详情
  get(condition) {
    return this.http.post( API + '/device/device/get', {content: JSON.stringify(condition)})
  }
  // 获取设备列表接口
  search(condition) {
      return this.http.post( API + '/device/device/search', {content: JSON.stringify(condition)})
  }
  // 设置心跳间隔
  heart(condition) {
    return this.http.post( API + '/device/device/heart', {content: JSON.stringify(condition)})
  }
  // 智能锁开锁接口
  unlock(condition){
    return this.http.post( API + '/device/device/unlock',{content:JSON.stringify(condition)})
  }
}
