import { ThisReceiver } from '@angular/compiler';
import { Component, ElementRef, ViewChild } from '@angular/core';
import * as openpgp from 'openpgp';
import { UploadService } from './services/upload.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private uploadService: UploadService) { }
  @ViewChild('fileInput') fileInput!: ElementRef;
  private readonly publicKeyArmored =
    `-----BEGIN PGP PUBLIC KEY BLOCK-----
    
xjMEZgrTvxYJKwYBBAHaRw8BAQdAGbdMDqpg4f2y4YnUW47O/FKjfKfnPZJf
7OodRIGnkMLNMlZpZ25lc2ggVmlqYXlhcmFqdSA8dmlnbmVzaC52aWpheWFy
YWp1QHRydWlzdC5jb20+wowEEBYKAD4FgmYK078ECwkHCAmQCS5xuGlwgvoD
FQgKBBYAAgECGQECmwMCHgEWIQQYVzGK4yZdVDvbekUJLnG4aXCC+gAADPwA
/RXM18fyQodEWLRaByNLy8/ru1s4TGA6uzZKDDLxvfoDAP9l8moP04Btqe7p
poWKpII/6x17PzcPeXr9y4fixuDjDs44BGYK078SCisGAQQBl1UBBQEBB0BI
0MQrymzIF01gfocfUL3yf9DsNUjTXPpEgjson2uvWwMBCAfCeAQYFgoAKgWC
ZgrTvwmQCS5xuGlwgvoCmwwWIQQYVzGK4yZdVDvbekUJLnG4aXCC+gAAjBoB
AKBh+nValhGyTIiW8lr/CHrEsM4kV+pgETE97qLWF/1BAQD6M/oRAZ6vXEGk
gD2H4S07Bg4ON1OvVfgk9A6C7vTLBQ==
=6IW9
-----END PGP PUBLIC KEY BLOCK-----`
  currentFile!: File;
  // selectFile(event:any){
  //  // debugger
  //   this.currentFile=event.target.files.item(0);
  // }

  // upload(){
  //   //debugger
  //   this.encryptFile(this.currentFile,this.publicKey)
  // }

  // async encryptFile(file:any,publicKeyArmored:any){
  //   debugger
  //   const publicKey = await openpgp.readKey({armoredKey:publicKeyArmored});
  //   console.log('public-key',publicKey);
  //   const fileBuffer = await file.arrayBuffer();
  //   const encrypted : any = await openpgp.encrypt({
  //     message:await openpgp.createMessage({
  //       binary: new Uint8Array(fileBuffer)
  //     }),
  //     encryptionKeys:publicKey,
  //   })

  //   const encBlob = new Blob([encrypted]);
  //   const payload = {
  //     encryptedFile:encBlob,
  //     fileName:this.currentFile.name,
  //     folderName:'ExcelFiles'
  //   }

  //   const formData = new FormData();
  //   const fileName = this.currentFile.name;
  //   const name = this.currentFile.name;

  //   if(fileName!=undefined){
  //     formData.append('encryptedFile',encBlob,fileName);
  //     formData.append('fileName',fileName);

  //   }
  //   console.log(formData)
  // }


  // async encryptMessage(pubKey: string, message: string) {
  //   const publicKey = await openpgp.readKey({ armoredKey: pubKey });
  //   const encrypted = await openpgp.encrypt({
  //     message: openpgp.Message.(message),
  //     encryptionKeys: publicKey,
  //   });
  //   //return encrypted;
  // }
  async encryptFile(file: File): Promise<Blob> {
    try {
      //debugger
      const publicKey = await openpgp.readKey({ armoredKey: this.publicKeyArmored });
      const fileBuffer = await file.arrayBuffer();
      const message = await openpgp.createMessage({ binary: new Uint8Array(fileBuffer) });
      const encrypted: any = await openpgp.encrypt({
        message: message,
        encryptionKeys: publicKey
      })
      return new Blob([encrypted]);
      //return encrypted;
      //return new File([encrypted.data], file.name, { type: 'text/plain' });
    }
    catch (error) {
      console.error('Encryption error:', error);
      throw error;
    }

  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const encryptedBlob = await this.encryptFile(file);
    // Here, you can handle the encrypted blob, e.g., by saving it or sending it to a server.
    console.log('File encrypted:', encryptedBlob);
    this.uploadService.uploadFile(encryptedBlob)
  }

  apiCall() {
    this.uploadService.apiCall();
  }


}
