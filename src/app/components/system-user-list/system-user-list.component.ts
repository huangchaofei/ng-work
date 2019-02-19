import { Component, OnInit } from '@angular/core';
import { NzMessageService, zh_CN } from 'ng-zorro-antd';
import { SystemUserService } from '../../services/system-user.service';
import { SystemUserGroupService } from '../../services/system-user-group.service';

@Component({
  selector: 'app-system-user-list',
  templateUrl: './system-user-list.component.html',
  styleUrls: ['./system-user-list.component.css']
})
export class SystemUserListComponent implements OnInit {
  auth = JSON.parse(window.localStorage.getItem('authId')) || [];
  systemUserObj = {id:0,name:''};
  systemUserGroupObj = {id:0,name:''};
  // 系统用户
  info = {
      loading:false,
      group_obj:{id: 0, name: ''},
      user_obj:{id: 0, name:''},
      order_by: 'created_at',
      order: 'desc',
      offset:0,
      limit:20,
      total:0,
  }
  // 系统用户组
  group = {
      loading:false,
      system_group_obj:{id:0,name:''},
      order_by: 'created_at',
      order: 'desc',
      offset:0,
      limit:20,
      total:0
  }
  systemUser_list = [];
  systemUserGroup_list;
  search() {
      const condition = {
          group_obj:{id:this.systemUserGroupObj.id,name:this.systemUserGroupObj.name},
          user_obj:{id:this.systemUserObj.id,name:this.systemUserObj.name},
          order_by:this.info.order_by,
          order:this.info.order,
          offset:this.info.offset,
          limit:this.info.limit
      }
      this.info.loading = true
      this.sysUserService.search(condition).subscribe((res) => {
          console.log(res)
          this.systemUser_list = res['data']['list']
          this.info.total = res['data']['total']
          this.info.loading = false
      })
  }
  searchSystemUserGroup(){
      const condition = {
          system_group_obj:{id:this.systemUserGroupObj.id,name:this.systemUserGroupObj.name},
          order_by:this.group.order_by,
          order:this.group.order,
          offset:this.group.offset,
          limit:this.group.limit
      }
      this.group.loading = true
      this.systemUserGroupService.search(condition).subscribe((res)=>{
          console.log(res)
          this.systemUserGroup_list = res['data']['list']
          this.group.total = res['data']['total']
          this.group.loading = false
      })
  }
  // 删除
  delete(data){
      console.log(data)
      const condition = {
          id: data.id
      }
      this.sysUserService.delete(condition).subscribe((res) => {
          console.log(res)
          if(res['code'] === 0){
              this.message.success('删除成功');
              this.search();
          }
      })
  }
  // 删除用户组
  deleteGroup(data) {
      const condition = {
          id: data.id
      }
      this.systemUserGroupService.delete(condition).subscribe((res)=>{
          if(res['code']===0){
              this.message.success('删除成功');
              this.searchSystemUserGroup();
          }
      })
  }
  changePage($event) {
    console.log($event);
    this.info.offset = ($event - 1) * this.info.limit;
    this.search();
  }
  // changeGroupPage($event){
  //   this.group.offset = ($event -1)*this.info.limit;
  //   this.searchSystemUserGroup();
  // }
  getEnterprise($event) {
    console.log($event);
  }
  constructor(private sysUserService: SystemUserService,
              private message: NzMessageService,
              private systemUserGroupService: SystemUserGroupService) { }

  ngOnInit() {
      this.search()
  }
  // change($event){
  //     console.log($event)
  //     switch ($event) {
  //         case 0:
  //             this.search()
  //             break;
  //         case 1:
  //             this.searchSystemUserGroup()
  //             break;
  //     }
  // }

}
