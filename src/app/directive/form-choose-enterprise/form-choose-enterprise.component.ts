import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { DictService } from '../../services/dict.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const EXE_COUNTER_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FormChooseEnterpriseComponent),
    multi: true
};
@Component({
  selector: 'app-form-choose-enterprise',
  templateUrl: './form-choose-enterprise.component.html',
  styleUrls: ['./form-choose-enterprise.component.css'],
  providers: [ EXE_COUNTER_VALUE_ACCESSOR ]
})
export class FormChooseEnterpriseComponent implements ControlValueAccessor {
  @Input() type
  style = {
    display: 'block',
    height: '30px',
    lineHeight: '30px'
  };
  isVisible = false;
  enterprise = {
    parent_id: ''
  };
  station_id;
  enterprises = [];
  stations = [];
  propagateChange;
  constructor(private dictService: DictService) { }
  changeEnterpriseId($event) {
      console.log($event)
      this.propagateChange(this.enterprise.parent_id)
  }
  changeStationId(id) {
      // this.propagateChange(this.station_id);
      const station1 = this.stations.filter((item,index)=>{
          return item.id == id
      })
      this.propagateChange(station1[0].id)
  }
  changeStationIdOnlyId(id){
      const station1 = this.stations.filter((item,index)=>{
          return item.id == id
      })
      this.propagateChange(station1[0])
  }
  writeValue(value: any) {
      console.log(value)
      if (value) {
        switch(this.type){
          case 'enterprise':
                this.enterprise.parent_id = value
                break;
          case 'station':
               this.station_id = value;
               break;
          case 'onlyStation':
               this.station_id = value;
               break;
          case 'systemUserGroup':
               this.enterprise.parent_id = value
                
        }
      }
  }
  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any) {}
  ngOnInit() {
      switch (this.type) {
          case "enterprise":
              this.getEnterprise()
              break;
          case "station": case 'onlyStationId':
              this.getStation()
              break;
          case 'systemUserGroup':
              this.getEnterpriseByUserGroup()
              break;
      }
  }
  //初始化时先获取可以选择的归属公司 公司添加编辑时最多只能添加3级公司
  getEnterprise() {
      const condition = {
          type:'enterprise',
          query:'',
          limit:999,
          offset:0
      }
      this.dictService.search(condition).subscribe((res) =>{
          console.log(res['data'])
          this.enterprises = res['data']
          let arr = this.enterprises.filter((item,index)=>{
            return item.level < 3
          })
          this.enterprises = arr;
      })
  }
  //初始化时先获取可以选择的归属公司
  getStation() {
      const condition = {
          type:'station',
          query:'',
          limit:999,
          offset:0
      }
      this.dictService.search(condition).subscribe((res) =>{
          console.log(res['data'])
          this.stations = res['data']
      })
  }
  //获取添加编辑系统用户组时可以选择的归属公司
  getEnterpriseByUserGroup(){
      const condition = {
          type:'enterprise',
          query:'',
          limit:999,
          offset:0
      }
      this.dictService.search(condition).subscribe((res) =>{
          console.log(res['data'])
          this.enterprises = res['data']
          let arr = this.enterprises.filter((item,index)=>{
            return item.level < 4
          })
          this.enterprises = arr;
      })
  }
  chooseEnterprise(){
    this.isVisible = true
  }
  chooseStation(){
    this.isVisible = true
  }
  handleCancel(): void {
    this.isVisible = false;
  }
  handleOk(): void {
    this.isVisible = false;
  }
  // 取消选中的公司或公司
  cancel() {
    this.enterprise.parent_id = '';
    this.propagateChange(this.enterprise.parent_id)
    this.station_id = '';
    this.isVisible = false;
  }
}
