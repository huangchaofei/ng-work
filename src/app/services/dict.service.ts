import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../../global';
@Injectable({
  providedIn: 'root'
})
export class DictService {

  constructor(private http: HttpClient) { }
  // 获取站点设备公司等辅助接口
  search(condition) {
      return this.http.post( API + '/util/util/search', {content: JSON.stringify(condition)})
  }
}
