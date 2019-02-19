import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../../global';
@Injectable({
  providedIn: 'root'
})
export class SystemUserService {

  constructor(private http: HttpClient) { }
  // 获取当前登录信息
  getcurrent() {
      return this.http.post( API + '/system/user/getcurrent',null)
  }
  // 系统用户重置密码
  reset(condition) {
      return this.http.post( API + '/system/user/reset', {content: JSON.stringify(condition)})
  }
  // 新增系统用户
  add(condition) {
      return this.http.post( API + '/system/user/add', {content: JSON.stringify(condition)})
  }
  // 更新系统用户
  update(condition) {
      return this.http.post( API + '/system/user/update', {content: JSON.stringify(condition)})
  }
  // 获取系统用户列表
  search(condition) {
      return this.http.post( API + '/system/user/search', {content: JSON.stringify(condition)})
  }
  // 删除系统用户
  delete(condition) {
      return this.http.post( API + '/system/user/delete', {content: JSON.stringify(condition)})
  }

  get(condition) {
    return this.http.post( API + '/system/user/get', {content: JSON.stringify(condition)})
  }
  // 获取系统账户下绑定的设备组接口
  assignSearch(condition){
    return this.http.post( API + '/station/assign/search',{content: JSON.stringify(condition)})
  }
  // 获取每个账户下面绑定的设备组
  statistics(){
    return this.http.post( API + '/system/user/statistics',null)
  }
  // 判断是否登录
  isLogin(){
      let boolean;
      this.http.post( API + '/system/user/getcurrent',null).subscribe((res=>{
          if(res['code'] == 0){
              boolean ===  true
          }else{
              boolean === false
          }
          return boolean
      }))
  }
}
