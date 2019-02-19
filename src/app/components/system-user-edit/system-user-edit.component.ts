import { Component, OnInit, ViewChild } from '@angular/core';
import { SystemUserService } from '../../services/system-user.service';
import { NzMessageService , zh_CN } from 'ng-zorro-antd';
import { ActivatedRoute, Router } from '@angular/router';
import { Base64 } from 'js-base64';
import * as moment from 'moment';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { ChooseAddressComponent } from '../../directive/choose-address/choose-address.component';
registerLocaleData(zh);
@Component({
  selector: 'app-system-user-edit',
  templateUrl: './system-user-edit.component.html',
  styleUrls: ['./system-user-edit.component.css']
})
export class SystemUserEditComponent implements OnInit {
  @ViewChild(ChooseAddressComponent)
  choose_address: ChooseAddressComponent
  systemDetail = {
      enterprise_id: '',
      name:'',
      group_id:'',
      phone:'',
      email:'',
      realname:'',
      face:'',
      gender:'',
      birthday:null,
      country:'',
      address:'',
      type:'',
  }
  constructor(private sysService: SystemUserService, private routeInfo: ActivatedRoute, private message: NzMessageService, private router: Router) { }

  ngOnInit() {
      this.getSystemDetail()
  }
  changeEnterprise($event){
      console.log($event);
      this.systemDetail.enterprise_id = $event;
  }
  getSystemDetail() {
            const id = this.routeInfo.snapshot.params.id
            const date = new Date().getTime();
            const res = date + ":" + id;
            const encodeId = Base64.encode(res)
            const finalId = ['system' , encodeId]
            const systemUserId = finalId.join(' ')
      const condition  = {id: systemUserId}
      this.sysService.get(condition).subscribe((res)=>{
          console.log(res)
          this.systemDetail = res['data']
          this.systemDetail.birthday == '0000-00-00' ? '' : moment((res['data']['birthday'])).format()
      })
  }
  dateChange($event) {
    console.log($event)
    this.systemDetail.birthday = moment($event).format('YYYY-MM-DD')
  }
  submit(form) {
      if(form.value.enterprise_id == ''){
      this.message.warning('请选择上级公司')
      return false
    }
    if(form.value.name == '') {
        this.message.warning('请输入用户名')
        return false
    }
    if(form.value.group_id == '' || form.value.group_id == undefined){
      this.message.warning('请选择系统用户组')
      return false
    }
    if(form.valid){
      const condition = form.value
      condition.id = this.routeInfo.snapshot.params.id;
      condition.province_id = this.choose_address.provinceOption ? this.choose_address.provinceOption.id : 0;
      condition.city_id = this.choose_address.cityOption ? this.choose_address.cityOption.id : 0;
      condition.district_id = this.choose_address.districtOption ? this.choose_address.districtOption.id : 0;
      condition.province = this.choose_address.provinceOption ? this.choose_address.provinceOption.name : '';
      condition.city = this.choose_address.cityOption ? this.choose_address.cityOption.name : '';
      condition.district = this.choose_address.districtOption ? this.choose_address.districtOption.name : '';
      this.sysService.update(condition).subscribe((res) =>{
        console.log(res)
        if(res['code'] === 0){
          this.router.navigate(['/systemUser'])
        }
      })
    }
  }
}
