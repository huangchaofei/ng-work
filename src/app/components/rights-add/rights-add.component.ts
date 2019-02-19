import { Component, OnInit } from '@angular/core';
import { RightsService } from '../../services/rights.service';
import { DictService } from '../../services/dict.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-rights-add',
  templateUrl: './rights-add.component.html',
  styleUrls: ['./rights-add.component.css']
})
export class RightsAddComponent implements OnInit {
  info = {
      level:'',
      purchase_type:'1',
      module_type:'',
      name:'',
      key:'',
      parent_id:''
  }
  parent_list = [];
  constructor(private rightService: RightsService,
              private message: NzMessageService,
              private dictService: DictService) { }

  ngOnInit() {
      this.RightsFrommat()
  }
  confirm(){
      if(this.info.level == ''){
          this.message.warning('请选择权限级别')
          return false;
      }
      if(this.info.level != '1' && this.info.parent_id == ''){
          this.message.warning('请选择上级权限')
          return false;
      }
      if(this.info.module_type == ''){
          this.message.warning('请选择权限类型')
          return false;
      }
      if(this.info.purchase_type == '0'){
          this.message.warning('请选择计费参数')
          return false
      }
      if(this.info.name == ''){
          this.message.warning('请输入权限名称')
          return false;
      }
      if(this.info.key == ''){
          this.message.warning('请输入权限标识')
          return false
      }
      const condition = {
          name:this.info.name,
          key:this.info.key,
          purchase_type:this.info.purchase_type,
          module_type:this.info.module_type,
          parent_id:this.info.parent_id,
          level:this.info.level
      }
      console.log(condition)
      this.rightService.add(condition).subscribe((res)=>{
          if(res['code']==0){
              this.message.success('添加成功')
              this.info = {
                  level:'',
                  purchase_type:'1',
                  module_type:'',
                  name:'',
                  key:'',
                  parent_id:''
              }
              this.RightsFrommat()
          }
      })
  }
  levelChange($event){
      switch ($event) {
          case "2":
              this.parent_list = this.level_one
              break;
          case "3":
              this.parent_list = this.level_two
              break;
          case "4":
              this.parent_list = this.level_two
              break;
      }
  }
   level_one;
   level_two;
   level_three;
   level_four;
   // 重新封装权限
   RightsFrommat() {
       this.level_one = [];
       this.level_two = [];
       this.level_three = [];
       this.level_four = [];
       const condition = {
          type:'system_modules_new'
      }
      this.dictService.search(condition).subscribe((res)=>{
          const rights = res['data']
          for(var i in rights){
              switch (rights[i].level) {
                  case "1":
                      this.level_one.push(rights[i])
                      break;
                  case "2":
                      this.level_two.push(rights[i])
                      break;
                  case "3":
                      this.level_three.push(rights[i])
                      break;
                  case "4":
                      this.level_four.push(rights[i])
              }
          }
      }) 
   }

}
