import { Component, OnInit } from '@angular/core';
import { IndexService } from '../../services/index.service';
import { Router } from '@angular/router';
import G2 from '@antv/g2';
import * as moment from 'moment';
@Component({
  selector: 'app-push-statistics',
  templateUrl: './push-statistics.component.html',
  styleUrls: ['./push-statistics.component.css']
})
export class PushStatisticsComponent implements OnInit {
  info = {
    total:0,
    loading:false,
    offset:0,
    limit:20,
    bind_user_id:JSON.parse(window.localStorage.getItem('systemInfo'))
  }
  chart;
  search_date = [moment().month(moment().month()).startOf('month').format(),moment().format()]
  push_list = []
  searchPush(){
      const condition = {
          created_st:moment(this.search_date[0]).format('YYYY-MM-DD'),
          created_et:moment(this.search_date[1]).format('YYYY-MM-DD'),
          order:'desc',
          bind_user_id:this.info.bind_user_id
      }
      this.indexService.statistics(condition).subscribe((res)=>{
          console.log(res)
          this.push_list = res['data'];
          this.info.total = res['data'].length;
          const arr = []
          for(var i = 0; i< this.push_list.length;i++){
              const obj = {year:this.push_list[i].uploaded_at,'推送数量':this.push_list[i].value}
              arr.push(obj)
          }
          console.log(arr)
          this.chart.changeData(arr);
      })
  }
  constructor(private indexService: IndexService,
              private router: Router) { }

  ngOnInit() {
      this.chart = new G2.Chart({
      container: 'chart',
      forceFit: true,
      padding:'auto'
    });
    this.chart.source(this.push_list);
    this.chart.scale('value', {
      min: 0
    });
    this.chart.scale('year', {
      type:'cat',
      range: [0, 1],
      tickCount:10
    });
    this.chart.tooltip({
      crosshairs: {
        type: 'line'
      }
    });
    this.chart.line().position('year*推送数量');
    this.chart.point().position('year*推送数量').size(4).shape('circle').style({
      stroke: '#fff',
      lineWidth: 1
    });
    this.chart.render();
    this.searchPush();
  }
  goDetail(date){
      this.router.navigate(['/work/Order',date],{skipLocationChange: true})
  }
  changePage($event) {
    console.log($event);
    this.info.offset = ($event - 1) * this.info.limit;
    this.searchPush();
  }
}
