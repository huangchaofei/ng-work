import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../../global';
@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(private http: HttpClient) { }
  // 获取登录日志列表接口
  search(condition) {
      return this.http.post( API + '/system/login/search', {content: JSON.stringify(condition)})
  }
}
