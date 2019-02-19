import { Component, OnInit } from '@angular/core';
import { SystemUserGroupService } from '../../services/system-user-group.service';
import { NzMessageService, zh_CN } from 'ng-zorro-antd';


@Component({
  selector: 'app-system-user-group-list',
  templateUrl: './system-user-group-list.component.html',
  styleUrls: ['./system-user-group-list.component.css']
})
export class SystemUserGroupListComponent implements OnInit {
  auth = JSON.parse(window.localStorage.getItem('authId')) || [];
  systemUserGroupObj = {id:0,name:''};
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
  systemUserGroup_list = [];
  systemUserGroupId = '';
  constructor(private systemUserGroupService: SystemUserGroupService,
              private message: NzMessageService) { }

  ngOnInit() {
      this.systemUserGroupId = window.localStorage.getItem('group_id');
      this.search();
  }
  search(){
      const condition = {
          system_group_obj:{id:this.systemUserGroupObj.id,name:this.systemUserGroupObj.name},
          order_by:this.info.order_by,
          order:this.info.order,
          offset:this.info.offset,
          limit:this.info.limit
      }
      this.info.loading = true
      this.systemUserGroupService.search(condition).subscribe((res)=>{
          console.log(res)
          this.systemUserGroup_list = res['data']['list']
          this.info.total = res['data']['total']
          this.info.loading = false
      })
  }
  // 删除
  delete(data){
      console.log(data)
      const condition = {
          id: data.id
      }
      this.systemUserGroupService.delete(condition).subscribe((res) => {
          console.log(res)
          if(res['code'] === 0){
              this.message.success('删除成功');
              this.search();
          }
      })
  }
  changePage($event) {
    this.info.offset = ($event - 1) * this.info.limit;
    this.search();
  }

}
