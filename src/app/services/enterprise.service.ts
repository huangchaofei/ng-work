import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../../global';

@Injectable({
  providedIn: 'root'
})
export class EnterpriseService {

  constructor(private http: HttpClient) { }
  // 单位查询接口
  search(condition) {
      return this.http.post( API + '/enterprise/enterprise/search',{content:JSON.stringify(condition)})
  }
  // 添加单位
  add(condition){
      return this.http.post( API + '/enterprise/enterprise/add',{content: JSON.stringify(condition)})
  }
  // 单位更新接口
  update(condition) {
      return this.http.post( API + '/enterprise/enterprise/update', {content: JSON.stringify(condition)})
  }
  // 单位删除接口
  delete(condition) {
      return this.http.post( API + '/enterprise/enterprise/delete', {content: JSON.stringify(condition)})
  }
  // 获取单位详情
  get(condition) {
      return this.http.post( API + '/enterprise/enterprise/get', {content: JSON.stringify(condition)})
  }
  // 根据用户输入的内容获取对应的经纬度
  address(condition) {
      return this.http.post( API + '/enterprise/enterprise/address', {content: JSON.stringify(condition)})
  }
}
