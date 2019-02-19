import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../../global';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }
  login(condition) {
    return this.http.post(API+'/system/user/login', {content: JSON.stringify(condition)});
  }
  // 退出
  logout() {
      return this.http.post( API + '/system/user/logout',null)
  }

  // 更改系统用户密码
  update(condition) {
      return this.http.post( API + '/system/pwd/update', {content: JSON.stringify(condition)})
  }
}
