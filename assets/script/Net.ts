// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

export class NetSystem{
    websocket:WebSocket = null;
    LocationMessage = null;
    RoomMessage = null;
    CardMessage = null;
    connectionStatus:number = 0;//1 for success -1 for failed 0 for none
    createConnection(ip:string){
        return new Promise((resolve,reject)=>{
            
            this.websocket = new WebSocket("wss://"+ip);
            

            let connectionTimeoutSec = 5000;   //逾時連線失敗
            let timeout = setTimeout(() => {
                reject("連線逾時");
            }, connectionTimeoutSec);

            this.websocket.onopen = ()=>{
                cc.log('連線成功')
                clearTimeout(timeout);
                resolve("連接成功");
            }

            this.websocket.onerror = ()=>{
                clearTimeout(timeout);
                reject("連線發生錯誤 可能是伺服器不在線上?");
            }

        })
    }

    startReceiveMessage(){
        this.websocket.onmessage = (e)=>{
            let msg = JSON.parse(e.data);
            cc.log(msg);
            switch(msg.Type){
                case "LocationMsg":
                    this.LocationMessage = JSON.parse(JSON.stringify(msg));
                    break;
                case "RoomMsg":
                    this.RoomMessage = JSON.parse(JSON.stringify(msg));
                    break;
                case "CardMsg":
                    this.CardMessage = JSON.parse(JSON.stringify(msg));
                    break;
            }
        }
    }

    async initNetSystem(ip:string){
        await this.createConnection(ip)
        .then(()=>{
            this.connectionStatus = 1;//成功狀態
            this.startReceiveMessage();
        })
        .catch((error)=>{
            this.connectionStatus = -1;//失敗狀態
            cc.log(error);
        })
    }
}