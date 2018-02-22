import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IotService } from '../services/iot.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(
    private fb: FormBuilder, 
    private iot : IotService,
    private router : Router
  ) { }

  ngOnInit() {
    this.setForm();
  }

  setForm() {
    this.loginForm = this.fb.group({
      nickname: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(3)]],
      subject: ['global', [Validators.required, Validators.maxLength(20), Validators.minLength(3)]]
    });
  }

  goToChat() {
    if ( this.loginForm.valid ) {
    this.iot.createNewChat(this.loginForm.get('subject').value, this.loginForm.get('nickname').value);
    this.router.navigate(['/chat']);
    }
  }

}
