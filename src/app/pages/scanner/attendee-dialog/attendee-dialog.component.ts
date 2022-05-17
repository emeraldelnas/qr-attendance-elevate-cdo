import { Registrant } from '@models/registrant.model';
import { ScannedAttendee } from './../../../shared/models/scannedAttendee.model';
import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-attendee-dialog',
  templateUrl: './attendee-dialog.component.html',
  styleUrls: ['./attendee-dialog.component.scss'],
})
export class AttendeeDialogComponent implements OnInit {
  attendee!: Registrant;
  age!: number;
  isBirthdayToday = false;

  constructor(protected dialogRef: NbDialogRef<any>) {}

  ngOnInit(): void {}

  close(): void {
    this.dialogRef.close();
  }
}
