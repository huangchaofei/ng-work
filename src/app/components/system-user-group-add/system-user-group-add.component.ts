import { Component, OnInit, ViewChild } from '@angular/core';
import { NzFormatEmitEvent, NzTreeNode, NzMessageService } from 'ng-zorro-antd';
import { SystemUserGroupService } from '../../services/system-user-group.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-system-user-group-add',
  templateUrl: './system-user-group-add.component.html',
  styleUrls: ['./system-user-group-add.component.css']
})
export class SystemUserGroupAddComponent implements OnInit {
   @ViewChild('tree') tree;

  constructor(private message: NzMessageService, private systemUserGroupService: SystemUserGroupService,
              private router: Router) { }

  ngOnInit() {
      this.renderAuth();
  }
  info = {
      enterprise_id:'',
      name:'',
      remarks:'',
  }
  // 重新封装权限
  auth = [];
  level_one:any = [];
  level_two:any = [];
  level_three:any = [];
  level_four:any = [];
  renderAuth(){
      let auth:any = JSON.parse(window.localStorage.getItem('auth'))
      for(var i = 0; i< auth.length; i++){
          // 一级权限
          auth[i].checked = false;
          this.level_one.push(auth[i])
          // 二级权限
          if(auth[i].child.length > 0){
              for(var j =0; j < auth[i].child.length; j++){
                  this.level_two.push(auth[i].child[j])
                  auth[i].child[j].checked = false
                  const item = auth[i].child[j]
                  if(item.buttonRights.length > 0){
                      for(var k =0; k < item.buttonRights.length;k++){
                          this.level_four.push(item.buttonRights[k])
                          item.buttonRights[k].checked = false;
                      }
                  }
                  //三级权限
                  if(auth[i].child[j].child.length > 0){
                      for(var k = 0; k< auth[i].child[j].child.length;k++){
                          auth[i].child[j].child[k].checked = false;
                          this.level_three.push(auth[i].child[j].child[k])
                          for(var l = 0; l < auth[i].child[j].child[k].buttonRights.length; l++){
                              auth[i].child[j].child[k].buttonRights[l].checked = false;
                              this.level_four.push(auth[i].child[j].child[k].buttonRights[l]);
                          }
                      }
                  }
              }
          }
      }
      this.auth = auth;
      console.log(auth)
      /*let arr = []
      // 1级
      for(var i = 0;i < auth.length; i++){
           let arr1 = [];
           let item = auth[i]
           let obj_one:any = {}
           obj_one.title = auth[i].name;
           obj_one.key = auth[i].key;
           obj_one.children = [];
           obj_one.module_id = auth[i].module_id;
           obj_one.purchase_type = auth[i].purchase_type;
           // 2级
           for(var j = 0; j < item.child.length; j++ ){
               console.log(item.child[j])
               let obj_two:any = {};
               // 如果2级有按钮权限
               if(item.child[j].buttonRights.length > 0){
                   obj_two.isLeaf = false;
                   obj_two.children = [];
                   for(var k =0; k < item.child[j].buttonRights.length;k++){
                       let btn_obj:any = {}
                       btn_obj.title = item.child[j].buttonRights[k].name;
                       btn_obj.key = item.child[j].buttonRights[k].key;
                       btn_obj.module_id = item.child[j].buttonRights[k].module_id;
                       btn_obj.purchase_type = item.child[j].buttonRights[k].purchase_type;
                       btn_obj.isLeaf = true
                       obj_two.children.push(btn_obj)
                   }
               }else{
                   obj_two.isLeaf = true;
               }
               obj_two.title = item.child[j].name;
               obj_two.key = item.child[j].key;
               obj_two.module_id = item.child[j].module_id;
               obj_two.purchase_type = item.child[j].purchase_type;
               obj_one.children.push(obj_two)
           }
           arr1.push(obj_one)
           arr.push(arr1)
      }
      console.log(arr)
      this.auth = arr;*/
  }
  // nzEvent(event: NzFormatEmitEvent): void {
  //   console.log(event);
  //   console.log(this.auth)
  // }
  levelOneChange($event,item){
      console.log($event) 
      console.log(item)
      if($event){
          for(var i =0; i<this.level_two.length;i++){
              if(this.level_two[i].parent_id == item.module_id){
                  this.level_two[i].checked = true;
                  for(var j = 0; j < this.level_four.length; j++){
                      if(this.level_four[j].parent_id == this.level_two[i].module_id){
                          this.level_four[j].checked = true;
                      }
                  }
                  for(var k = 0; k < this.level_three.length; k++){
                      if(this.level_three[k].parent_id == this.level_two[i].module_id){
                          this.level_three[k].checked = true;
                          for(var j = 0; j < this.level_four.length; j++){
                              if(this.level_four[j].parent_id == this.level_three[k].module_id){
                                  this.level_four[j].checked = true;
                              }
                          }
                      }
                  }
              }
          }
      }else{
          for(var i =0; i<this.level_two.length;i++){
              if(this.level_two[i].parent_id == item.module_id){
                  this.level_two[i].checked = false;
                  for(var j = 0; j < this.level_four.length; j++){
                      if(this.level_four[j].parent_id == this.level_two[i].module_id){
                          this.level_four[j].checked = false;
                      }
                  }
                  for(var k = 0; k < this.level_three.length; k++){
                      if(this.level_three[k].parent_id == this.level_two[i].module_id){
                          this.level_three[k].checked = false;
                          for(var j = 0; j < this.level_four.length; j++){
                              if(this.level_four[j].parent_id == this.level_three[k].module_id){
                                  this.level_four[j].checked = false;
                              }
                          }
                      }
                  }
              }
          }
          for(var i =0; i<this.level_three.length;i++){
              if(this.level_three[i].parent_id == item.module_id){
                  this.level_three[i].checked = false;
              }
          }
      }
  }
  levelTwoChange($event,item){
      console.log($event)
      console.log(item)
      // 选择的是2级
      if(item.level == 2){
          for(var i = 0; i<this.level_one.length; i++){
              if(item.parent_id == this.level_one[i].module_id){
                  this.level_one[i].checked = true;
              }
          }
          if($event){
              if(item.child.length > 0){
                  for(var i = 0; i < item.child.length; i++){
                      item.child[i].checked = true;
                      for(var k = 0; k< item.child[i].buttonRights.length; k++){
                          item.child[i].buttonRights[k].checked = true;
                      }
                  }
              }
              for(var k = 0; k < item.buttonRights.length; k++){
                  item.buttonRights[k].checked = true;
              }
          }else{
              for(var k = 0; k < item.buttonRights.length; k++){
                  item.buttonRights[k].checked = false;
              }
              if(item.child.length > 0){
                  for(var i = 0; i < item.child.length; i++){
                      item.child[i].checked = false;
                      for(var k = 0; k< item.child[i].buttonRights.length; k++){
                          item.child[i].buttonRights[k].checked = false;
                      }
                  }
              }
          }
      }

  }
  levelThreeChange($event,item){
      //选择的3级
      if(item.level ==3 ){
          for(var i = 0;i< this.level_two.length; i++){
              if(item.parent_id == this.level_two[i].module_id){
                  this.level_two[i].checked = true
              }
          }
          if($event){
              for(var k = 0; k < item.buttonRights.length; k++){
                  item.buttonRights[k].checked = true;
              }
          }else{
              for(var k = 0; k < item.buttonRights.length; k++){
                  item.buttonRights[k].checked = false;
              }
          }
      }
  }
  levelFourChange($event,item){
      console.log($event)
      console.log(item)
      // 4级的话
      if(item.level == 4){
          for(var k =0; k<this.level_two.length;k++){
              if(item.parent_id == this.level_two[k].module_id){
                  this.level_two[k].checked = true
                  if($event){
                      for(var l =0; l<this.level_one.length;l++){
                          if(this.level_two[k].parent_id == this.level_one[l].module_id){
                              this.level_one[l].checked = true;
                          }
                      }
                  }
              }
          }
      }
  }
  submit(){
      const auth = this.auth
      const arr = [];
      if(this.info.name == ''){
          this.message.warning("请输入系统用户组名称");
          return false;
      }
      if(this.info.enterprise_id == ''){
          this.message.warning('请选择归属公司');
          return false;
      }
      // if(this.info.remarks == ''){
      //     this.message.warning('请输入备注');
      //     return false;
      // }
      for(var i = 0; i < this.level_one.length; i++){
          if(this.level_one[i].checked == true){
              const obj = {module_id:this.level_one[i].module_id,purchase_type:this.level_one[i].purchase_type}
              arr.push(obj)
          }
      }
      for(var j = 0; j < this.level_two.length; j++){
          if(this.level_two[j].checked == true){
              const obj = {module_id:this.level_two[j].module_id,purchase_type:this.level_two[j].purchase_type}
              arr.push(obj)
          }
      }
      for(var l = 0; l < this.level_three.length; l++){
          if(this.level_three[l].checked == true){
              const obj = {module_id:this.level_three[l].module_id,purchase_type:this.level_three[l].purchase_type}
              arr.push(obj)
          }
      }
      for(var k = 0; k< this.level_four.length; k++){
          if(this.level_four[k].checked == true){
              const obj = {module_id:this.level_four[k].module_id,purchase_type:this.level_four[k].purchase_type}
              arr.push(obj)
          }
      }
      console.log(arr)
      if(arr.length == 0){
          this.message.warning('请选择权限');
          return false
      }
      const condition = {
          enterprise_id:this.info.enterprise_id,
          name:this.info.name,
          detail_module:arr,
          remarks:this.info.remarks
      }
      this.systemUserGroupService.add(condition).subscribe((res)=>{
          if(res['code'] == 0){
              this.message.success('添加成功');
              this.router.navigate(['/systemUserGroup'])
              return false;
          }
      })
  }
}
