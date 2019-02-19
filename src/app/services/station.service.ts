import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../../global';
@Injectable({
  providedIn: 'root'
})
export class StationService {

  constructor(private http: HttpClient) { }
  // 获取区域列表接口
  search(condition) {
      return this.http.post( API + '/station/station/search', {content: JSON.stringify(condition)})
  }
  // 删除区域
  delete(condition) {
      return this.http.post( API + '/station/station/delete', {content: JSON.stringify(condition)})
  }
  // 获取区域详情
  get(condition) {
      return this.http.post( API + '/station/station/get', {content: JSON.stringify(condition)})
  }
  // 更新区域接口
  update(condition) {
      return this.http.post( API + '/station/station/update', {content: JSON.stringify(condition)})
  }
  // 新增区域接口
  add(condition) {
      return this.http.post( API + '/station/station/add', {content: JSON.stringify(condition)})
  }
}
