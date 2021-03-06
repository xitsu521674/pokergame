// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import {NetSystem} from "./Net"

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    
    @property(cc.EditBox)
    urleditbox:cc.EditBox = null;
    @property(cc.Node)
    urlconfirmbtn:cc.Node = null;
    @property(cc.EditBox)
    nameeditbox:cc.EditBox = null;
    @property(cc.Node)
    nameconfirmbtn:cc.Node = null;
    @property(cc.Node)
    connectionSign:cc.Node = null;
    @property(cc.Prefab)
    roomprefab:cc.Prefab = null;
    @property(cc.Node)
    roomfather:cc.Node = null;
    @property(cc.Node)
    cam:cc.Node = null;
    @property(cc.Node)
    createRoomBtn:cc.Node = null;
    @property(cc.EditBox)
    createRoomName:cc.EditBox = null;
    @property(cc.Node)
    gameroom:cc.Node = null;
    @property(cc.Node)
    message:cc.Node = null;
    @property(cc.Node)
    handfather:cc.Node = null;
    @property(cc.Node)
    headfather:cc.Node = null;
    @property(cc.Node)
    bodyfather:cc.Node = null;
    @property(cc.Node)
    tailfather:cc.Node = null;
    @property(cc.SpriteAtlas)
    cardsprites:cc.SpriteAtlas = null;
    @property(cc.Node)
    waitforcardmsg:cc.Node = null;
    @property(cc.Label)
    countdown:cc.Label = null;
    @property(cc.Label)
    player1:cc.Label = null;
    @property(cc.Label)
    player2:cc.Label = null;
    @property(cc.Label)
    player3:cc.Label = null;
    @property(cc.Label)
    you:cc.Label = null;
    @property(cc.Label)
    yourate:cc.Label = null;
    @property(cc.Label)
    playerrate1:cc.Label = null;
    @property(cc.Label)
    playerrate2:cc.Label = null;
    @property(cc.Label)
    playerrate3:cc.Label = null;
    @property(cc.Label)
    firstslicestatus:cc.Label = null;
    @property(cc.Label)
    secondslicestatus:cc.Label = null;
    @property(cc.Label)
    thirdslicestatus:cc.Label = null;
    @property(cc.Node)
    waitforplaymsg:cc.Node = null;
    @property(cc.Node)
    leavebtnA:cc.Node = null;
    @property(cc.Node)
    leavebtnB:cc.Node = null;
    @property(cc.Label)
    youplaystatus:cc.Label = null;
    @property(cc.Label)
    p1playtatus:cc.Label = null;
    @property(cc.Label)
    p2playtatus:cc.Label = null;
    @property(cc.Label)
    p3playtatus:cc.Label = null;

    ns:NetSystem = null;
    username:string = null;//???????????????
    curRoomNum:number = null;
    sendcard = [];
    allcountbookmark = [];
    realhand = [];

    onLoad () {
        this.leavebtnA.on(cc.Node.EventType.MOUSE_DOWN,()=>{
            let msg = 
            {
                "Type": "exit.room"   // Request type
            }
            this.ns.websocket.send(JSON.stringify(msg));

            for(let i=0;i<this.allcountbookmark.length;++i){
                clearInterval(this.allcountbookmark[i]);
                clearTimeout(this.allcountbookmark[i]);
            }

            this.leavebtnA.active = false;
            this.countdown.node.active = false;
            this.lounge();
        },this)
        this.leavebtnB.on(cc.Node.EventType.MOUSE_DOWN,()=>{
            let msg = 
            {
                "Type": "exit.room"   // Request type
            }
            this.ns.websocket.send(JSON.stringify(msg));

            for(let i=0;i<this.allcountbookmark.length;++i){
                clearInterval(this.allcountbookmark[i]);
                clearTimeout(this.allcountbookmark[i]);
            }

            this.leavebtnB.active = false;
            this.countdown.node.active = false;
            this.lounge();
        },this)
        




        //??????
        //  login -> lounge -> playroom -> game -> playcard --???
        //             ???           ???                          |
        //             ???-----------???--------------------------???
        //         ????????????      ????????????
        this.login()
        
        
        
    }

    login(){
        return new Promise((resolve,reject)=>{
            this.urlconfirmbtn.on(cc.Node.EventType.MOUSE_DOWN,()=>{
                this.ns = new NetSystem();
                this.ns.connectionStatus = 0;
                this.connectionSign.color = cc.Color.YELLOW;
    
                this.ns.initNetSystem(this.urleditbox.string);
                let checktimer = setInterval(()=>{
                    if(this.ns.connectionStatus!=0){
                        if(this.ns.connectionStatus==1){
                            this.connectionSign.color = cc.Color.GREEN;
                        }else if(this.ns.connectionStatus==-1){
                            this.connectionSign.color = cc.Color.RED;
                        }
                        clearInterval(checktimer);
                    }
                },100)
            },this)
    
            this.nameconfirmbtn.on(cc.Node.EventType.MOUSE_DOWN,()=>{
                this.username = this.nameeditbox.string;
                if(this.ns.connectionStatus==1){
                    let msg = {
                        "Type": "join.lobby",   // Request type
                        "Name": this.username      // Player's nickname
                    }
                    this.ns.websocket.send(JSON.stringify(msg));
                    resolve('');
                    let waitforupdate = setInterval(()=>{
                        if(this.ns.LocationMessage.Location==1){
                            clearInterval(waitforupdate);
                            clearTimeout(logintimeout);
                            this.lounge();
                        }
                    },500);

                    let logintimeout = setTimeout(() => {
                        if(this.ns.LocationMessage.Location==0){
                            clearInterval(waitforupdate);
                            alert('?????????????????????');
                        }
                    }, 100);
                }
                
            },this)
        })
    }

    lounge(){
            this.createRoomBtn.on(cc.Node.EventType.MOUSE_DOWN,()=>{
                let msg = {
                    "Type": "join.room",    // Request type
                    "Name": this.createRoomName.string      // Room's name
                }
                this.ns.websocket.send(JSON.stringify(msg));
                let waitforupdate = setInterval(()=>{
                    if(this.ns.LocationMessage.Location==2){
                        clearInterval(waitforupdate);
                        this.PlayRoom();
                    }
                },500);
            },this);
    
            this.cam.position = cc.v3(3000,0);//??????cam
            let updateRooms = setInterval(()=>{
                let rooms = this.ns.RoomMessage.Rooms;
                if(typeof(rooms)!=undefined){
                    let roomNum = rooms.length;
                    
                    let strX = 0;
                    let strY = -50;
                    let deltaY = -80;
                    
                    this.roomfather.removeAllChildren();

                    for(let i=0;i<roomNum;i++){
                        let obj = cc.instantiate(this.roomprefab);
                        obj.setParent(this.roomfather);
                        obj.setPosition(strX,strY+deltaY*i);
                        obj.getComponent('room').setStatus(rooms[i].Name,rooms[i].Players);
                        obj.on(cc.Node.EventType.MOUSE_DOWN,()=>{
                            let msg = {
                                "Type": "join.room",    // Request type
                                "Name": rooms[i].Name      // Room's name
                            }
                            this.ns.websocket.send(JSON.stringify(msg));
                            let waitforupdate = setInterval(()=>{
                                if(this.ns.LocationMessage.Location==2){
                                    clearInterval(waitforupdate);
                                    clearTimeout(joinlobbytimeout);
                                    this.PlayRoom();
                                }
                            },500);
                            let joinlobbytimeout = setTimeout(() => {
                                if(this.ns.LocationMessage.Location==1){
                                    clearInterval(waitforupdate);
                                    alert('??????????????????');
                                }
                            }, 100);
                        },this)
                    }
                }
            },2000);
    }

    PlayRoom(){
        this.leavebtnA.active = true;
        
        this.cam.position = cc.v3(9000,0,0);//????????????

        let roomname = this.ns.LocationMessage.Name;
        
        let roomNum;
        for(let i=0;i<this.ns.RoomMessage.Rooms.length;++i){
            if(this.ns.RoomMessage.Rooms[i].Name==roomname){
                roomNum = i;
                this.curRoomNum = roomNum;
                break;
            }
        }

        this.message.active = true;//???????????????

        

        let roomupdate = setInterval(()=>{
            let playernum = 0;
            let putnamecount = 0;   
            for(let i=0;i<this.ns.RoomMessage.Rooms[roomNum].Players.length;++i){
                if(this.ns.RoomMessage.Rooms[roomNum].Players[i]!=""){
                    playernum++;
                }
                if(this.ns.RoomMessage.Rooms[roomNum].Players[i]!=this.username){//????????????
                     if(putnamecount==0){
                         this.player1.string = this.ns.RoomMessage.Rooms[roomNum].Players[i];
                     }else if(putnamecount==1){
                        this.player2.string = this.ns.RoomMessage.Rooms[roomNum].Players[i];
                     }else if(putnamecount==2){
                        this.player3.string = this.ns.RoomMessage.Rooms[roomNum].Players[i];
                     }
                     putnamecount++;
                }
            }
            if(playernum==4){
                this.message.active = false;
                clearInterval(roomupdate);
                this.waitforcardmsg.active = true;
                let waitforcard = setInterval(()=>{
                    if(this.ns.CardMessage!=null){
                        clearInterval(waitforcard);
                        let turntogame = setTimeout(()=>{
                            this.waitforcardmsg.active = false;
                            this.Game();
                        },1000)
                        this.allcountbookmark.push(turntogame);
                    }
                },500);
                this.allcountbookmark.push(waitforcard);
            }     
        },500)
        this.allcountbookmark.push(roomupdate);
        

        
    }

    setCard(hands,head,body,tail,picked){

        this.handfather.removeAllChildren();
        let handstrX = -455;
        let handstrY = 0;
        let handdeltaX = 80;
        handstrX += (13-hands.length) / 2 * handdeltaX;
        for(let i=0;i<hands.length;++i){
            let newcard = new cc.Node;
            newcard.setParent(this.handfather);
            newcard.height = 94;
            newcard.width = 68;
            newcard.setPosition(handstrX+i*handdeltaX,handstrY);

            newcard.addComponent(cc.Sprite);
            newcard.getComponent(cc.Sprite).spriteFrame = this.cardsprites.getSpriteFrame(hands[i]+1);
            newcard.addComponent(cc.BlockInputEvents);

            newcard.on(cc.Node.EventType.MOUSE_DOWN,()=>{
                
                let cardindex = picked.indexOf(hands[i]);
                
                if(cardindex==-1){//????????????????????????
                    cc.tween(newcard)
                    .by(0.1,{position:cc.v3(0,50,0)})
                    .start();
                    picked.push(hands[i]);
                }else{//???????????????
                    cc.tween(newcard)
                    .by(0.1,{position:cc.v3(0,-50,0)})
                    .start();
                    picked = picked.filter(function(item) {
                        return item != hands[i];
                    });
                }
                
                if(head.length==0&&picked.length==3){//????????????
                    head = picked.filter(() => true);//????????????head
                    hands = hands.filter(function(item) {
                        for(let r=0;r<picked.length;++r){
                            if(item==picked[r]){
                                return false;
                            }
                        }
                        return true;
                    });

                    this.realhand = hands;

                    picked = [];

                    let sorthead = [];  //??????
                    for(let i=0;i<13;++i){//?????????
                        for(let j=0;j<4;++j){//?????????
                            for(let l=0;l<head.length;++l){
                                if((head[l]%13==i)&&(Math.floor(head[l]/13)==j)){
                                    sorthead.push(head[l]);
                                }
                            }
                        }
                    }

                    head = sorthead;
                    this.sendcard.splice(0,3,head[0],head[1],head[2]);

                    this.firstslicestatus.string = ''+this.calculateScore(head)[1];   
                    this.setCard(hands,head,body,tail,picked);
                }else if(head.length==3&&body.length==0&&picked.length==5){//?????????
                    body = picked.filter(() => true);//????????????head
                    hands = hands.filter(function(item) {
                        for(let r=0;r<picked.length;++r){
                            if(item==picked[r]){
                                return false;
                            }
                        }
                        return true;
                    });
                    picked = [];

                    this.realhand = hands;


                    let sortbody = [];  //??????
                    for(let i=0;i<13;++i){//?????????
                        for(let j=0;j<4;++j){//?????????
                            for(let l=0;l<body.length;++l){
                                if((body[l]%13==i)&&(Math.floor(body[l]/13)==j)){
                                    sortbody.push(body[l]);
                                }
                            }
                        }
                    }


                    body = sortbody;
                    this.sendcard.splice(3,5,body[0],body[1],body[2],body[3],body[4]);

                    this.secondslicestatus.string = ''+this.calculateScore(body)[1];   
                    this.setCard(hands,head,body,tail,picked);
                }else if(head.length==3&&body.length==5&&picked.length==5){//?????????
                    tail = picked.filter(() => true);//????????????head
                    hands = hands.filter(function(item) {
                        for(let r=0;r<picked.length;++r){
                            if(item==picked[r]){
                                return false;
                            }
                        }
                        return true;
                    });
                    picked = [];

                    this.realhand = hands;


                    let sorttail = [];  //??????
                    for(let i=0;i<13;++i){//?????????
                        for(let j=0;j<4;++j){//?????????
                            for(let l=0;l<tail.length;++l){
                                if((tail[l]%13==i)&&(Math.floor(tail[l]/13)==j)){
                                    sorttail.push(tail[l]);
                                }
                            }
                        }
                    }


                    tail = sorttail;
                    this.sendcard.splice(8,5,tail[0],tail[1],tail[2],tail[3],tail[4]);

                    this.thirdslicestatus.string = ''+this.calculateScore(tail)[1];                       
                    this.setCard(hands,head,body,tail,picked);
                }
    
            },this);
        }
       
       
       
       
        //??????head
        let headstrX = -94;
        let headstrY = 0;
        let headdeltaX = 94;

        this.headfather.removeAllChildren();
        for(let i=0;i<head.length;++i){
            let newcard = new cc.Node;
            newcard.height = 94;
            newcard.width = 68;
            newcard.setParent(this.headfather);
            newcard.setPosition(headstrX+i*headdeltaX,headstrY);

            newcard.addComponent(cc.Sprite);
            newcard.getComponent(cc.Sprite).spriteFrame = this.cardsprites.getSpriteFrame(head[i]+1);

            //??????????????????
            newcard.on(cc.Node.EventType.MOUSE_DOWN,()=>{
                this.headfather.removeAllChildren();
                for(let r=0;r<head.length;++r){//??????????????????
                    hands.push(head[r]);
                }
                head = [];//????????????

                this.sendcard.splice(0,3,-1,-1,-1);
                //???????????????
                let sorthand = [];
                for(let i=0;i<13;++i){//?????????
                    for(let j=0;j<4;++j){//?????????
                        for(let l=0;l<hands.length;++l){
                            if((hands[l]%13==i)&&(Math.floor(hands[l]/13)==j)){
                                sorthand.push(hands[l]);
                            }
                        }
                    }
                }
                hands = sorthand;
                
                this.realhand = hands;


                this.setCard(hands,head,body,tail,picked);
                this.firstslicestatus.string = "";                            

            },this)
        }
        //??????head??????

        //??????body
        let bodystrX = -188;
        let bodystrY = 0;
        let bodydeltaX = 94;

        this.bodyfather.removeAllChildren();
        for(let i=0;i<body.length;++i){
            let newcard = new cc.Node;
            newcard.height = 94;
            newcard.width = 68;
            newcard.setParent(this.bodyfather);
            newcard.setPosition(bodystrX+i*bodydeltaX,bodystrY);

            newcard.addComponent(cc.Sprite);
            newcard.getComponent(cc.Sprite).spriteFrame = this.cardsprites.getSpriteFrame(body[i]+1);

            //??????????????????
            newcard.on(cc.Node.EventType.MOUSE_DOWN,()=>{
                this.bodyfather.removeAllChildren();
                for(let r=0;r<body.length;++r){//??????????????????
                    hands.push(body[r]);
                }
                body = [];//????????????
                this.sendcard.splice(3,5,-1,-1,-1,-1,-1);
                //???????????????
                let sorthand = [];
                for(let i=0;i<13;++i){//?????????
                    for(let j=0;j<4;++j){//?????????
                        for(let l=0;l<hands.length;++l){
                            if((hands[l]%13==i)&&(Math.floor(hands[l]/13)==j)){
                                sorthand.push(hands[l]);
                            }
                        }
                    }
                }
                hands = sorthand;
                
                this.realhand = hands;

                this.setCard(hands,head,body,tail,picked);
                this.secondslicestatus.string = "";                            

            },this)
        }
        //??????body??????

        //??????tail
        let tailstrX = -188;
        let tailstrY = 0;
        let taildeltaX = 94;

        this.tailfather.removeAllChildren();
        for(let i=0;i<tail.length;++i){
            let newcard = new cc.Node;
            newcard.height = 94;
            newcard.width = 68;
            newcard.setParent(this.tailfather);
            newcard.setPosition(tailstrX+i*taildeltaX,tailstrY);

            newcard.addComponent(cc.Sprite);
            newcard.getComponent(cc.Sprite).spriteFrame = this.cardsprites.getSpriteFrame(tail[i]+1);

            //??????????????????
            newcard.on(cc.Node.EventType.MOUSE_DOWN,()=>{
                this.tailfather.removeAllChildren();
                for(let r=0;r<tail.length;++r){//??????????????????
                    hands.push(tail[r]);
                }
                tail = [];//????????????
                this.sendcard.splice(8,5,-1,-1,-1,-1,-1);

                //???????????????
                let sorthand = [];
                for(let i=0;i<13;++i){//?????????
                    for(let j=0;j<4;++j){//?????????
                        for(let l=0;l<hands.length;++l){
                            if((hands[l]%13==i)&&(Math.floor(hands[l]/13)==j)){
                                sorthand.push(hands[l]);
                            }
                        }
                    }
                }
                hands = sorthand;

                this.realhand = hands;

                this.setCard(hands,head,body,tail,picked);                            
                this.thirdslicestatus.string = "";
            },this)
        }
        //??????tail??????

        
    }
    Game(){
        this.leavebtnB.active = true;
        this.cam.position = cc.v3(6000,0,0);
        cc.log('????????????');
        
        for(let i=0;i<13;++i){
            this.sendcard[i] = -1;
        }
        this.playerrate1.string = "";
        this.playerrate2.string = "";
        this.playerrate3.string = "";
        this.yourate.string = "";

        

        this.firstslicestatus.string = "";
        this.secondslicestatus.string = "";
        this.thirdslicestatus.string = "";


        //?????????????????????????????????
        let playernum;
        for(let i=0;i<4;++i){
            if(this.ns.RoomMessage.Rooms[this.curRoomNum].Players[i]==this.username){
                playernum = i;
                break;
            }
        }
        cc.log('???????????? '+playernum);
        
        this.realhand = this.ns.CardMessage.Cards[playernum];//???????????????
        let head = [];
        let body = [];
        let tail = [];
        let picked = [];
        let sorthand = [];  //?????????
        for(let i=0;i<13;++i){//?????????
            for(let j=0;j<4;++j){//?????????
                for(let l=0;l<this.realhand.length;++l){
                    if((this.realhand[l]%13==i)&&(Math.floor(this.realhand[l]/13)==j)){
                        sorthand.push(this.realhand[l]);
                    }
                }
            }
        }

        
        let sorthead = [];  //??????
        for(let i=0;i<13;++i){//?????????
            for(let j=0;j<4;++j){//?????????
                for(let l=0;l<head.length;++l){
                    if((head[l]%13==i)&&(Math.floor(head[l]/13)==j)){
                        sorthead.push(head[l]);
                    }
                }
            }
        }

        let sortbody = [];  //?????????
        for(let i=0;i<13;++i){//?????????
            for(let j=0;j<4;++j){//?????????
                for(let l=0;l<body.length;++l){
                    if((body[l]%13==i)&&(Math.floor(body[l]/13)==j)){
                        sortbody.push(body[l]);
                    }
                }
            }
        }

        let sorttail = [];  //??????
        for(let i=0;i<13;++i){//?????????
            for(let j=0;j<4;++j){//?????????
                for(let l=0;l<tail.length;++l){
                    if((tail[l]%13==i)&&(Math.floor(tail[l]/13)==j)){
                        sorttail.push(tail[l]);
                    }
                }
            }
        }
        
        this.setCard(sorthand,sorthead,sortbody,sorttail,picked);

        let time = 25;
        this.countdown.string = "25";
        this.countdown.node.active = true;
        let countdowntimer = setInterval(()=>{
            time--;
            this.countdown.string = ""+time;
            if(time==0){
                clearInterval(countdowntimer);

                for(let i=0;i<this.realhand.length;i++){
                    for(let j=0;j<this.sendcard.length;++j){
                        if(this.sendcard[j]==-1){
                            this.sendcard[j]=this.realhand[i];
                            break;
                        }
                    }
                }
                
                this.setCard([],this.sendcard.slice(0,3),this.sendcard.slice(3,8),this.sendcard.slice(8,13),[]);
                this.firstslicestatus.string = ''+this.calculateScore(this.sendcard.slice(0,3))[1];  
                this.secondslicestatus.string = ''+this.calculateScore(this.sendcard.slice(3,8))[1];  
                this.thirdslicestatus.string = ''+this.calculateScore(this.sendcard.slice(8,13))[1];                       

                let msg = 
                {
                    "Type": "set.card",     // Request type
                    "Cards": this.sendcard, // Integer array of length 13, element is player's card index, array index 0~2: front set, 3~7: middle set, 8~12: back set
                }
                this.ns.websocket.send(JSON.stringify(msg));
                cc.log('????????????');
                cc.log(this.sendcard);

                this.waitforplaymsg.active = true;

                this.countdown.node.active = false;
                let waitforshowcard = setInterval(()=>{
                    let checkcount = 0;
                    for(let i=0;i<this.ns.CardMessage.Cards.length;++i){
                        if(this.ns.CardMessage.Cards[i][0]!=-1){
                            checkcount++;
                        }
                    }
                    if(checkcount==4){//????????????
                        cc.log('??????');
                        clearInterval(waitforshowcard);
                        this.waitforplaymsg.active = false;
                        this.playcard(playernum);
                    }
                },500)
                this.allcountbookmark.push(waitforshowcard);
            }
        },1000)
        this.allcountbookmark.push(countdowntimer);

        

    }

    playcard(playernum:number){//??????
        this.cam.position = cc.v3(9000,0,0);

        this.youplaystatus.node.parent.active = true;
        this.p1playtatus.node.parent.active = true;
        this.p2playtatus.node.parent.active = true;
        this.p3playtatus.node.parent.active = true;


        
        let otherplayer = [0,1,2,3];//????????????
        otherplayer = otherplayer.filter((val)=>{
            return val!=playernum;
        })
        let calculatedScore = [];//????????????????????????
        let styletype = [];
        
        let weight = [13,1,2,3,4,5,6,7,8,9,10,11,12];

        let strX:number = -80;
        let strY:number = -95;
        let deltaX:number = 80;
        let cardheight = 80;
        let cardwidth = 61;
        let players:cc.Label[] = [this.player1,this.player2,this.player3];
        let playerrates:cc.Label[] = [this.playerrate1,this.playerrate2,this.playerrate3];
        let playersplaystatus:cc.Label[] = [this.p1playtatus,this.p2playtatus,this.p3playtatus];
        cc.log('??????')

        //????????????
        for(let i=0;i<this.ns.CardMessage.Cards.length;++i){//?????????
            let calculatePart = this.ns.CardMessage.Cards[i].slice(0,3);
            let temp = this.calculateScore(calculatePart);
            calculatedScore[i] = temp[0];
            styletype[i] = temp[1];
        }
        let tempmax = 0;
        for(let i=0;i<calculatedScore.length;++i){
            tempmax = Math.max(tempmax,calculatedScore[i]);
        }
        //????????????
        for(let i=0;i<calculatedScore.length;++i){
            for(let j=0;j<calculatedScore.length;++j){
                if(i==j){
                    continue;
                }
                if(calculatedScore[i]==calculatedScore[j]&&calculatedScore[i]==tempmax){
                    let set1 = this.ns.CardMessage.Cards[i].slice(0,3);
                    let set2 = this.ns.CardMessage.Cards[j].slice(0,3);
                    set1.sort((a,b)=>{
                        return a-b;
                    });
                    set2.sort((a,b)=>{
                        return a-b;
                    });
                    for(let z=0;z<set1.length;++z){
                        if(weight[set1[z]]>weight[set2[z]]){
                            calculatedScore[j]--;
                            break;
                        }else if(weight[set1[z]]<weight[set2[z]]){
                            calculatedScore[i]--;
                            break;
                        }
                    }

                }
            }
        }
        
        if(calculatedScore[playernum]==tempmax){//???????????????
            this.yourate.node.color = cc.Color.YELLOW;
            this.yourate.string = '???';
        }else{
            this.yourate.node.color = cc.Color.RED;
            this.yourate.string = '???';
        }
        this.youplaystatus.string = ' '+styletype[playernum];
        for(let i=0;i<3;++i){
            if(calculatedScore[otherplayer[i]]==tempmax){//???????????????
                playerrates[i].node.color = cc.Color.YELLOW;
                playerrates[i].string = '???';
            }else{
                playerrates[i].node.color = cc.Color.RED;
                playerrates[i].string = '???';
            }
            playersplaystatus[i].string = ' '+styletype[otherplayer[i]];
        }
        //??????????????????


        for(let i=0;i<3;++i){
            let card = new cc.Node();
            card.height = cardheight;
            card.width = cardwidth;
            card.addComponent(cc.Sprite);
            card.getComponent(cc.Sprite).spriteFrame = this.cardsprites.getSpriteFrame(this.ns.CardMessage.Cards[playernum][i]+1);
            card.setParent(this.you.node);
            card.position = cc.v3(strX+i*deltaX,strY);
        }
        for(let i=0;i<otherplayer.length;++i){
            for(let j=0;j<3;++j){
                let card = new cc.Node();
                card.height = cardheight;
                card.width = cardwidth;
                card.addComponent(cc.Sprite);
                card.getComponent(cc.Sprite).spriteFrame = this.cardsprites.getSpriteFrame(this.ns.CardMessage.Cards[otherplayer[i]][j]+1);
                card.setParent(players[i].node);
                card.position = cc.v3(strX+j*deltaX,strY);
            }
        }



        let judgeturn1 = setTimeout(() => {

//????????????
for(let i=0;i<this.ns.CardMessage.Cards.length;++i){//?????????
    let calculatePart = this.ns.CardMessage.Cards[i].slice(3,8);
    let temp = this.calculateScore(calculatePart);
            calculatedScore[i] = temp[0];
            styletype[i] = temp[1];
}
let tempmax = 0;
for(let i=0;i<calculatedScore.length;++i){
    tempmax = Math.max(tempmax,calculatedScore[i]);
}

//????????????
for(let i=0;i<calculatedScore.length;++i){
    for(let j=0;j<calculatedScore.length;++j){
        if(i==j){
            continue;
        }
        if(calculatedScore[i]==calculatedScore[j]&&calculatedScore[i]==tempmax){
            let set1 = this.ns.CardMessage.Cards[i].slice(3,8);
            let set2 = this.ns.CardMessage.Cards[j].slice(3,8);
            set1.sort((a,b)=>{
                return a-b;
            });
            set2.sort((a,b)=>{
                return a-b;
            });
            for(let z=0;z<set1.length;++z){
                if(weight[set1[z]]>weight[set2[z]]){
                    calculatedScore[j]--;
                    break;
                }else if(weight[set1[z]]<weight[set2[z]]){
                    calculatedScore[i]--;
                    break;
                }
            }

        }
    }
}


if(calculatedScore[playernum]==tempmax){//???????????????
    this.yourate.node.color = cc.Color.YELLOW;
    this.yourate.string = '???';
}else{
    this.yourate.node.color = cc.Color.RED;
    this.yourate.string = '???';
}
this.youplaystatus.string = ' '+styletype[playernum];

for(let i=0;i<3;++i){
    if(calculatedScore[otherplayer[i]]==tempmax){//???????????????
        playerrates[i].node.color = cc.Color.YELLOW;
        playerrates[i].string = '???';
    }else{
        playerrates[i].node.color = cc.Color.RED;
        playerrates[i].string = '???';
    }
    playersplaystatus[i].string = ' '+styletype[otherplayer[i]];

}
//??????????????????

            this.you.node.removeAllChildren();
            for(let i=0;i<5;++i){
                let card = new cc.Node();
                card.height = cardheight;
                card.width = cardwidth;
                card.addComponent(cc.Sprite);
                card.getComponent(cc.Sprite).spriteFrame = this.cardsprites.getSpriteFrame(this.ns.CardMessage.Cards[playernum][i+3]+1);
                card.setParent(this.you.node);
                card.position = cc.v3(strX+strX+i*deltaX,strY);
            }
            for(let i=0;i<otherplayer.length;++i){
                players[i].node.removeAllChildren();
                for(let j=0;j<5;++j){
                    let card = new cc.Node();
                    card.height = cardheight;
                    card.width = cardwidth;
                    card.addComponent(cc.Sprite);
                    card.getComponent(cc.Sprite).spriteFrame = this.cardsprites.getSpriteFrame(this.ns.CardMessage.Cards[otherplayer[i]][j+3]+1);
                    card.setParent(players[i].node);
                    card.position = cc.v3(strX+strX+j*deltaX,strY);
                }
            }
        }, 3000);

        let judgeturn2 = setTimeout(() => {

//????????????
for(let i=0;i<this.ns.CardMessage.Cards.length;++i){//?????????
    let calculatePart = this.ns.CardMessage.Cards[i].slice(8,13);
    let temp = this.calculateScore(calculatePart);
            calculatedScore[i] = temp[0];
            styletype[i] = temp[1];
}
let tempmax = 0;
for(let i=0;i<calculatedScore.length;++i){
    tempmax = Math.max(tempmax,calculatedScore[i]);
}

//????????????
for(let i=0;i<calculatedScore.length;++i){
    for(let j=0;j<calculatedScore.length;++j){
        if(i==j){
            continue;
        }
        if(calculatedScore[i]==calculatedScore[j]&&calculatedScore[i]==tempmax){
            let set1 = this.ns.CardMessage.Cards[i].slice(8,13);
            let set2 = this.ns.CardMessage.Cards[j].slice(8,13);
            set1.sort((a,b)=>{
                return a-b;
            });
            set2.sort((a,b)=>{
                return a-b;
            });
            for(let z=0;z<set1.length;++z){
                if(weight[set1[z]]>weight[set2[z]]){
                    calculatedScore[j]--;
                    break;
                }else if(weight[set1[z]]<weight[set2[z]]){
                    calculatedScore[i]--;
                    break;
                }
            }

        }
    }
}


if(calculatedScore[playernum]==tempmax){//???????????????
    this.yourate.node.color = cc.Color.YELLOW;
    this.yourate.string = '???';
}else{
    this.yourate.node.color = cc.Color.RED;
    this.yourate.string = '???';
}
this.youplaystatus.string = ' '+styletype[playernum];

for(let i=0;i<3;++i){
    if(calculatedScore[otherplayer[i]]==tempmax){//???????????????
        playerrates[i].node.color = cc.Color.YELLOW;
        playerrates[i].string = '???';
    }else{
        playerrates[i].node.color = cc.Color.RED;
        playerrates[i].string = '???';
    }
    playersplaystatus[i].string = ' '+styletype[otherplayer[i]];

}
//??????????????????

            this.you.node.removeAllChildren();
            for(let i=0;i<5;++i){
                let card = new cc.Node();
                card.height = cardheight;
                card.width = cardwidth;
                card.addComponent(cc.Sprite);
                card.getComponent(cc.Sprite).spriteFrame = this.cardsprites.getSpriteFrame(this.ns.CardMessage.Cards[playernum][i+8]+1);
                card.setParent(this.you.node);
                card.position = cc.v3(strX+strX+i*deltaX,strY);
            }
            for(let i=0;i<otherplayer.length;++i){
                players[i].node.removeAllChildren();
                for(let j=0;j<5;++j){
                    let card = new cc.Node();
                    card.height = cardheight;
                    card.width = cardwidth;
                    card.addComponent(cc.Sprite);
                    card.getComponent(cc.Sprite).spriteFrame = this.cardsprites.getSpriteFrame(this.ns.CardMessage.Cards[otherplayer[i]][j+8]+1);
                    card.setParent(players[i].node);
                    card.position = cc.v3(strX+strX+j*deltaX,strY);
                }
            }
        }, 6000);

        let judgeturn3 = setTimeout(()=>{
            this.yourate.string = "";
            this.youplaystatus.string = "";
            for(let i=0;i<playerrates.length;++i){
                playerrates[i].string = "";
                playersplaystatus[i].string = "";
            }
            this.you.node.removeAllChildren();
            for(let i=0;i<players.length;++i){
                players[i].node.removeAllChildren();
            }

            this.youplaystatus.node.parent.active = false;
            this.p1playtatus.node.parent.active = false;
            this.p2playtatus.node.parent.active = false;
            this.p3playtatus.node.parent.active = false;
            
            this.ns.CardMessage = null;
            this.PlayRoom();//???????????????
        },9000);


        this.allcountbookmark.push(judgeturn1);
        this.allcountbookmark.push(judgeturn2);
        this.allcountbookmark.push(judgeturn3);
    }

    

    calculateScore(cards){
        //?????????????????????????????????????????????????????????????????????????????????
        //  8     7     6     5    4    3     2    1     0 
        //
        let score = 0;
        let style = [0,0,0,0];//?????????????????????
        let point = [0,0,0,0,0,0,0,0,0,0,0,0,0];//?????????????????????
        let weight = [12,0,1,2,3,4,5,6,7,8,9,10,11];//????????????
        let oneway = false;//?????????
        let samestyle = false;//?????????
        let mostcardnum = 0;//???????????????????????????
        let maxnum = 0;//???????????????
        for(let i=0;i<cards.length;++i){
            style[Math.floor(cards[i]/13)]++;
            point[cards[i]%13]++;
        }

        if(cards.length==5){
            for(let i=0;i<9;){//?????????????????????
                let count = 0;
                for(let j=i;j<i+5;++j,++i){
                    if(point[j]==0){
                        ++i;
                        break;
                    }
                    count++;
                }
                if(count==5){
                    oneway = true;
                }
            }
            for(let i=0;i<style.length;++i){//?????????????????????
                if(style[i]==5){
                    samestyle = true;
                    break;
                }
            }
        }


        if(point[0]!=0){
            maxnum = 0;
        }else{
            for(let i=0;i<point.length;++i){//??????????????????
                if(point[i]!=0){
                    maxnum = i;
                }
            }
        }
        
        score += weight[maxnum];
        if(oneway){
            if(samestyle){//?????????
                score += 8*13;
                return [score,'?????????'];
            }
        }

        for(let i=0;i<point.length;++i){//???????????????????????????
            mostcardnum = Math.max(mostcardnum,point[i]);
        }
        if(mostcardnum==4){//??????
            score += 7*13;
            return [score,'??????'];
        }
        if(mostcardnum==3){//?????????
            for(let i=0;i<point.length;++i){
                if(point[i]==2){
                    score += 6*13;
                    return [score,'??????'];
                }
            }
        }
        if(samestyle){//??????
            score+= 5*13;
            return [score,'??????'];
        }
        if(oneway){//??????
            score+= 4*13;
            return [score,'??????'];
        }
        if(mostcardnum==3){//??????
            score += 3*13;
            return [score,'??????'];
        }
        if(mostcardnum==2){//???????????????
            let pairnum = 0;
            for(let i=0;i<point.length;++i){
                if(point[i] == 2){
                    pairnum++;
                }
            }
            if(pairnum==2){
                score += 2*13;//??????
                return [score,'??????'];
            }else if(pairnum==1){
                score += 1*13;//??????
                return [score,'??????'];
            }
        }
        return [score,'??????'];//????????????

    }

}
