import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  NbThemeModule,
  NbLayoutModule,
  NbCardModule,
  NbUserModule,
  NbToastrModule,
  NbInputModule,
  NbDatepickerModule,
  NbRadioModule,
  NbButtonModule,
  NbListModule,
  NbSpinnerModule,
  NbDialogModule,
  NbIconModule,
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScannerComponent } from './pages/scanner/scanner.component';
import { ScanPcComponent } from './pages/scan-pc/scan-pc.component';
import { RegisterComponent } from './pages/register/register.component';
import { AngularSignaturePadModule } from '@almothafar/angular-signature-pad';
import { QRCodeModule } from 'angularx-qrcode';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AttendeeDialogComponent } from './pages/scanner/attendee-dialog/attendee-dialog.component';
import { RecordsComponent } from './pages/records/records.component';

@NgModule({
  declarations: [
    AppComponent,
    ScannerComponent,
    ScanPcComponent,
    RegisterComponent,
    AttendeeDialogComponent,
    RecordsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbEvaIconsModule,
    NbIconModule,
    NbCardModule,
    NbUserModule,
    NbInputModule,
    NbToastrModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot({ hasBackdrop: true, closeOnBackdropClick: false }),
    NbRadioModule,
    NbButtonModule,
    NbListModule,
    NbSpinnerModule,
    ZXingScannerModule,
    AngularSignaturePadModule,
    QRCodeModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFirestoreModule.enablePersistence(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
