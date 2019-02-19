import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgZorroAntdModule, NZ_I18N, zh_CN, NZ_MESSAGE_CONFIG } from 'ng-zorro-antd';
import { HashLocationStrategy, LocationStrategy} from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IndexComponent } from './index/index.component';
import { LoginModule } from './modules/login/login.module';
import { MainComponent } from './components/main/main.component';
import { MyInterceptorService } from './interceptor/interceptor';
import { MycommonModule } from './modules/mycommon/mycommon.module';
import { FormChooseAddressComponent } from './directive/form-choose-address/form-choose-address.component';
import { FormChooseStationComponent } from './directive/form-choose-station/form-choose-station.component';
import { MapComponent } from './components/map/map.component';
import { FullMapComponent } from './components/full-map/full-map.component';
import { WorkerMapComponent } from './components/worker-map/worker-map.component';
import { ChooseAreaComponent } from './directive/choose-area/choose-area.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    MainComponent,
    FormChooseAddressComponent,
    FormChooseStationComponent,
    MapComponent,
    FullMapComponent,
    WorkerMapComponent,
    ChooseAreaComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgZorroAntdModule,
    AppRoutingModule,
    FormsModule,
    MycommonModule,
    LoginModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: MyInterceptorService, multi: true},
    { provide: NZ_MESSAGE_CONFIG, useValue: { nzDuration: 3000, nzMaxStack: 1}},
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
