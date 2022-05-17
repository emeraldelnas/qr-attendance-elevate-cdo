import { DbService } from './services/db.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'qr-attendance-elevate-cdo';

  constructor(db: DbService) {
    db.createCurrentDayAttendeesTotalsDB();
  }
}
