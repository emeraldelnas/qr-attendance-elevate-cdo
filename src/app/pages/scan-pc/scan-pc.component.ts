import { Component, OnInit } from '@angular/core';
import { ScannedAttendee } from '@models/.';
import { Attendee } from '@models/attendee.model';
import { NbDialogService } from '@nebular/theme';
import { DbService } from '@services/db.service';
import { BarcodeFormat } from '@zxing/library';

import { BehaviorSubject, Observable, Subscription, take } from 'rxjs';
import { AttendeeDialogComponent } from '../scanner/attendee-dialog/attendee-dialog.component';
import dayjs, { Dayjs } from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
dayjs.extend(isToday);

@Component({
  selector: 'app-scan-pc',
  templateUrl: './scan-pc.component.html',
  styleUrls: ['./scan-pc.component.scss'],
})
export class ScanPcComponent {
  availableDevices!: MediaDeviceInfo[];
  deviceCurrent!: MediaDeviceInfo | undefined;
  deviceSelected: string = '2313';

  formatsEnabled: BarcodeFormat[] = [
    BarcodeFormat.CODE_128,
    BarcodeFormat.DATA_MATRIX,
    BarcodeFormat.EAN_13,
    BarcodeFormat.QR_CODE,
  ];

  hasDevices!: boolean;
  hasPermission!: boolean;

  qrResultString!: string | null;

  torchEnabled = false;
  torchAvailable$ = new BehaviorSubject<boolean>(false);
  tryHarder = false;

  attendees!: Observable<Attendee[]>;

  showRegistrant = false;
  scannedAttendee!: ScannedAttendee;

  oldResult = '';
  pauseScanner = false;
  showAlreadyScanned = false;
  showNotRegistered = false;

  findAttendee$!: Subscription;
  getRegistrant$!: Subscription;
  attendeeDialog$!: Subscription;

  isBirthdayToday = false;

  constructor(private db: DbService, private dialogService: NbDialogService) {
    // this.attendees = this.db.oGetTodayAttendees();
  }

  clearResult(): void {
    this.qrResultString = null;
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);
  }

  onCodeResult(resultString: string) {
    if (!this.pauseScanner) {
      this.pauseScanner = true;
      if (resultString !== this.oldResult) {
        this.findAttendee$ = this.db
          .findAttendee(resultString)
          .get()
          .pipe(take(1))
          .subscribe((attendee) => {
            this.oldResult = resultString;

            if (!attendee.exists) {
              this.getRegistrant$ = this.db
                .getRegistrant(resultString)
                .pipe(take(1))
                .subscribe((res) => {
                  if (res.firstName) {
                    const birthdate = dayjs(res.birthdate);
                    const age = dayjs().diff(birthdate, 'year');

                    this.isBirthdayToday = this.isToday(birthdate);

                    this.attendeeDialog$ = this.dialogService
                      .open(AttendeeDialogComponent, {
                        context: {
                          attendee: {
                            ...res,
                            birthdate: birthdate.format('MMM D, YYYY'),
                          },
                          age,
                          isBirthdayToday: this.isBirthdayToday,
                        },
                      })
                      .onClose.subscribe((res) => {
                        this.pauseScanner = false;
                      });

                    this.db.addAttendee(resultString, {
                      age,
                      firstName: res.firstName,
                      lastName: res.lastName,
                      sex: res.sex,
                      isFirstTimer: res.isFirstTimer,
                    });
                  } else {
                    this.showAlreadyScanned = false;
                    this.showNotRegistered = true;
                  }
                });
            } else {
              this.showNotRegistered = false;
              this.showAlreadyScanned = true;
            }
          });
      } else {
        this.showNotRegistered = false;
        this.showAlreadyScanned = true;
      }
    }
  }
  onDeviceSelectChange(selected: string) {
    const selectedStr = selected || '';
    console.log(selected, this.deviceSelected);
    // if (this.deviceSelected === selectedStr) {
    //   console.log('return');
    //   return;
    // }
    this.deviceSelected = selectedStr;
    const device = this.availableDevices.find((x) => x.deviceId === selected);
    this.deviceCurrent = device || undefined;
    console.log(this.deviceCurrent, selected, device);
  }

  onDeviceChange(device: MediaDeviceInfo) {
    const selectedStr = device?.deviceId || '';
    if (this.deviceSelected === selectedStr) {
      return;
    }
    this.deviceSelected = selectedStr;
    this.deviceCurrent = device || undefined;
  }

  openFormatsDialog() {
    const data = {
      formatsEnabled: this.formatsEnabled,
    };
    // this._dialog
    //   .open(FormatsDialogComponent, { data })
    //   .afterClosed()
    //   .subscribe(x => {
    //     if (x) {
    //       this.formatsEnabled = x;
    //     }
    //   });
  }

  onHasPermission(has: boolean) {
    this.hasPermission = has;
  }

  openInfoDialog() {
    const data = {
      hasDevices: this.hasDevices,
      hasPermission: this.hasPermission,
    };

    // this._dialog.open(AppInfoDialogComponent, { data });
  }

  onTorchCompatible(isCompatible: boolean): void {
    this.torchAvailable$.next(isCompatible || false);
  }

  toggleTorch(): void {
    this.torchEnabled = !this.torchEnabled;
  }

  toggleTryHarder(): void {
    this.tryHarder = !this.tryHarder;
  }

  private parseDate(date: Date | string): string {
    console.log(date);
    date = new Date(date);

    return new Date(
      date.getTime() - date.getTimezoneOffset() * 60 * 1000
    ).toISOString();
  }

  formatDate(dateString: string): string {
    return new Date(dateString)
      .toLocaleString('en-us', {
        month: 'long',
        day: 'numeric',
      })
      .split(',')[0];
  }

  isToday(someDate: Dayjs): boolean {
    const today = dayjs();

    return (
      someDate.get('date') == today.get('date') &&
      someDate.get('month') == today.get('month')
    );
  }
}
