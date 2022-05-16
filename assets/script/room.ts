// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    roomname: cc.Label = null;
    @property(cc.Label)
    playernum: cc.Label = null;
    @property(cc.Label)
    playerlsit:cc.Label = null;
    
    setStatus(name:string,players:string [] ){
        this.roomname.string = name;
        let playernum = 0;
        players.forEach((e)=>{
            if(e!=""){
                playernum++;
            }
        })
        this.playernum.string = playernum+"/4";
        for(let i=0;i<players.length;++i){
            this.playerlsit.string += players[i] + "  ";
        }
    }
}
