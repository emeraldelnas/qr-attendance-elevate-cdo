import { AngularFireStorage } from '@angular/fire/compat/storage';
import { DbService } from '@services/db.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { QRCodeComponent } from 'angularx-qrcode';
import { finalize, Observable } from 'rxjs';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, AfterViewInit {
  registerForm!: FormGroup;
  submitted = false;
  signatureImg!: string;
  @ViewChild('qrImg') qrImg!: QRCodeComponent;
  qrData = '';
  qrImgWidth = 400;
  qrLogo = 75;

  generateQR = false;
  isLoading = false;

  sexOptions = [
    { value: 'male', label: 'Male', checked: true },
    { value: 'female', label: 'Female' },
  ];

  uploadPercent!: Observable<number>;
  downloadUrl!: Observable<string>;

  // @ViewChild('signature')
  // signaturePad!: SignaturePadComponent;

  // signaturePadOptions: NgSignaturePadOptions = {
  //   // passed through to szimek/signature_pad constructor
  //   minWidth: 5,
  //   canvasWidth: 500,
  //   canvasHeight: 300,
  // };

  constructor(
    private fb: FormBuilder,
    private storage: AngularFireStorage,
    private db: DbService
  ) {
    // this.uploadPercent = db.uploadPercent;
    // this.downloadUrl = db.downloadUrl;
  }

  ngOnInit(): void {
    this.initRegisterForm();

    const d1 = dayjs('1998-01-08T16:00:00.000Z');
    const d2 = dayjs();
    console.log(d2.diff(d1, 'year'));
  }

  ngAfterViewInit() {
    // const signaturePadWidth = document.getElementById('sig')?.offsetWidth;
    // this.signaturePad.set(
    //   'canvasWidth',
    //   signaturePadWidth! > 400 ? 400 : signaturePadWidth
    // );
    // this.signaturePad.set('canvasHeight', 200);
    // this.signaturePad.clear();

    const qrImgCurWidth = document.getElementById('qr-image')!.offsetWidth;
    this.qrImgWidth = qrImgCurWidth > 300 ? 300 : qrImgCurWidth;
    this.qrLogo = this.qrImgWidth * 0.2;
  }

  initRegisterForm(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthdate: ['', Validators.required],
      sex: ['male', Validators.required],
      mobile: ['', Validators.required],
      leader: [''],
    });
  }

  async submit(): Promise<void> {
    this.submitted = true;
    if (this.registerForm.valid) {
      this.isLoading = true;

      const formValues = this.registerForm.value;

      // const downloadURL = await this.uploadSignature(
      //   formValues.firstName,
      //   formValues.lastName
      // );

      const payload = {
        ...formValues,
        birthdate: dayjs(formValues.birthdate).toISOString(),
        signature: '',
        isFirstTimer: true,
      };

      this.db.addRegistrant(payload).then((docRef) => {
        this.isLoading = false;
        this.generateQR = true;
        this.qrData = docRef.id;

        this.db.incrementRegistrantTotals(payload);
        // this.isUserCreated = true;
      });
    }
  }

  // async uploadSignature(firstName: string, lastName: string): Promise<string> {
  //   const filename = `signatures/${lastName}_${firstName}_signature.jpg`;
  //   const fileref = this.storage.ref(filename);
  //   const task = this.db.uploadSignature(
  //     this.signaturePad.toDataURL(),
  //     filename
  //   );

  //   this.uploadPercent = <Observable<number>>task.percentageChanges();
  //   const downloadURL = await new Promise<any>((resolve, reject) => {
  //     task
  //       .snapshotChanges()
  //       .pipe(
  //         finalize(() =>
  //           fileref.getDownloadURL().subscribe((res) => resolve(res))
  //         )
  //       )
  //       .subscribe();
  //   });

  //   return downloadURL;
  // }

  // drawComplete(event: MouseEvent | Touch) {
  //   // will be notified of szimek/signature_pad's onEnd event
  //   console.log('Completed drawing', event);
  //   console.log(this.signaturePad.toDataURL());
  // }

  // drawStart(event: MouseEvent | Touch) {
  //   // will be notified of szimek/signature_pad's onBegin event
  //   console.log('Start drawing', event);
  // }

  get fullName(): string {
    return `${this.registerForm.get('firstName')?.value} ${
      this.registerForm.get('lastName')?.value
    }`;
  }

  saveAsImage(parent: any): void {
    let parentElement = parent.qrcElement.nativeElement
      .querySelector('canvas')
      .toDataURL('image/png');

    let blobData = this.convertBase64ToBlob(parentElement);
    // saves as image
    const blob = new Blob([blobData], { type: 'image/png' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    // name of the file
    link.download = 'Qrcode';
    link.click();
  }

  private convertBase64ToBlob(Base64Image: string) {
    // split into two parts
    const parts = Base64Image.split(';base64,');
    // hold the content type
    const imageType = parts[0].split(':')[1];
    // decode base64 string
    const decodedData = window.atob(parts[1]);
    // create unit8array of size same as row data length
    const uInt8Array = new Uint8Array(decodedData.length);
    // insert all character code into uint8array
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i);
    }
    // return blob image after conversion
    return new Blob([uInt8Array], { type: imageType });
  }

  formatDate(dateString: string): string {
    console.log(
      new Date(dateString).toLocaleDateString('en-us', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    );
    return new Date(dateString).toLocaleDateString('en-us', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

  back(): void {
    this.submitted = false;
    this.generateQR = false;
    this.registerForm.reset({ sex: 'male' });
  }

  get firstName(): AbstractControl {
    return <AbstractControl>this.registerForm.get('firstName');
  }

  get lastName(): AbstractControl {
    return <AbstractControl>this.registerForm.get('lastName');
  }

  get mobile(): AbstractControl {
    return <AbstractControl>this.registerForm.get('mobile');
  }

  get birthdate(): AbstractControl {
    return <AbstractControl>this.registerForm.get('birthdate');
  }

  showError(control: AbstractControl): false | ValidationErrors | null {
    const { touched, dirty, errors } = control;
    return (touched || dirty || this.submitted) && errors;
  }
}
