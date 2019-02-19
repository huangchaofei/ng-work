import { Component, OnInit, ViewChild, } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService, zh_CN } from 'ng-zorro-antd';
import { StationService } from '../../services/station.service';
import { ChooseAddressComponent } from '../../directive/choose-address/choose-address.component';
import { FuzzySearchComponent } from '../../directive/fuzzy-search/fuzzy-search.component';

@Component({
  selector: 'app-station-list',
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.css'],
  providers: [ StationService ]
})
export class StationListComponent implements OnInit {
  enterprise_item = {id:0,name:''};
  station_item = {id:0,name:''};
  @ViewChild(ChooseAddressComponent)
  choose_address: ChooseAddressComponent;
  station_list: Array<any> = [];
  auth = JSON.parse(window.localStorage.getItem('authId')) || [];
  info = {
    loading: false,
    station_obj:{
        id:'',
        name:''
    },
    enter_obj:{
        id:'',
        name:''
    },
    query: '',
    total: 0,
    pageCnt: 0,
    page: 1,
    offset: 0,
    limit: 20,
    status: '0',
    provider: '全部',
    open_type: '全部',
    order_by: 'created_at',
    order: 'desc',
    query_name: '',
    query_station_group: '',
    query_station_group_id: '',
    show_loading_modal: false,
    show_another_screen: false,
    show_dropdown_station_list: false,
    station_group: '',
    station_group_id: '',
    export_all: false,
    enterprise_name: '',
    enterprise_id: '',
    monitor_type: 'normal',
  };
  constructor(private stationService: StationService, private router: Router, private message: NzMessageService) { }

  ngOnInit() {
      console.log(this.choose_address)
      this.search()
  }
  search() {
    const condition = {
      status: this.info.status,
      province_id: this.choose_address.provinceOption === undefined ? 0 : this.choose_address.provinceOption.id,
      city_id: this.choose_address.cityOption === undefined ? 0 : this.choose_address.cityOption.id,
      district_id: this.choose_address.districtOption === undefined ? 0 : this.choose_address.districtOption.id,
      station_obj:{id:this.station_item.id,name:this.station_item.name},
      enter_obj:{id:this.enterprise_item.id,name:this.enterprise_item.name},
      offset: this.info.offset,
      total: this.info.total,
      limit: this.info.limit,
      order_by: this.info.order_by,
      order: this.info.order,
    };
    this.info.loading = true;
    this.stationService.search(condition)
        .subscribe(data => {
          console.log(data);
          this.station_list = (<any>data).data.list;
          this.info.total = (<any>data).data.total;
          this.info.loading = false;
        });
  }
  changePage($event) {
    console.log($event);
    this.info.offset = ($event - 1) * this.info.limit;
    this.search();
  }
  // 删除
  delete(data){
      console.log(data)
      const condition = {
          id: data.id
      }
      this.stationService.delete(condition).subscribe((res) => {
          console.log(res)
          this.message.success('删除成功')
          this.search()
      })
  }
}
