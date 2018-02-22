import { Observable } from 'rxjs/Observable';
import * as awsIot from "aws-iot-device-sdk";
import { setTimeout } from 'timers';

declare var $: any;
export enum SystemMessage {
    HAS_AUTHOR,
    SYSTEM_MESSAGE,
    TYPING,
    STOP_TYPING
}
export interface Message {
    type: SystemMessage,
    text: string,
    date?: any,
    onRoad?: number,
    nickname?: string
}

export class Chat {
    messages: Array<Message> = [];
    topic: string;
    nickname: string;
    currentMessage = '';
    writers: Array<string>= [];
    typeTimeout = null;
    constructor(observable: Observable<Message>, topic: string, nickname: string) {
        this.nickname = nickname;
        this.topic = topic;
        observable.subscribe(
            message => {

                if ( message.type === SystemMessage.TYPING && message.nickname !== this.nickname) {
                    this.writers.push(message.nickname);
                    return;
                }

                if ( message.type === SystemMessage.STOP_TYPING && message.nickname !== this.nickname) {
                    const index = this.writers.indexOf(message.nickname);
                    if (index !== -1) this.writers.splice(index, 1);
                    return;
                }
                if (message.type === SystemMessage.HAS_AUTHOR) {
                    const index = this.writers.indexOf(message.nickname);
                    if (index !== -1) this.writers.splice(index, 1);
                    message.date = new Date(message.date);
                    message.onRoad = new Date().getTime() - message.date.getTime();
                }
                console.log(message);
                this.messages.push(message);
                setTimeout(() => {
                    $('ul').each(function () {
                        console.log(this);
                        $(this).scrollTop($(this)[0].scrollHeight);
                    });
                }, 500);
            },
            err => {

                console.error(err);
            },
            () => {
                this.messages.push({
                    type: SystemMessage.HAS_AUTHOR,
                    text: "You left chat! You will not receive messages! Have a nice day"
                });
            }
        )
    }
}
