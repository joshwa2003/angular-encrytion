import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BlobServiceClient } from '@azure/storage-blob';
import * as openpgp from 'openpgp';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private readonly accountName = 'fileuploadspoc';
  private readonly sasToken = 'sv=2022-11-02&ss=bfqt&srt=c&sp=rwdlacupiytfx&se=2024-04-05T17:53:16Z&st=2024-03-31T09:53:16Z&spr=https,http&sig=cTK8CWvxbFD0lLX%2BAComO5EVBOm6gN2XfEEmfVAvLY4%3D';
  private readonly containerName = 'file-container';
  private blobServiceClient: BlobServiceClient;

  constructor(private http: HttpClient) { 
    this.blobServiceClient = new BlobServiceClient(
      `https://${this.accountName}.blob.core.windows.net/?${this.sasToken}`
    );
  }

  uploadFile(file : any){
    const formData : FormData = new FormData();
    formData.append('file',file,file.name);
    formData.append('filename',file.name)

    //const headers = new HttpHeaders({})
    return this.http.post('http://localhost:7071/api/uploadFile',formData).subscribe(data=>{
      console.log('response-data',data);
    });
  }

  // async uploadFile(file: File): Promise<void> {
  //   try {
  //     // Encrypt the file with OpenPGP
  //     const encryptedFileBlob = file;
  //     const encryptedFileName = `${file.name}.pgp`;

  //     // Upload the encrypted file blob
  //     const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
  //     const blobClient = containerClient.getBlockBlobClient(encryptedFileName);
  //     await blobClient.uploadData(encryptedFileBlob, {
  //       blobHTTPHeaders: { blobContentType: "application/pgp-encrypted" },
  //     });
  //     console.log('Encrypted file uploaded successfully');
  //   } catch (error) {
  //     console.error('Error uploading file', error);
  //   }
  // }
 
  apiCall(){
    this.http.get('http://localhost:7071/api/validateFile').subscribe(data=>{
      console.log('api-call',data)
    })
  }
}
