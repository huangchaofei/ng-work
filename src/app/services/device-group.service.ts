import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../../global';
@Injectable({
  providedIn: 'root'
})
export class DeviceGroupService {

  constructor(private http: HttpClient) { }
  // 分配设备组
  assign(condition) {
      return this.http.post( API + '/station/station/assign', {content: JSON.stringify(condition)})
  }
}
