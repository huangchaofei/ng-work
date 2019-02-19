import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../../global';

@Injectable({
  providedIn: 'root'
})
export class WorkService {

  constructor(private http: HttpClient) { }
  // 工单下的报警管理
  manage(condition) {
      return this.http.post( API + '/work/warn/manage', {content: JSON.stringify(condition)})
  }
  // 工单下的推送管理列表
  push(condition) {
      return this.http.post( API + '/work/push/manage', {content: JSON.stringify(condition)})
  }
  // 工单下的推送管理顶部的柱状图
  statistics(condition){
      return this.http.post( API + '/work/push/statistics', {content: JSON.stringify(condition)})
  }
  // 工单下的报警详情
  get(condition){
    return this.http.post(API + '/work/warn/get',{content:JSON.stringify(condition)})
  }
  // 工单下的报警处理
  detail(condition){
    return this.http.post( API + '/work/warn/deal',{content:JSON.stringify(condition)})
  }
}
