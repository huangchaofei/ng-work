import { Component, OnInit } from '@angular/core';
import { WorkService } from '../../services/work.service';
import { ActivatedRoute } from '@angular/router'
import G2 from '@antv/g2';
@Component({
  selector: 'app-work-order',
  templateUrl: './work-order.component.html',
  styleUrls: ['./work-order.component.css']
})
export class WorkOrderComponent implements OnInit {
  info = {
    query:'',
    offset:0,
    limit:20,
    order_by:'uploaded_at',
    order:'desc',
    total:0,
    page: 1
  }
  top_lsit = [];
  push_list = [];
  dataSet = [];
  chart;
  // 上面图表的数据
  searchStatistics(){
    const condition = {
        uploaded_at: this.routerInfo.snapshot.params.date
    }
    this.workService.statistics(condition).subscribe((res)=>{
      console.log(res)
      this.top_lsit = res['data'];
          this.info.total = res['data'].length;
          const arr = []
          for(var i = 0; i< this.top_lsit.length;i++){
              const obj = {name:this.top_lsit[i].name,'推送次数':this.top_lsit[i].value}
              arr.push(obj)
          }
          console.log(arr)
          this.chart.changeData(arr);
    })
  }
  // 下面列表的数据
  search(){
    const condition = {
      query:this.info.query,
      offset:this.info.offset,
      limit:this.info.limit,
      order_by:this.info.order_by,
      order:this.info.order,
      total:this.info.total,
      uploaded_at: this.routerInfo.snapshot.params.date
    }
    this.workService.push(condition).subscribe((res)=>{
      console.log(res)
      this.push_list = res['data']['list'];
      this.info.total = res['data']['total'];
    })
  }
  constructor(private workService: WorkService,
              private routerInfo: ActivatedRoute) { }

  ngOnInit() {
    console.log(this.routerInfo.snapshot.params);
    this.searchStatistics();
    this.search();
    this.chart = new G2.Chart({
      container: 'chart',
      forceFit: true,
      height: 400,
      width: 800
    });
    this.chart.source(this.top_lsit);
    this.chart.scale('sales', {
      nice: true
    });
    this.chart.interval().position('name*推送次数')
    // .tooltip('未处理');
    this.chart.render();
  }

  changePage($event){
    this.info.offset = ($event - 1) * this.info.limit;
    this.search();
  }

}
