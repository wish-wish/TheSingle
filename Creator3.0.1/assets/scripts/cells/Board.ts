
import { _decorator, Component, Node, resources, Prefab, Vec3,instantiate,find, RichTextComponent, RichText, UITransform, Size, view, SystemEventType, size, Graphics } from 'cc';
import {} from 'cc/env'
import { PoolMgr } from '../data/PoolMgr';
import { Cell } from './Cell';
import { Cmd } from './Cmd';
const { ccclass, property } = _decorator;

@ccclass('Board')
export class Board extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    @property({
        type:Node
    })
    cell:Node=null as any;
    @property({
        type:[Node]
    })
    public cells=[];
    @property({
        type:[Node]
    })
    public funcs=[];
    @property({
        type:[Node]
    })
    public buddies=[];
    
    public walks=new Array<Array<number>>();
    public walklist=new Array<number>();

    public mode=1;
    public modenum=3;
    
    public num=1;
    public nummax=17;
    
    public funmode=1;
    public funmax=9;

    public biglevels=0;
    public levelnum=9;

    public defscale=1.0;
    public deflen=60;

    public delaytime=500;
    public interval=0;

    @property({
        type:Size
    })
    public pfSize=new Size(1,1);    
    onLoad()
    {
        console.log("onLoad");        
    }
    onDestroy()
    {
        console.log("onDestroy");
        resources.releaseAll();
    }
    start () {
        console.log("start");
        this.initBoard();        
    }
    initBoard()
    {
        // [3]
        const self=this;     
        let cmdnum=self.num;
        if(self.num<self.funmax)      
            cmdnum=self.funmax;
        let perres="Sprite";
        let r=Math.random()*10;
        if(r>3&&r<7)
        {
            perres="Sprite1";
        }
        else if(r>=7)
        {
            perres="Sprite2";
        }
        resources.load("cell/"+perres,Prefab,(err:any,perfab:Prefab)=>{//load cell/func prefab
            if(err)
            {
                console.warn(err);
            }
            for(let i=0;i<self.nummax*self.nummax;i++)
            {                
                const sprite=instantiate(perfab) as Node;//PoolMgr.newNode(perfab,self.node);
                self.cells.push(sprite);
                let c=sprite.addComponent(Cell);
                sprite.active=false;
                c!.rowi=Math.trunc(i/self.nummax);
                c!.coli=i%self.nummax;
                c!.idx=i;
                sprite.on(SystemEventType.TOUCH_START,(event)=>{
                    let c=sprite.getComponent(Cell);                    
                    let rtc=sprite.getComponentInChildren(RichTextComponent);
                    console.log(c!.idx+":"+rtc?.string);
                },self);
            }
            //国家，线索，笔记/推理，模式，出题，误解，对战,0~N
            for(let i=0;i<self.nummax*2;i++)
            {
                const sprite=instantiate(perfab) as Node;//PoolMgr.newNode(perfab,self.node);
                self.funcs.push(sprite);
                let c=sprite.addComponent(Cmd);
                sprite.active=false;
                sprite.on(SystemEventType.TOUCH_START,(event)=>{
                    if(event.target.name==perres)
                        self.touchSprite(sprite);
                    let c=sprite.getComponent(Cmd);
                    let rtc=sprite.getComponentInChildren(RichTextComponent);
                    console.log(c!.cmds+":"+rtc?.string+":"+event.target.name);
                },self);
            }
            let node=self.funcs[0] as Node;
            let trans=(node).getComponent(UITransform)!;
            self.pfSize=trans!.contentSize;
            //self.defscale=trans!.node.scale.x;
            //console.log(self.defscale);
            //self.deflen=self.pfSize.width;            
            self.doLayout();
            self.initWalks();
            self.cwWalkOut();    
        });
        resources.load("cell/"+perres,Prefab,(err:any,perfab:Prefab)=>{//load buddy hint prefab(house&&cross/group)
            if(err)
            {
                console.warn(err);
            }
            for(let i=0;i<self.nummax*3;i++)
            {
                const sprite=instantiate(perfab) as Node;
                self.buddies.push(sprite);
                sprite.active=false;
            }
        });
        // view.setResizeCallback(function(){
        //     console.log("setResizeCallback");
        // });        
        self.node.on(SystemEventType.SIZE_CHANGED,(event)=>{            
            self.doLayout();
            self.initWalks();
            self.cwWalkOut();
        },self);
        // this.node.on("orientationchange",(event)=>{
        //     console.log('orientationchange1');
        // },this)
        // window.onresize(function(){
        //     console.log("onresize2");
        // });
        self.interval=setInterval(()=>{
            self.touchSprite(self.funcs[0]);
        },self.delaytime);
    }
    touchSprite(sprite)
    {
        let self=this;        
        let rtc=sprite.getComponentInChildren(RichTextComponent);       
        if(rtc?.string=="Mod")
        {                                                                        
            if(self.num==this.nummax)
            {
                self.mode=(self.mode+1)%self.modenum;
            }
            if(self.mode!=0)
            {                            
                self.hidesAllShow();
                self.num=(self.num+1)%self.nummax==0?self.nummax:(self.num+1)%self.nummax;
                self.doLayout();
                self.initWalks();
                self.cwWalkOut();
            }
            else
            {
                if(self.biglevels==0)
                {
                    self.hidesAllShow();
                    self.num=self.levelnum;
                    self.mode=1;
                    self.doLayout(); 
                    self.hideCells();                           
                    self.hideBuddies();
                    self.initWalks();
                    self.cwWalkOut();
                    self.mode=0;
                    self.delaytime=100;
                    clearInterval(self.interval);
                    self.interval=setInterval(()=>{
                        self.touchSprite(self.funcs[0]);
                    },self.delaytime);
                }                                
                //self.doFunsLayout();
                self.biglevels=(self.biglevels+1)%(self.num*self.num+2);
                //self.biglevels=self.biglevels===0?self.num*self.num:self.biglevels;
                if(self.biglevels<=self.num*self.num)
                {
                    // for(let i=0;i<self.biglevels;i++)
                    // {
                    //     let node=(self.cells[self.walklist[i]] as Node);
                    //     node.active=true;
                    //     let rtc=node.getComponentInChildren(RichTextComponent);
                    //     rtc!.string=(i+1).toString();
                    // }

                    //(self.cells[self.walklist[self.biglevels]] as Node).active=true;
                    let node=(self.cells[self.walklist[self.biglevels-1]] as Node);
                    //let node=(self.cells[self.walklist[self.num*self.num-self.biglevels]] as Node);
                    node.active=true;
                    let rtc=node.getComponentInChildren(RichTextComponent);
                    rtc!.string=(self.biglevels).toString();
                }
                else
                {
                    self.biglevels=0;
                    self.mode=(self.mode+1)%self.modenum;
                    self.hidesAllShow();
                    self.num=1;
                    self.delaytime=500;
                    self.doLayout();
                    self.initWalks();
                    self.cwWalkOut();
                    clearInterval(self.interval);
                    self.interval=setInterval(()=>{
                        self.touchSprite(self.funcs[0]);
                    },self.delaytime);
                }
            }
        }
    }
    initWalks()
    {
        for(let i=0;i<this.num;i++)
        {
            this.walks.push(new Array<number>())
            for(let j=0;j<this.num;j++)
            {
                this.walks[i].push(0);
            }
        }        
    }
    getCenter()
    {
        let center=Math.trunc(this.num/2);
        let single=true;
        if(this.num%2==0)
        {
            center=center-1;
            single=false;
        }
        return [center,single];
    }
    cwWalkOut()
    {
        //left,right,top,down&&cw,ccw//8 kinds road
        //middle one left first cw        
        //lt-cw,ccw;rt-cw,ccw;lb-cw,ccw;rb-cw,ccw//8 kinds road
        //middle box/four rb left first cw        
        let wnum=this.num;
        let center=Math.trunc(wnum/2);
        let dindex=0;
        let step=1;
        let startx=center;
        let starty=center;  
        let single=wnum%2;
        dindex=dindex+1;
        this.walks[startx][starty]=dindex;//start
        this.walklist=new Array();        
        this.walklist.push(wnum*wnum-(startx*wnum+starty)-1);
        for(let j=0;j<center+single;j++)
        {
            startx=startx-1;                
            for(let i=0;i<step;i++)//to left
            {
                dindex=dindex+1;
                if((startx-i)>=0)
                {
                    this.walks[startx-i][starty]=dindex;
                    this.walklist.push(wnum*wnum-((startx-i)*wnum+starty)-1);
                }
            }
            starty=starty-1;
            startx=startx-step+1;                                
            if(startx<0) break;
            for(let i=0;i<step;i++)//to top
            {
                dindex=dindex+1;
                if((starty-i)>=0)
                {
                    this.walks[startx][starty-i]=dindex;
                    this.walklist.push(wnum*wnum-(startx*wnum+starty-i)-1);
                }
            }     
            startx=startx+1;  
            starty=starty-step+1;
            if(starty<0) break;
            step=step+1;
            for(let i=0;i<step;i++)//to right
            {
                dindex=dindex+1;         
                if((startx+i)<wnum)
                {
                    this.walks[startx+i][starty]=dindex;
                    this.walklist.push(wnum*wnum-((startx+i)*wnum+starty)-1);
                }
            }
            starty=starty+1; 
            startx=startx+step-1;
            if(startx>=wnum) break;
            for(let i=0;i<step;i++)//to bottom
            {
                dindex=dindex+1;
                if((starty+i)<wnum)
                {
                    this.walks[startx][starty+i]=dindex;
                    this.walklist.push(wnum*wnum-(startx*wnum+(starty+i))-1);
                }
            }
            starty=starty+step-1;
            if(starty>=wnum) break;
            step=step+1;
        }
        // for(let i=0;i<wnum;i++)
        // {
        //     let str="";
        //     for(let j=0;j<wnum;j++)
        //     {
        //         str+=this.walks[j][i]+"\t";
        //     }
        //     console.log(str);
        // }
    }    
    hidesAllShow()
    {                
        this.hideCells();
        this.hideFuns();
        this.hideBuddies();   
    }
    hideCells()
    {
        for(let i=0;i<this.num*this.num;i++)
        {
            (this.cells[i] as Node).active=false;
        }
    }
    hideFuns()
    {
        for(let i=0;i<this.nummax*2;i++)
        {
            (this.funcs[i] as Node).active=false;
        }
    }
    hideBuddies()
    {
        for(let i=0;i<this.num*3;i++)
        {
            (this.buddies[i] as Node).active=false;
        }
    }
    doLayout()
    {
        this.doCellsLayout();
        this.doFunsLayout();
        this.doBuddiesLayout();
    }
    doCellsLayout()
    {
        const self=this;
        let cntsize=this.getComponent(UITransform);
        let s=cntsize!.contentSize;        
        let w=s.height;
        let islanscapse=false;
        if(s.height>s.width)
        {
            w=s.width;
            islanscapse=false;
        }
        else
        {
            w=s.height;
            islanscapse=true;
        }
        let iw = (w-20)/self.num;
        let offset=(w-20)/2;
        let bigoffset=self.num*(iw-self.deflen)/2;        
        for(let i=0;i<self.num*self.num;i++)
        {
            const sprite=self.cells[i] as Node;
            let s=sprite.getComponent(UITransform);
            sprite.active=true;
            //s!.contentSize=new Size(iw,iw);
            let scale=iw/self.pfSize.width;
            if(this.mode==1)
            {
                sprite.setScale(new Vec3(scale,scale,scale));
                bigoffset=0;
            }
            else
            {
                if(bigoffset>0)
                {
                    iw=self.deflen;
                    sprite.setScale(new Vec3(self.defscale,self.defscale,self.defscale));
                }
                else
                {
                    sprite.setScale(new Vec3(scale,scale,scale));
                    bigoffset=0;
                }
            }
            sprite.setParent(self.node);            
            let x=i%self.num;
            let y=Math.trunc(i/self.num);
            if(islanscapse)
            {
                sprite.setPosition(new Vec3(bigoffset+(x+0.5)*iw-offset+15,bigoffset+(y+0.5)*iw-offset,0));
            }
            else
            {
                sprite.setPosition(new Vec3(bigoffset+(x+0.5)*iw-offset,bigoffset+(y+0.5)*iw-offset+15,0));
            }
            //let rich=find('RichText',this.node);//scene 中的
            //let rich=sprite.getChildByName('RichText');
            //let rt=sprite.getComponentInChildren(RichText);
            //rt!.string=i.toString();
            let rtc=sprite.getComponentInChildren(RichTextComponent);
            rtc!.string=(i%self.num+1).toString();
        }        
    }
    doFunsLayout()
    {
        const self=this;
        let cntsize=this.getComponent(UITransform);
        let s=cntsize!.contentSize;        
        let w=s.height;
        let islanscapse=false;
        if(s.height>s.width)
        {
            w=s.width;
            islanscapse=false;
        }
        else
        {
            w=s.height;
            islanscapse=true;
        }           
        let cmdnum=self.num;
        if(self.num<self.funmax)
            cmdnum=self.funmax;        
        let ciw = (w-20)/cmdnum;  
        let offset=(w-20)/2;
        let iw = (w-20)/self.num; 
        let bigoffset=self.num*(iw-self.deflen)/2;
        let cbigoffset=self.num*(ciw-self.deflen)/2;     
        for(let i=0;i<cmdnum;i++)
        {
            const sprite=self.funcs[i] as Node;
            let s=sprite.getComponent(UITransform);
            sprite.active=true;
            //s!.contentSize=new Size(ciw,ciw);
            let scale=ciw/self.pfSize.width;
            if(this.funmode==1)
            {
                sprite.setScale(new Vec3(scale,scale,scale));
                cbigoffset=0;
            }
            else
            {
                if(bigoffset>0)
                {
                    ciw=self.deflen;
                    sprite.setScale(new Vec3(self.defscale,self.defscale,self.defscale));
                }
                else
                {
                    sprite.setScale(new Vec3(scale,scale,scale));
                    bigoffset=0;
                }
            }
            sprite.setParent(self.node);
            if(islanscapse)
            {
                sprite.setPosition(new Vec3(cbigoffset-offset-ciw/2+5,(i+0.5)*ciw-offset,cbigoffset));
            }
            else
            {
                sprite.setPosition(new Vec3(cbigoffset+(i+0.5)*ciw-offset,-offset-ciw/2+5,cbigoffset));
            }
            let rtc=sprite.getComponentInChildren(RichTextComponent);
            rtc!.string="A"+(i+1).toString();
            if(i==0)
            {
                rtc!.string="Mod";
                rtc!.fontSize=25;
                rtc!.lineHeight=25;
            }
        }
        for(let i=0;i<cmdnum;i++)
        {
            let idx=self.funcs.length-i-1;
            const sprite=self.funcs[idx] as Node;
            sprite.active=true;
            let s=sprite.getComponent(UITransform);
            //s!.contentSize=new Size(ciw,ciw);
            let scale=ciw/self.pfSize.width;            
            if(this.funmode==1)
            {
                sprite.setScale(new Vec3(scale,scale,scale));                
                cbigoffset=0;
            }
            else
            {
                if(bigoffset>0)
                {
                    ciw=self.deflen;
                    sprite.setScale(new Vec3(self.defscale,self.defscale,self.defscale));
                }
                else
                {
                    sprite.setScale(new Vec3(scale,scale,scale));
                    bigoffset=0;
                }
            }
            sprite.setParent(self.node);
            if(islanscapse)
            {
                sprite.setPosition(new Vec3(cbigoffset+offset+ciw/2+25,(i+0.5)*ciw-offset,cbigoffset));
            }
            else
            {
                sprite.setPosition(new Vec3(cbigoffset+(i+0.5)*ciw-offset,offset+ciw/2+25,cbigoffset));
            }
            let rtc=sprite.getComponentInChildren(RichTextComponent);
            rtc!.string="B"+(idx%9+1).toString();
        }        
    }
    doBuddiesLayout()
    {
        const self=this;
        let cntsize=this.getComponent(UITransform);
        let s=cntsize!.contentSize;        
        let w=s.height;
        let islanscapse=false;
        if(s.height>s.width)
        {
            w=s.width;
            islanscapse=false;
        }
        else
        {
            w=s.height;
            islanscapse=true;
        }             
        let cmdnum=self.num;
        if(self.num<self.funmax)
            cmdnum=self.funmax;        
        let ciw = (w-20)/cmdnum;  
        let offset=(w-20)/2;
        let iw = (w-20)/self.num; 
        let bigoffset=self.num*(iw-self.deflen)/2;
        let cbigoffset=self.num*(ciw-self.deflen)/2;              
        for(let i=0;i<cmdnum*3;i++)//todo:layout buddies
        {
            
        }
    }
    // onresize()
    // {
    //     console.log("onresize3");
    // }
    // orientationchange()
    // {
    //     console.log("orientationchange");
    // }
    // update (deltaTime: number) {
    //     // [4]
    // }
}

//hue:https://stackoverflow.com/questions/30518664/ocanvas-sprite-hue-change
//类似公告板：https://www.cnblogs.com/ccentry/p/10322832.html

/*
https://stackoverflow.com/questions/9751207/how-can-i-use-goto-in-javascript
This JavaScript preprocessing tool allows you to create a label and then goto it using this syntax:

[lbl] <label-name>
goto <label-name>
For example, the example in the question can be written as follows:

[lbl] start:
alert("LATHER");
alert("RINSE");
[lbl] repeat: goto start;
*/

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */
