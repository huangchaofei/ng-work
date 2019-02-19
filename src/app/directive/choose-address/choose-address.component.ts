import { Component, OnInit, AfterViewInit, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DictService } from '../../services/dict.service';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

interface Data {
  code: number;
  msg: string;
  data: any[];
}
interface Address {
  id: string;
  name: string;
  disabled?: string;
}
@Component({
  selector: 'app-choose-address',
  templateUrl: './choose-address.component.html',
  styleUrls: ['./choose-address.component.css'],
  providers: [DictService]
})
export class ChooseAddressComponent implements OnChanges {
  @Output() change = new EventEmitter();
  @Input() parent_provinceOption;
  @Input() type;
  constructor(private dictService: DictService) {
      this.dictService = dictService;
      
  }
  provinceOption: { id: string, name: string } 
  cityOption: { id: string, name: string } 
  districtOption: { id: string, name: string } 
  // = { id: '0', name: '全部' };
  // = { id: '0', name: '全部' };
  // = { id: '0', name: '全部' };
  provinces = [];
  citys = [];
  districts = [];
  all = {id: '0', name: '全部'};
  default = {id: '0', name: '全部', disabled: 'disabled'};
  compareProvinceFn = (o1: any, o2: any) => o1 && o2 ? o1.id === o2.id : o1 === o2;
  compareCityFn = (o1: any, o2: any) => o1 && o2 ? o1.id === o2.id : o1 === o2;
  compareDistrictFn = (o1: any, o2: any) => o1 && o2 ? o1.id === o2.id : o1 === o2;
  ngOnInit() {
     if(this.type == 'map'){
         this.provinceOption = { id: '0', name: '全部'};
         this.cityOption = { id: '0', name: '全部'};
         this.districtOption = { id: '0', name: '全部'};
     }
     const condition = {
          type: 'province',
          query: '',
          limit: 20,
          offset: 0
        };
        this.dictService.search(condition)
            .subscribe((data: Data) => {
              this.provinces = data.data;
              console.log(this.provinceOption)
            });
  }
  ngOnChanges(changes: SimpleChanges) {
     console.log(this.parent_provinceOption)
     if(this.provinceOption !== undefined && this.provinceOption.name !== '全部'){
           this.dictService.search({type:'city',query:this.provinceOption.id}).subscribe((res)=>{
               console.log(res)
               this.citys = res['data']
               if(this.cityOption !== undefined && this.cityOption.name !== '全部' ){
                   this.dictService.search({type:'district',query:this.cityOption.id}).subscribe((res)=>{
                       console.log(res)
                       this.districts = res['data']
                   })
               }
           })
       }
      console.log(this.parent_provinceOption)
  }
  ngAfterViewInit(){
      console.log(this.provinceOption)
  }
  // 更改省份时
  public changeProvince(value: {id: string, name: string}) {
    this.change.emit('change');
    if (value.name === '全部') {
      // this.change.emit({ name: 'province', value: value });
      this.citys = [];
      this.cityOption = this.all;
      this.districts = [];
      this.districtOption = this.all;
      return;
    } else {
      this.cityOption = this.all;
      this.districtOption = this.all;
      // this.change.emit({ name: 'province', value: value });
      this.provinceOption.id = value.id;
      this.provinceOption.name = value.name;
      const condition = {
        type: 'city',
        query: this.provinceOption.id
      };
      this.dictService.search(condition)
          .subscribe((data: Data) => {
            this.citys = data.data;
          });
    }
  }
  // 更改城市时
  public changeCity(value: {id: string, name: string}) {
    this.change.emit('change');
    console.log(value);
    this.cityOption.id = value.id;
    this.cityOption.name = value.name;
    this.districtOption = undefined;
    // this.change.emit({ name: 'city', value: value });
    const condition = {
      type: 'district',
      query: this.cityOption.id
    };
    this.dictService.search(condition)
        .subscribe((data: Data) => {
          this.districts = data.data;
        });
  }

  // 改变区县时
  changeDistrict($event) {
    // this.change.emit({ name: 'district', value: $event });
    this.change.emit('change');
  }
}
