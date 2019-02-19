import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DictService } from '../../services/dict.service';

export const EXE_COUNTER_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FormChooseStationComponent),
    multi: true
};
@Component({
  selector: 'app-form-choose-station',
  templateUrl: './form-choose-station.component.html',
  styleUrls: ['./form-choose-station.component.css'],
  providers: [ EXE_COUNTER_VALUE_ACCESSOR ]
})
export class FormChooseStationComponent implements ControlValueAccessor {
  isVisible = false;
  station_id;
  editStationId;
  stations = [];
  constructor(private dictService: DictService) { }

  ngOnInit() {
  }
  writeValue(value :any){
      if(value) {
          this.station_id = value
      }
  }
  registerOnChange(fn: any){
      this.editStationId = fn
  }
  registerOnTouched(fn: any){}
  //初始化时先获取可以选择的归属站点
  getEnterprise() {
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
  changeStationId($event) {
      console.log($event)
      this.editStationId(this.station_id)
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
  // 取消选中的公司
  cancel() {
    this.station_id = '';
    this.isVisible = false;
  }
}
