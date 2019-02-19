import { Component, OnInit } from '@angular/core';
import { IndexService } from '../../services/index.service';
import G2 from '@antv/g2';
import * as moment from 'moment';

@Component({
  selector: 'app-alarm-statistics',
  templateUrl: './alarm-statistics.component.html',
  styleUrls: ['./alarm-statistics.component.css']
})
export class AlarmStatisticsComponent implements OnInit {
  info = {
      total:0,
      loading:false,
      offset:0,
      limit:20,
      type: '0'
  }
  chart;
  search_date = [moment().month(moment().month()).startOf('month').format(),moment().format()]
  warning_list = [];
  //
  searchWarning(){
      const condition = {
          order:'desc',
          created_st:moment(this.search_date[0]).format('YYYY-MM-DD'),
          created_et:moment(this.search_date[1]).format('YYYY-MM-DD'),
          type: this.info.type
      }
      this.indexService.warning(condition).subscribe((res)=>{
          console.log(res)
          this.warning_list = res['data'];
          this.info.total = res['data'].length;
          const arr = []
          for(var i = 0; i< this.warning_list.length;i++){
              const obj = {year:this.warning_list[i].uploaded_at,'报警数量':this.warning_list[i].value}
              arr.push(obj)
          }
          console.log(arr)
          this.chart.changeData(arr);
      })
  }
  onChange(data){
      console.log(data)
  }
  constructor(private indexService: IndexService) { }
  ngOnInit() {
    this.chart = new G2.Chart({
      container: 'chart',
      forceFit: true,
      padding:'auto'
    });
    this.chart.source(this.warning_list);
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
    this.chart.line().position('year*报警数量');
    this.chart.point().position('year*报警数量').size(4).shape('circle').style({
      stroke: '#fff',
      lineWidth: 1
    });
    this.chart.render();
    this.searchWarning()
  }
  changePage($event) {
    console.log($event);
    this.info.offset = ($event - 1) * this.info.limit;
    this.searchWarning();
  }
}
