import { Injectable } from '@angular/core';
import { aws } from '../../environments/environment';
import * as awsIot from "aws-iot-device-sdk";
import * as mqtt from "mqtt";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import "rxjs/add/operator/map";
import "rxjs/add/operator/debounceTime";
import 'rxjs/add/operator/do';
import { SystemMessage, Message, Chat } from '../chat/chat';


declare var $: any;

@Injectable()
export class IotService {
  chats: Array<Chat> = [];
  device;
  isConnected = false;

  constructor() {
    this.device = new awsIot.device(aws);
    this.device.on("connect", () => {
      this.isConnected = true;
    });
  }

  startType(event, index) {
    if (this.chats[index].typeTimeout) {
      clearTimeout(this.chats[index].typeTimeout);
      this.chats[index].typeTimeout = null;
    } else {
      var message: Message = {
        type: SystemMessage.TYPING,
        nickname: this.chats[index].nickname,
        text: ''
      };
      console.log('start send');
      this.sendMessage(this.chats[index].topic, message);
    }


    this.chats[index].typeTimeout = setTimeout(() => {
      clearTimeout(this.chats[index].typeTimeout);
      this.chats[index].typeTimeout = null;
      console.log('end send');
      const message: Message = {
        type: SystemMessage.STOP_TYPING,
        nickname: this.chats[index].nickname,
        text: ''
      };
      this.sendMessage(this.chats[index].topic, message);
    }, 1500);

  }

  generateAndSendMessage(index) {
    if (this.chats[index].currentMessage.length < 1) {
      alert('Message too short');
      return;
    }
    const message: Message = {
      type: SystemMessage.HAS_AUTHOR,
      text: this.chats[index].currentMessage,
      date: new Date().toISOString(),
      nickname: this.chats[index].nickname
    };
    this.chats[index].currentMessage = '';
    this.sendMessage(this.chats[index].topic, message);
  }

  sendMessage(topic: string, message: Message) {
    this.device.publish(topic, JSON.stringify(message));
  }

  createNewChat(topic: string, nickname: string): void {
    const observable: Observable<Message> = new Observable(observer => {
      const helloMessage: Message = {
        type: SystemMessage.SYSTEM_MESSAGE,
        text: `${nickname} has just joined to chat!`
      };
      this.sendMessage(topic, helloMessage);
      this.device.on('error', err => observer.error(err));
      setTimeout(() => {
        this.device.subscribe(topic);
      }, 1000);
      this.device.on('message', (subTopic, payload) => {
        if (topic === subTopic) observer.next(JSON.parse(payload));
      });

    });
    this.chats.push(new Chat(observable, topic, nickname));
  }


  getWriters(writers: Array<string>): string {
    return writers.reduce((total, value, index) => index === writers.length - 1 ? total += value : total += value + ', ', '');
  }

}
