import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../../global';
@Injectable({
  providedIn: 'root'
})
export class RightsService {

  constructor(private http: HttpClient) { }
  // 后台添加权限模块入口
  add(condition){
      return this.http.post( API + '/system/purchased/add', {content: JSON.stringify(condition)})
  }
}
