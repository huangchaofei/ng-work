import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService , zh_CN } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import * as moment from 'moment';
import { ChooseAddressComponent } from '../../directive/choose-address/choose-address.component';
import { ChooseEnterpriseComponent } from '../../directive/choose-enterprise/choose-enterprise.component';
import { SystemUserService } from '../../services/system-user.service';
import { FormChooseEnterpriseComponent } from '../../directive/form-choose-enterprise/form-choose-enterprise.component';
import { ChooseSystemUserGroupComponent } from '../../directive/choose-system-user-group/choose-system-user-group.component';
registerLocaleData(zh);
@Component({
  selector: 'app-system-user-add',
  templateUrl: './system-user-add.component.html',
  styleUrls: ['./system-user-add.component.css']
})
export class SystemUserAddComponent implements OnInit {
  @ViewChild(ChooseAddressComponent)
  choose_address: ChooseAddressComponent

  @ViewChild('chooseEnterpriseChild')
  child: ChooseEnterpriseComponent;
  // 传递给选择系统用户组 组件
  parent_id;
  info = {
      name:'',
      gender: '1',
      phone: '',
      email: '',
      realname: '',
      birthday: '',
      province_id: undefined,
      city_id: undefined,
      district_id: undefined,
      province: undefined,
      city: undefined,
      district: undefined,
      address: '',
      type:'1',
      newPwd:''
  }
  enterprises = []
  enterprise = {
    parent_id: ''
  };
  changeEnterprise($event){
      this.parent_id = $event;
  }
  constructor(private sysService: SystemUserService, private message: NzMessageService, private router: Router) { }

  ngOnInit() {
  }
  dateChange($event) {
    console.log($event)
    this.info.birthday = moment($event).format('YYYY-MM-DD')
  }
  submit(form) {
    console.log(form)
    if(form.value.enterprise_id == ''){
      this.message.warning('请选择上级公司')
      return false
    }
    if(form.value.name == '') {
        this.message.warning('请输入用户名')
        return false
    }
    if(form.value.group_id == ''){
      this.message.warning('请选择系统用户组')
      return false
    }
    if(form.valid){
      const condition = form.value
      condition.province_id = this.choose_address.provinceOption ? this.choose_address.provinceOption.id : 0;
      condition.city_id = this.choose_address.cityOption ? this.choose_address.cityOption.id : 0;
      condition.district_id = this.choose_address.districtOption ? this.choose_address.districtOption.id : 0;
      condition.province = this.choose_address.provinceOption ? this.choose_address.provinceOption.name : '';
      condition.city = this.choose_address.cityOption ? this.choose_address.cityOption.name : '';
      condition.district = this.choose_address.districtOption ? this.choose_address.districtOption.name : '';
      this.sysService.add(condition).subscribe((res) =>{
        console.log(res)
        if(res['code'] === 0){
          this.router.navigate(['/systemUser'])
        }
      })
    }
  }
}
