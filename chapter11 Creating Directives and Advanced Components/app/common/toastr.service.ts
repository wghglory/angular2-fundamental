// import { Injectable } from '@angular/core'
//
// //I guess this local variable was assigned the global toastr variable
// declare let toastr: any
//
// @Injectable()
// export class ToastrService {
//
//     success(message: string, title?: string) {
//         toastr.success(message, title);
//     }
//     info(message: string, title?: string) {
//         toastr.info(message, title);
//     }
//     error(message: string, title?: string) {
//         toastr.error(message, title);
//     }
//     warning(message: string, title?: string) {
//         toastr.warning(message, title);
//     }
//
// }


import { OpaqueToken } from '@angular/core'

export let TOASTR_TOKEN = new OpaqueToken('toastr');

//not necessary if api is large, just for intellisense
export interface Toastr {
    success(message: string, title?: string): void;
    info(message: string, title?: string): void;
    error(message: string, title?: string): void;
    warning(message: string, title?: string): void;
}
