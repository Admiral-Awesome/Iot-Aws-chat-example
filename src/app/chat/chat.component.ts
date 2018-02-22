import { Component, OnInit } from '@angular/core';
import { IotService } from '../services/iot.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor(private iot: IotService,
    private router: Router) { }

  ngOnInit() {

  }
}
