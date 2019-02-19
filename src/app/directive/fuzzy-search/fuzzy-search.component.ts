import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DictService } from '../../services/dict.service';

export const EXE_COUNTER_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FuzzySearchComponent),
    multi: true
};
@Component({
  selector: 'app-fuzzy-search',
  templateUrl: './fuzzy-search.component.html',
  styleUrls: ['./fuzzy-search.component.css'],
  providers: [DictService,EXE_COUNTER_VALUE_ACCESSOR]
})
export class FuzzySearchComponent implements ControlValueAccessor {
  showDropdownFlag = false;
  query = '';
  placeholder = '';
  items: Array<any> = [];
  @Input() type: string;
  @Output() childQuery = new EventEmitter();
  pass_value: any;
  // 传递出去值的方法
  pull_value:any;
  constructor(private dicService: DictService) {}
  ngOnInit() {
    // 根据type显示对应的placeholder
    switch (this.type) {
      case 'enterprise':
        this.placeholder = '请输入单位名称';
        break;
      case 'parent_enterprise':
        this.placeholder = '请输入上级单位名称';
        break;
      case 'station':
        this.placeholder = '请输入设备组名称';
        break;
      case 'device':
        this.placeholder = '请输入设备名称';
        break;
      case 'user':
        this.placeholder = '请输入手机号';
        break;
      case 'systemgroup':
        this.placeholder = '请输入系统用户组';
        break;
      case 'systemuser':
        this.placeholder = '请输入系统用户'
        break;
    }
    window.document.addEventListener('click', () => {
      this.showDropdownFlag = false;
    });
  }
  inputChange(value) {
    if (value !== '') {
      console.log(value);
      const condition = {
        type: this.type,
        query: value,
        limit: 20,
        offset: 0
      };
      this.dicService.search(condition).subscribe(
          data => {
              console.log(data);
              this.items = (<any>data).data;
              console.log(this.items);
              this.showDropdownFlag = true;
          });
    } else {
      this.showDropdownFlag = false;
      // this.childQuery.emit({id: 0});
      this.pull_value({id:0,name:''})
    }
  }
  clickItem(item) {
    switch (this.type) {
      case 'station' : case 'enterprise': case 'systemuser' : case 'systemgroup' :
        this.query = item.name;
        this.showDropdownFlag = false;
        this.childQuery.emit(item);
        this.pull_value(item)
        break;
      case 'device':
        this.query = item.device_number;
        this.showDropdownFlag = false;
        this.childQuery.emit(item);
        this.pull_value(item)
        break;
    }
  }
  writeValue(value: any){
      if(value){
         this.pass_value = value;
      }
  }
  registerOnChange(fn: any){
      this.pull_value = fn;
  }
  registerOnTouched(fn: any){}
}
