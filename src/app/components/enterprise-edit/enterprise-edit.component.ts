import { Component, OnInit, OnChanges, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NzMessageService, zh_CN } from 'ng-zorro-antd';
import { ChooseEnterpriseComponent } from '../../directive/choose-enterprise/choose-enterprise.component';
import { ChooseAddressComponent } from '../../directive/choose-address/choose-address.component';
import { EnterpriseService } from '../../services/enterprise.service';
import { DictService } from '../../services//dict.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
interface Enterprise {
    level:number,
    parent_id:number,
    name:string,
    code:number,
    contacts:string,
    phone:number,
    address:string,
}
@Component({
  selector: 'app-enterprise-edit',
  templateUrl: './enterprise-edit.component.html',
  styleUrls: ['./enterprise-edit.component.css']
})
export class EnterpriseEditComponent implements OnInit {
   editForm = new FormGroup({
      parent_id: new FormControl(''),
      name: new FormControl('',Validators.required),
      code: new FormControl('',Validators.required),
      contacts: new FormControl('',Validators.required),
      phone: new FormControl('',Validators.required),
      address: new FormControl('',Validators.required),
      remarks: new FormControl(''),
  })
  @ViewChild(ChooseAddressComponent)
  choose_address: ChooseAddressComponent;

  @ViewChild('chooseEnterpriseChild')
  child: ChooseEnterpriseComponent;
  enterprise = {
      name:'',
      parent_id:'',
      code:'',
      contacts:'',
      phone:'',
      country:'',
      province_id:'',
      city_id:'',
      district_id:'',
      province:'',
      city:'',
      district:'',
      address:'',
      type:'',
      remarks:'',
      level:0
  }
  enterprises = []
  info = {
      enterprise_name: '',
      address:'',
      contacts:'',
      remarks: '',
      phone:'',
      code: '',
      province_id: undefined,
      city_id: undefined,
      district_id: undefined,
      province: undefined,
      city: undefined,
      district: undefined,
      longitude: '',
      latitude: ''
  }
  getDetail() {
      const condition = {
          id: this.routerInfo.snapshot.params['id']
      }
      this.enterpriseService.get(condition).subscribe((res) => {
          console.log(res);
          this.enterprise = res['data']
          this.editForm.patchValue({
              parent_id:this.enterprise.parent_id,
              name:this.enterprise.name,
              code:this.enterprise.code,
              contacts:this.enterprise.contacts,
              phone:this.enterprise.phone,
              address:this.enterprise.address,
              remarks:this.enterprise.remarks
          })
          this.choose_address.provinceOption = {id:this.enterprise.province_id,name:this.enterprise.province};
          this.choose_address.cityOption = {id:this.enterprise.city_id,name:this.enterprise.city};
          this.choose_address.districtOption = {id:this.enterprise.district_id,name:this.enterprise.district};
          this.info.longitude = res['data']['longitude'];
          this.info.latitude = res['data']['latitude'];
          this.editForm.controls.address.valueChanges.subscribe((res)=>{
              console.log(res);
              this.addressChange(res)
          })
      })
  }
  constructor(private enterpriseService: EnterpriseService,
              private message: NzMessageService,
              private router: Router,
              private routerInfo: ActivatedRoute,
              private dictService: DictService) { }

  ngOnInit() {
        const that = this;
        this.getDetail()
        // Object.defineProperty(this.enterprise, 'parent_id', {
        //   get: function() {
        //     return this._parent_id;
        //   },
        //   set: function(newValue) {
        //     this._parent_id = newValue;
        //     console.log('设置新值' + newValue);
        //     console.log(that.enterprise.parent_id);
        //   }
        // });
  }
  submit(form) {
      console.log(form)
      if(this.enterprise.level !=1){
        if(form.value.parent_id === ''){
            this.message.warning('请选择上级公司')
            return false
        }
      }
      if(form.value.name === ''){
          this.message.warning('请输入公司名称')
          return false
      }
      if(form.value.code === ''){
          this.message.warning('请输入公司编码')
          return false
      }
      if(form.value.contacts === ''){
          this.message.warning('请输入联系人')
          return false
      }
      if(form.value.phone === ''){
          this.message.warning('请输入手机号')
          return false
      }
      if(form.value.address === ''){
          this.message.warning('请输入详细地址')
          return false
      }
      if(this.info.longitude == '' || this.info.latitude == ''){
        this.message.warning('请选择正确的地址获取经纬度')
        return false
      }
      const condition = form.value;
      condition.id = this.routerInfo.snapshot.params.id;
      condition.province_id = this.choose_address.provinceOption ? this.choose_address.provinceOption.id : 0;
      condition.city_id = this.choose_address.cityOption ? this.choose_address.cityOption.id : 0;
      condition.district_id = this.choose_address.districtOption ? this.choose_address.districtOption.id : 0;
      condition.province = this.choose_address.provinceOption ? this.choose_address.provinceOption.name : '';
      condition.city = this.choose_address.cityOption ? this.choose_address.cityOption.name : '';
      condition.district = this.choose_address.districtOption ? this.choose_address.districtOption.name : '';
      condition.longitude = this.info.longitude;
      condition.latitude = this.info.latitude;
      this.enterpriseService.update(condition).subscribe((res)=>{
          console.log(res)
          if(res['code'] === 0){
              this.router.navigate(['/enterprise'])
          }
      })
  }
  addressList = [];
  showDropdownFlag = false;
  addressChange(val){
      if(val === ''){
          this.info.longitude = '';
          this.info.latitude = '';
          return false;
      }
      const condition = {
          query: val
      }
      this.enterpriseService.address(condition).subscribe((res)=>{
          console.log(res);
          this.addressList = res['data'];
          if(this.addressList.length > 0){
              this.showDropdownFlag = true;
          }
      })
  }

  // 点击下拉搜索到的地址
  clickAddress(address){
      console.log(address);
      this.info.address = address.name;
      this.info.longitude = address.longitude;
      this.info.latitude = address.latitude;
      this.editForm.controls.address.setValue(address.name,{emitEvent: false})
      this.showDropdownFlag = false;
  }

  blur(){
      setTimeout(()=>{   
          this.showDropdownFlag = false;
      },200)
  }
}
