import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  public base64: string | undefined

  constructor(public toastr: ToastrService) { }

  convertImageToBase64String(event: any): Promise<string> {
    return new Promise((resolve, reject) => {
      var files = event.target.files;
      var file = files[0];
      if (files && file) {
        var reader = new FileReader();
        reader.onload = function (readerEvt: any) {
          var binaryString = readerEvt.target.result;
          let photoString = btoa(binaryString);
          resolve(photoString);
        };
        reader.readAsBinaryString(file);
      }
    });
  }

}
