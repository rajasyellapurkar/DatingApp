export interface Message 
{
    id:number;
    senderId:number;
    senderKnownAs:string;
    senderPhotoUrl:string;
    recipientId:number;
    recipientPhotoUrl:string;
    recipientKnownAs:string;
    content:string;
    isRead:boolean;
    readDate:Date;
    messageSent:Date;
}
