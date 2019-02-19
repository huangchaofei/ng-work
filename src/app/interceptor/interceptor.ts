import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, concat, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';
import { Md5 } from 'ts-md5';
import { Base64 } from 'js-base64/base64';


@Injectable({
  providedIn: 'root'
})
export class MyInterceptorService implements HttpInterceptor {
  constructor(private messageService: NzMessageService, private router: Router) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const name  = 'sirius',
            flag = new Date().getTime(),
            key = 'DzI3ZTkxODIXUzTzZjdhZXTlOTc8lPX7';
      let Sign = Md5.hashStr( ('Sirius' + flag + key) );
      const $Auth = 'Basic'+ ' ' + Base64.encode( name + ':'+ Sign );
      let reqBody = req.body
      if (req.body == null) {
          reqBody = {nologin: 999};
      } else { 
          let body = req.body;
          console.log(body)
          body.nologin = 999
          reqBody = body
      }
      let reqHeader = req.clone({ 
            headers: req.headers.set('Authorization', $Auth)
                                .set('r',flag.toString()),
            body:reqBody
                              // .set('name','fdsfsdafsad')
                              // .set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
      });
      // if (req.body == null) {
      //     reqHeader = req.clone({body: {nologin: 999}} );
      // } else { 
      //     let body = JSON.parse(req.body);
      //     console.log(body)
      //     body.nologin = 999
      //     reqHeader = req.clone({body:body})
      // }
      // const reqHeader = req.clone({})
      return next.handle(reqHeader).pipe( 
        catchError((err:HttpErrorResponse)=>{
            switch (err.status) {
                case 500:
                  this.messageService.error('服务器出错');
                  break;
                case 404:
                  this.messageService.error('不存在');
                  break;
                case 0:
                  this.messageService.error('连接超时,请检查网络');
                  break;
            }
            return throwError(err)
        }),
        map(event => {
        if (event instanceof HttpResponse) {
          console.log(event);
          if (event.body.code === 5003) {
            this.router.navigate(['/login']);
          }
          if(event.status == 200){
            if(event.body.code != 0){
              this.messageService.error(event.body.msg)
            }else{
                return event;
            }
          }
        }
      }));
  }
}
