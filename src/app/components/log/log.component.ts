import { Component, OnInit } from '@angular/core';
import { LogService } from '../../services/log.service';
import * as moment from 'moment';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {
  dateFormat = 'yyyy/MM/dd';
  dataSet = [];
  logList = [];

  info = {
      created_st: moment().subtract(30,'day').format('YYYY-MM-DD'),
      created_et: moment().format('YYYY-MM-DD'),
      search_date: [moment().subtract(30,'day').format(), moment().format()],
      offset: 0,
      limit: 20,
      order_by: 'created_at',
      order: 'desc',
      total: 0
  }
  constructor(private logService: LogService) { }

  ngOnInit() {
      this.search()
  }
  search() {
      const condition = {
          // created_st: this.info.created_st,
          // created_et: this.info.created_et,
          created_st: moment(this.info.search_date[0]).format('YYYY-MM-DD'),
          created_et: moment(this.info.search_date[1]).format('YYYY-MM-DD'),
          offset: this.info.offset,
          limit: this.info.limit,
          order_by: this.info.order_by,
          order: this.info.order,
          total: this.info.total
      }
      this.logService.search(condition).subscribe((res)=>{
          console.log(res)
          this.logList = res['data']['list']
          this.info.total = res['data']['total']
      })
  }
  // 时间改变回调
  dateChange($event) {
      console.log($event)
      this.info.search_date[0] = moment().format($event[0])
      this.info.search_date[1] = moment().format($event[1])
  }
  changePage($event) {
    this.info.offset = ($event - 1) * this.info.limit;
    this.search();
  }
}
