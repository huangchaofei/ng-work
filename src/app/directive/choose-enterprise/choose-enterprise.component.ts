import { Component, OnInit, Output, EventEmitter, Input, AfterViewInit } from '@angular/core';
import { DictService } from '../../services/dict.service';

@Component({
  selector: 'app-choose-enterprise',
  templateUrl: './choose-enterprise.component.html',
  styleUrls: ['./choose-enterprise.component.css']
})
export class ChooseEnterpriseComponent implements OnInit {
  @Output() childQuery = new EventEmitter();

  @Input() parent_id
  // @Output() parent_idChange = new EventEmitter();
  style = {
    display: 'block',
    height: '30px',
    lineHeight: '30px'
  };
  isVisible = false;
  enterprise = {
    parent_id: ''
  };
  enterprises:any = [];
  constructor(private dictService: DictService) { }

  ngOnInit() {
    this.getEnterprise()
  }
  ngAfterViewInit(){
      console.log(this.enterprise.parent_id)
  }
  //初始化时先获取可以选择的归属公司
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
          let arr = []
          arr = this.enterprises.filter((item,index)=>{
            return item.level < 4
          })
          this.enterprises = arr;
          this.childQuery.emit({type:'enterprise',data:this.enterprises})
          if(this.parent_id != ''){
            this.enterprise.parent_id = this.parent_id
          }
      })
  }
  showModal(): void {
    this.isVisible = true;
  }
  handleCancel(): void {
    // this.enterprise.parent_id = '';
    // this.childQuery.emit('');
    this.isVisible = false;
  }
  handleOk(): void {
    if (this.enterprise.parent_id !== '') {
      this.childQuery.emit(this.enterprise.parent_id);
    }
    this.isVisible = false;
  }

  // 取消选中的公司
  cancel() {
    this.enterprise.parent_id = '';
    this.childQuery.emit('');
    this.isVisible = false;
  }

}
