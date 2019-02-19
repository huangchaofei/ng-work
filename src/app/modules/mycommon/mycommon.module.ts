import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ChooseAddressComponent } from '../../directive/choose-address/choose-address.component';
import { FuzzySearchComponent } from '../../directive/fuzzy-search/fuzzy-search.component';
import { ChooseEnterpriseComponent } from '../../directive/choose-enterprise/choose-enterprise.component';
import { FormChooseEnterpriseComponent } from '../../directive/form-choose-enterprise/form-choose-enterprise.component';
import { ChooseSystemUserGroupComponent } from '../../directive/choose-system-user-group/choose-system-user-group.component';
import { AddPlanComponent } from '../../directive/add-plan/add-plan.component';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
registerLocaleData(zh);
@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [
      ChooseAddressComponent,
      FuzzySearchComponent,
      ChooseEnterpriseComponent,
      FormChooseEnterpriseComponent,
      ChooseSystemUserGroupComponent,
      AddPlanComponent
  ],
  exports: [ChooseEnterpriseComponent,
            FuzzySearchComponent,
            ChooseAddressComponent,
            FormChooseEnterpriseComponent,
            ChooseSystemUserGroupComponent,
            AddPlanComponent,
            ReactiveFormsModule,
            FormsModule,
            NgZorroAntdModule
           ],
})
export class MycommonModule { }
