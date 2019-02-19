import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule
} from '@angular/forms';
import { Base64 } from 'js-base64';
import { Router } from '@angular/router';
import { LoginService} from '../../services/login.service';
import { SystemUserService } from '../../services/system-user.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;
  user_name = '';
  pass_word = '';
  constructor(private fb: FormBuilder, 
              private message: NzMessageService, 
              private router: Router, 
              private loginService: LoginService,
              private systemUserService: SystemUserService) {
  }
  ngOnInit() {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }
  submitForm(): any {
    console.log(this.validateForm.value);
    if (this.validateForm.value.userName === '' || this.validateForm.value.userName === null) {
      this.message.warning('用户名不能为空');
      return false;
    }
    if (this.validateForm.value.password === '' || this.validateForm.value.password === null) {
      this.message.warning('密码不能为空');
      return false;
    }
    const base = Base64;
    const date = new Date().getTime();
    const res = date + ':' + this.validateForm.value.password;
    const encodePwd = base.encode(res);
    const Pwd = ['System', encodePwd];
    const pwd = Pwd.join(' ');
    const condition = {
      name: this.validateForm.value.userName,
      passwd: pwd
    };
    this.loginService.login(condition)
      .subscribe(data => {
          this.message.success('登录成功');
          this.getCurrent();
      });

  }
  systemInfo:any = {};
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
      window.localStorage.setItem('group_id',this.systemInfo.group_id);
      setTimeout(() => {
        if(this.systemInfo.id == 338021571){
            this.router.navigate(['/device/lock'])
        }else{
            this.router.navigate(['/map']);
        }
      }, 500);
      // 封装侧边栏展示
      // this.menuShow(this.systemInfo.system_group_modules)
    })
  }
}
