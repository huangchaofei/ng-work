import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { DictService } from '../../services/dict.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NzMessageService} from 'ng-zorro-antd';

export const EXE_COUNTER_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ChooseSystemUserGroupComponent),
    multi: true
};
@Component({
  selector: 'app-choose-system-user-group',
  templateUrl: './choose-system-user-group.component.html',
  styleUrls: ['./choose-system-user-group.component.css'],
  providers: [ EXE_COUNTER_VALUE_ACCESSOR ]
})
export class ChooseSystemUserGroupComponent implements ControlValueAccessor {
  @Input() parent_id;
  isVisible = false;
  group_id = '';
  propagateChange;
  groups = [];
  showGroups = [];
  constructor(private dictService: DictService,
              private message: NzMessageService) { }
  changeGroupId($event) {
      console.log(this.propagateChange)
      this.propagateChange($event)
  }
  writeValue(value: any) {
      if(value) {
          this.group_id = value
      }
  }
  registerOnChange(fn: any) {
      this.propagateChange = fn
  }
  registerOnTouched(fn: any) {}
  //初始化时先获取可以选择的归属公司
  getGroup() {
      const condition = {
          type:'systemgroup',
          query:'',
          limit:999,
          offset:0
      }
      this.dictService.search(condition).subscribe((res) =>{
          console.log(res['data'])
          this.showGroups = JSON.parse(JSON.stringify(res['data']))
          this.groups = res['data']
      })
  }
  chooseGroup(){
    if(this.parent_id == '' || this.parent_id == undefined){
      this.message.warning('请选择归属单位');
      this.propagateChange('')
      return false;
    }
    this.groups = this.showGroups.filter((item,index)=>{
      return item.enterprise_id == this.parent_id
    })
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
    this.group_id = '';
    this.isVisible = false;
  }
  ngOnInit() {
      this.getGroup()
  }
}
