import { Component, OnInit, EventEmitter, Output, forwardRef } from '@angular/core';
import { DictService } from '../../services/dict.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
export const CITY_VALUE_ACCESSOR:any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(()=>ChooseAreaComponent),
    multi: true
}
@Component({
  selector: 'app-choose-area',
  templateUrl: './choose-area.component.html',
  styleUrls: ['./choose-area.component.css'],
  providers:[ CITY_VALUE_ACCESSOR]
})
export class ChooseAreaComponent implements ControlValueAccessor {
  constructor(private dictService: DictService) { }

  ngOnInit() {
      // 获取省市区
      this.getAreaInfo()
  }
  @Output() areaSearch = new EventEmitter();
  writeValue(value:any){
      if(value){
          this.values = value;
      }
  }
  registerOnChange(fn:any){
      this.pullCity = fn;
  }
  registerOnTouched(){};
  pullCity(_:any){};
  nzOptions = [];
  values:any[] = [];
  area = [];
  onChanges($event){
      console.log($event);
  }
  selectChange(option){
      console.log(option);
      if(option.option.isLeaf === true){
          const cityObj = [];
          const obj = {
              label:option.option.label,
              value:option.option.value
          }
          cityObj.push(obj);
          // 递归循环封装成城市对象
          if(option.option.parent){
              this.recursonCity(cityObj,option.option.parent)
          }else{
              this.area = cityObj;
          }
          console.log(this.area);
          // 获取到城市对象后 调用PullCity传递出去
          this.pullCity(this.area);
            this.areaSearch.emit();
      }
  }
  clear(){
      this.pullCity(null);
        this.areaSearch.emit();
  }
  getAreaInfo(){
      const condition = {
          type:'getAreaInfo'
      }
      this.dictService.search(condition).subscribe((res)=>{
          this.nzOptions = res['data']
          this.recurson(this.nzOptions);
      })
  }
  // 递归循环城市数组
  recurson(arr){
      for(var i of arr){
          i.children?this.recurson(i.children):i.isLeaf = true;
      }
  }

  recursonCity(arr,city){
      const obj = {
          label:city.label,
          value:city.value
      }
      arr.unshift(obj)
      if(city.parent){
          this.recursonCity(arr,city.parent)
      }else{
          this.area = arr;
      }
  }
}
