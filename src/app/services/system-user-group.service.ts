import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../../global';
@Injectable({
  providedIn: 'root'
})
export class SystemUserGroupService {

  constructor(private http: HttpClient) { }
  // 系统用户组查询接口
  search(condition) {
      return this.http.post( API + '/system/group/search', {content: JSON.stringify(condition)})
  }
  // 系统用户组添加接口
  add(condition) {
      return this.http.post( API + '/system/group/add', {content: JSON.stringify(condition)})
  }
  // 系统用户组编辑接口
  update(condition) {
      return this.http.post( API + '/system/group/update', {content: JSON.stringify(condition)})
  }
  // 系统用户组删除接口
  delete(condition) {
      return this.http.post( API + '/system/group/delete', {content: JSON.stringify(condition)})
  }
  // 获取对应系统用户组的信息
  get(condition) {
      return this.http.post( API + '/system/group/get', {content: JSON.stringify(condition)})
  }
}
