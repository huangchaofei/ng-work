import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService , zh_CN } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { EnterpriseService } from '../../services/enterprise.service';
import { DictService } from '../../services/dict.service';
import { ChooseEnterpriseComponent } from '../../directive/choose-enterprise/choose-enterprise.component';
import { ChooseAddressComponent } from '../../directive/choose-address/choose-address.component';
@Component({
  selector: 'app-enterprise-add',
  templateUrl: './enterprise-add.component.html',
  styleUrls: ['./enterprise-add.component.css']
})
export class EnterpriseAddComponent implements OnInit {
  @ViewChild(ChooseAddressComponent)
  choose_address: ChooseAddressComponent

  @ViewChild('chooseEnterpriseChild')
  child: ChooseEnterpriseComponent;
  info = {
    enterprise_name: '',
    code:'',
    address:'',
    contacts:'',
    remarks: '',
    phone:'',
    province_id: undefined,
    city_id: undefined,
    district_id: undefined,
    province: undefined,
    city: undefined,
    district: undefined,
    longitude: '',
    latitude: ''
  }
  // 是否创建默认系统用户组
  is_cregroup = false;
  cust_user_group = '';

  enterprises = []
  enterprise = {
    parent_id: ''
  };
  groupChange($event) {
      if($event){
          this.cust_user_group = this.info.enterprise_name + '默认系统用户组';
      }else{
          this.cust_user_group = '';
      }
  }
  // 选择归属公司
  // chooseEnterprise() {
  //   console.log(this.child);
  //   this.child.showModal();
  //   console.log(this.enterprise.parent_id);
  // }
  //初始化时先获取可以选择的归属公司
  // getEnterprise() {
  //     const condition = {
  //         type:'enterprise',
  //         query:'',
  //         limit:999,
  //         offset:0
  //     }
  //     this.dictService.search(condition).subscribe((res) =>{
  //         console.log(res['data'])
  //         this.enterprises = res['data']
  //     })
  // }
  // 获得子件组传递的公司id
  // getEnterpriseId($event) {
  //   console.log($event);
  //   if($event.type){
  //     this.enterprises = $event.data
  //   }else{
  //     this.enterprise.parent_id = $event;
  //   }
  // }
  submit() {
    console.log(this.enterprise.parent_id);
    if (this.enterprise.parent_id === '' || this.enterprise.parent_id === undefined) {
      this.message.warning('请选择归属公司');
      return false;
    }
    if (this.info.enterprise_name === '') {
      this.message.warning('请输入公司名称');
      return false;
    }
    if(this.info.code === ''){
        this.message.warning('请输入公司编码')
        return false
    }
    if(this.info.contacts === ''){
        this.message.warning('请输入联系人')
        return false
    }
    if(this.info.phone === ''){
        this.message.warning('请输入手机号')
        return false
    }
    if(this.choose_address.provinceOption.id === undefined){
        this.message.warning('请选择省份')
        return false
    }
    if(this.choose_address.cityOption.id === undefined){
        this.message.warning('请选择市')
        return false
    }
    if(this.choose_address.districtOption.id === undefined){
        this.message.warning('请选择区县')
        return false
    }
    if(this.info.address === ''){
        this.message.warning('请输入详细地址')
        return false
    }
    if(this.info.longitude == '' || this.info.latitude == ''){
        this.message.warning('请选择正确的地址获取经纬度')
        return false
    }
    // if(this.info.remarks === ''){
    //     this.message.warning('请输入备注')
    //     return false
    // }
    const condition = {
        parent_id:this.enterprise.parent_id,
        name:this.info.enterprise_name,
        province_id:this.choose_address.provinceOption.id,
        city_id:this.choose_address.cityOption.id,
        district_id:this.choose_address.districtOption.id,
        province:this.choose_address.provinceOption.name,
        city:this.choose_address.cityOption.name,
        district:this.choose_address.districtOption.name,
        contacts:this.info.contacts,
        phone:this.info.phone,
        address:this.info.address,
        remarks:this.info.remarks,
        is_cregroup: this.is_cregroup === true ? 1: 0,
        cust_user_group: this.cust_user_group,
        longitude: this.info.longitude,
        latitude: this.info.latitude
    }
    this.enterpriseService.add(condition).subscribe((data)=>{
        console.log(data)
        const that = this
        if(data['code'] == 0){
            this.message.success('添加成功')
            setTimeout(function(){
                that.router.navigate(['/enterprise'])
            },500)
        }
    })
  }
  constructor(private enterpriseService: EnterpriseService, 
              private message: NzMessageService, 
              private dictService: DictService,
              private router: Router) { }
  ngOnInit() {
      // this.getEnterprise()
  }
  addressList = [];
  showDropdownFlag = false;
  // 
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
      this.showDropdownFlag = false;
  }

}
