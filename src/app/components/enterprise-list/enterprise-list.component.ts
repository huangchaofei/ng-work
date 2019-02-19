import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService, zh_CN } from 'ng-zorro-antd';
import { EnterpriseService } from '../../services/enterprise.service';
import { ChooseAddressComponent } from '../../directive/choose-address/choose-address.component';
import { FuzzySearchComponent } from '../../directive/fuzzy-search/fuzzy-search.component';
@Component({
  selector: 'app-enterprise-list',
  templateUrl: './enterprise-list.component.html',
  styleUrls: ['./enterprise-list.component.css'],
  providers: [ EnterpriseService ]
})
export class EnterpriseListComponent implements OnInit {
  enterprise_item= {id:0,name:''};
  parent_enterprise_item = {id:0,name:''};
  @ViewChild(ChooseAddressComponent)
  choose_address: ChooseAddressComponent
  enterprise_list:Array<any> = []
  auth = JSON.parse(window.localStorage.getItem('authId')) || [];
  info = {
    loading:false,
    enter_obj:{
        id:'',
        name:''
    },
    parent_id:0,
    query: '',
    total: 0,
    pageCnt: 0,
    page: 1,
    offset: 0,
    limit: 20,
    code:'',
    level:'0',
    order_by: 'created_at',
    order: 'desc',
  }
  constructor(private enterpriseService: EnterpriseService, private message: NzMessageService) { }

  ngOnInit() {
      this.search()
  }
  search() {
    console.log(this.enterprise_item)
    const condition = {
      enter_obj:{id:this.enterprise_item.id,name:this.enterprise_item.name},
      // province_id: this.choose_address.provinceOption === undefined ? 0 : this.choose_address.provinceOption.id,
      // city_id: this.choose_address.cityOption === undefined ? 0 : this.choose_address.cityOption.id,
      // district_id: this.choose_address.districtOption === undefined ? 0 : this.choose_address.districtOption.id,
      parent_id:this.parent_enterprise_item.id,
      province_id: 0,
      city_id: 0,
      district_id: 0,
      code: this.info.code,
      level: this.info.level,
      offset: this.info.offset,
      total: this.info.total,
      limit: this.info.limit,
      order_by: this.info.order_by,
      order: this.info.order,
    };
    this.info.loading = true;
    this.enterpriseService.search(condition)
        .subscribe(data => {
          console.log(data);
          this.enterprise_list = (<any>data).data.list;
          this.info.total = (<any>data).data.total;
          this.info.loading = false;
        });
  }
  changePage($event) {
    console.log($event);
    this.info.offset = ($event - 1) * this.info.limit;
    this.search();
  }
  getEnterprise($event) {
    console.log($event);
  }
  getStation($event) {
    this.info.query = $event.name;
  }
  submit(){
      
  }
  // 删除
  delete(data){
      console.log(data)
      const condition = {
          id: data.id
      }
      this.enterpriseService.delete(condition).subscribe((res) => {
          console.log(res)
          this.message.success('删除成功')
          this.search()
      })
  }
}
