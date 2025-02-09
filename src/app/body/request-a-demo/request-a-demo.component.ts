/*********************************************************** 
* Copyright (C) 2022 
* Worktez 
* Author : Abhishek Mishra <am1426620@gmail.com>
* 
* This program is free software; you can redistribute it and/or 
* modify it under the terms of the MIT License 
* 
* 
* This program is distributed in the hope that it will be useful, 
* but WITHOUT ANY WARRANTY; without even the implied warranty of 
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
* See the MIT License for more details. 
***********************************************************/
import { Component, OnInit } from '@angular/core';
import { PopupHandlerService } from 'src/app/services/popup-handler/popup-handler.service';
import { NgForm, FormGroup, FormControl, Validators} from '@angular/forms';
import { ErrorHandlerService } from 'src/app/services/error-handler/error-handler.service';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { ToolsService } from 'src/app/services/tool/tools.service';


declare var jQuery:any;

@Component({
  selector: 'app-request-a-demo',
  templateUrl: './request-a-demo.component.html',
  styleUrls: ['./request-a-demo.component.css']
})
export class RequestADemoComponent implements OnInit {
  enableLoader: boolean = false
  showClose: boolean = false
  componentName: string = "REQUEST-DEMO";

  requestDemoForm= new FormGroup({
    personName: new FormControl('', Validators.required),
    emailAddress: new FormControl('', [Validators.required, Validators.email]),
    contactNumber: new FormControl(null, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
    orgName: new FormControl(''),
  })

  get personName(){return this.requestDemoForm.get('personName')};
  get emailAddress(){return this.requestDemoForm.get('emailAddress')};
  get contactNumber(){return this.requestDemoForm.get('contactNumber')};
  get orgName(){return this.requestDemoForm.get('orgName')};

  constructor(private functions: AngularFireFunctions, private toolService: ToolsService, public popupHandlerService: PopupHandlerService, public errorHandlerService: ErrorHandlerService) { }

  ngOnInit(): void {
  }
  onSubmit(form: NgForm){
    this.enableLoader = true;
    const personName = this.personName.value;
    const emailAddress = this.emailAddress.value;
    const contactNumber = this.contactNumber.value;
    const orgName = this.orgName.value;
    const date = this.toolService.date();
    const time = this.toolService.time();

    const callable = this.functions.httpsCallable('requestDemo/addRequest');
    callable({PersonName: personName, EmailAddress: emailAddress, ContactNumber: contactNumber, OrgName: orgName, CreationDate: date, CreationTime: time}).subscribe({
      next: (data) => {
        console.log("Successful initiated demo request");
      },
      error: (error) => {
        this.errorHandlerService.getErrorCode(this.componentName, "InternalError");
        this.enableLoader = false;
        console.error(error);
      },
      complete: () => {
        console.info('Successfully created demo request');
        this.enableLoader=false;
        this.showClose=true;
      }
    });
  }
  close() {
    jQuery('#requestDemo').modal('hide');
    this.showClose=false;
    this.requestDemoForm.reset();
  }
}
