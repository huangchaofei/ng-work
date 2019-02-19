import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
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
          this.openMap[ key ] = false;
        }
      }
    }
}
