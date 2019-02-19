import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { SystemUserService } from '../../services/system-user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { NzIconService } from 'ng-zorro-antd';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  providers: [SystemUserService, LoginService]
})
export class MainComponent implements OnInit {
  editForm: FormGroup;
  title = 'app';
  isCollapsed = false;
  isVisible:boolean = false;
  systemInfo = { 
      name: '',
      system_group_modules:[],
      id: ''
  }
  openMap = {
    sub1: false,
    sub2: false,
    sub3: false,
    sub4: false,
    sub5: false,
    sub6: false
  };
  openHandler(value: string): void {
    for (const key in this.openMap) {
      if (key !== value) {
        this.openMap[key] = false;
      }
    }
  }
  constructor(private loginService: LoginService, 
              private systemUserService: SystemUserService, 
              private router: Router,
              private message: NzMessageService,
              private iconService: NzIconService) { }

  ngOnInit() {
    this.iconService.fetchFromIconfont({
       scriptUrl: '../../../assets/font/iconfont.js'
    })
    // this.getCurrent()
    this.systemInfo = JSON.parse(window.localStorage.getItem('systemInfo'));
    this.menuShow(this.systemInfo.system_group_modules)
    this.editForm = new FormGroup({
      'oldPwd': new FormControl('',Validators.required),
      'newPwd': new FormControl('',Validators.required),
      'confirmPwd': new FormControl('',Validators.required)
    })
  }
  // 获取当前登录信息
  getCurrent(){
    this.systemUserService.getcurrent().subscribe((res) => {
      this.systemInfo = res['data']
      let arr = [];
      for(var i =0; i< this.systemInfo.system_group_modules.length;i++){
          arr.push(Number(this.systemInfo.system_group_modules[i].module_id));
      }
      window.localStorage.setItem('authId',JSON.stringify(arr));
      window.localStorage.setItem('systemInfo',JSON.stringify(this.systemInfo));
      // 封装侧边栏展示
      this.menuShow(this.systemInfo.system_group_modules)
    })
  }
  // 跳转地图
  goMap(){
      this.router.navigate(['/bigMap'])
  }
  // 退出
  logout() {
    this.loginService.logout().subscribe((res) =>{
       this.router.navigate(['/login'])
    })
  }
  
  // 修改密码
  editPwd() {
    this.isVisible = true
  }

  handleCancel() {
    this.isVisible = false
  }
  handleOk() {
   console.log(this.editForm)
   if(this.editForm.value.oldPwd == ''){
     this.message.warning('请输入原密码')
     return false
   }
   if(this.editForm.value.newPwd == ''){
     this.message.warning('请输入新密码')
     return false
   }
   if(this.editForm.value.confirmPwd == ""){
     this.message.warning('请输入确认密码')
     return false
   }
   if(!this.editForm.invalid){
     const condition = {
       oldPwd:this.editForm.value.oldPwd,
       newPwd:this.editForm.value.newPwd,
       confirm:this.editForm.value.confirmPwd
     }
     this.loginService.update(condition).subscribe((res) => {
         console.log(res)
         if(res['code'] == 0){
           this.message.success('修改成功')
           this.editForm.reset();
           this.isVisible = false
         }
     })
   }
  }
  one:any = []
  two:any = []
  three:any = []
  four:any = []
  menuShow(rights){
      let level_one = []
      let level_two = []
      let level_three = []
      let level_four = []
      for(var i in rights){
          if(rights[i].level == 1){
              rights[i].child = []
              rights[i].buttonRights = []
              level_one.push(rights[i])
          }else if(rights[i].level == 2){
              rights[i].child = []
              rights[i].frontRoute = null
              rights[i].collapseName = null
              rights[i].buttonRights = []
              level_two.push(rights[i])
          }else if(rights[i].level == 3) {
              rights[i].child = []
              rights[i].frontRoute = null
              rights[i].buttonRights = []
              level_three.push(rights[i])
          }else if(rights[i].level == 4){
              rights[i].child = []
              rights[i].buttonRights = []
              level_four.push(rights[i])
          }
      }
      // 
      for(var i in level_one){
           level_one[i].openMap = 'openMap.sub'+ (Number(i)+1)
           level_one[i].sub = 'sub'+(Number(i)+1)
      }
      for(var i in level_one){
          for(var j in level_two){
              if(level_two[j].parent_id == level_one[i].module_id){
                  switch (level_two[j].key) {
                          // 首页菜单
                      case "indexMenu":
                           level_two[j].url = '/index'
                           level_one[i].child.push(level_two[j])
                           break;
                           // 公司菜单
                      case "enterpriseMenu":
                           level_two[j].url = '/enterprise'
                           level_one[i].child.push(level_two[j])
                           break;
                           // 设备组
                      case "stationMenu":
                           level_two[j].url = '/station'
                           level_one[i].child.push(level_two[j])
                           break;
                           // 设备详情
                      // case "deviceMenu":
                      //      // level_two[j].url = '/device'
                      //      level_one[i].child.push(level_two[j])
                      //      break;
                      // 三级菜单
                      case "deviceDetailModule":
                           level_two[j].url = ''
                           level_one[i].child.push(level_two[j])
                           break;
                           // 智能节点
                      case "wellCoverMenu":
                           level_two[j].url = '/device/wellCover'
                           level_one[i].child.push(level_two[j])
                           break;
                           // 智能锁
                      case "lockMenu":
                           level_two[j].url = '/device/lock'
                           level_one[i].child.push(level_two[j])
                           break;
                           // 烟感
                      case "smokeMenu":
                           level_two[j].url = '/device/smoke'
                           level_one[i].child.push(level_two[j])
                           break;
                           // 门磁
                      case "doorMenu":
                           level_two[j].url = '/device/door'
                           level_one[i].child.push(level_two[j])
                           break;
                           // 断路监测仪
                      case "monitorMenu":
                           level_two[j].url = '/device/monitor'
                           level_two[j].name = '故障指示器'
                           level_one[i].child.push(level_two[j])
                           break;
                           // 报警管理
                      case "workMenu":
                           level_two[j].url = '/work'
                           level_one[i].child.push(level_two[j])
                           break;
                           // 推送管理
                      case "workOrderMenu":
                           level_two[j].url = '/work/Order'
                           level_one[i].child.push(level_two[j])
                           break;
                           // 日志
                      case "logMenu":
                           level_two[j].url = '/log'
                           level_one[i].child.push(level_two[j])
                           break;
                           // 报警统计
                      case "statisticsMenu":
                           level_two[j].url = '/statistics'
                           level_one[i].child.push(level_two[j])
                           break;
                           // 推送统计
                      case "pushStatisticsMenu":
                           level_two[j].url = '/statistics/pushStatistics'
                           level_one[i].child.push(level_two[j])
                           break;
                           // 系统用户
                      case "systemUserMenu":
                           level_two[j].url = '/systemUser'
                           level_one[i].child.push(level_two[j])
                           break;
                      case "systemUserGroupMenu":
                           level_two[j].url = '/systemUserGroup'
                           level_one[i].child.push(level_two[j])
                           break;
                           // 设备组管理
                      case "deviceGroupMenu":
                           level_two[j].url = '/deviceGroup'
                           level_one[i].child.push(level_two[j])
                           break;
                  }
              }
          }
      }

      // 遍历二级和三级菜单四级
      for(let  i in level_two){
          for(let l in level_three){
              if(level_three[l].parent_id == level_two[i].module_id){
                  switch (level_three[l].key) {
                      // 设备列表
                      case "deviceMenu":
                           level_three[l].url = '/device'
                           level_two[i].child.push(level_three[l])
                           break;
                      // 智能节点
                      case "wellCoverMenu":
                           level_three[l].url = '/device/wellCover'
                           level_two[i].child.push(level_three[l])
                           break;
                           // 智能锁
                      case "lockMenu":
                           level_three[l].url = '/device/lock'
                           level_two[i].child.push(level_three[l])
                           break;
                           // 烟感
                      case "smokeMenu":
                           level_three[l].url = '/device/smoke'
                           level_two[i].child.push(level_three[l])
                           break;
                           // 门磁
                      case "doorMenu":
                           level_three[l].url = '/device/door'
                           level_two[i].child.push(level_three[l])
                           break;
                           // 断路监测仪
                      case "monitorMenu":
                           level_three[l].url = '/device/monitor'
                           level_three[l].name = '故障指示器'
                           level_two[i].child.push(level_three[l])
                           break;
                  }
                  // level_two[i].child.push(level_three[l])
              }
              
          }
          for(var k in level_four){
              if(level_four[k].parent_id == level_two[i].module_id){
                  level_two[i].buttonRights.push(level_four[k])
              }
          }
      }
      for(let m in level_three){
          for(let k in level_four){
               if(level_four[k].parent_id == level_three[m].module_id){
                   level_three[m].buttonRights.push(level_four[k])
               }
           }
      }
      console.log(level_one)
      this.one = level_one;
      this.two = level_two;
      this.three = level_three;
      this.four = level_four;
      window.localStorage.setItem('auth',JSON.stringify(level_one))
  }


}
