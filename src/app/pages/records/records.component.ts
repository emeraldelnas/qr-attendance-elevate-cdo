import { Attendee } from './../../shared/models/attendee.model';
import { Observable } from 'rxjs';
import { DbService } from './../../services/db.service';
import { Component, OnInit } from '@angular/core';
import { AttendeesTotals } from '@models/attendeesTotals.model';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss'],
})
export class RecordsComponent implements OnInit {
  eventDate!: Date;
  attendees!: Observable<Attendee[]>;
  totals!: Observable<AttendeesTotals>;

  constructor(private db: DbService) {
    this.attendees = this.db.oGetAttendeesSpecificDay();
    this.totals = this.db.getDayTotals();
  }

  ngOnInit(): void {}

  onEventDateChange(e: Date): void {
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    };

    const selectedDay = e.toLocaleDateString('en-us', options);

    this.attendees = this.db.oGetAttendeesSpecificDay(selectedDay);
    this.totals = this.db.getDayTotals(selectedDay);
  }
}
