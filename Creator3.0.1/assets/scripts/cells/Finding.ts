
import { _decorator, Component, Node,UITransform,Vec3,RichTextComponent,Size,resources,Prefab,instantiate,SystemEventType, Vec2
    ,Color, randomRangeInt, Label} from 'cc';
import { Cell } from './Cell';
import { Cmd } from './Cmd';
import { Hrdaya } from './Hrdaya';
const { ccclass, property } = _decorator;

@ccclass('Finding')
export class Finding extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    @property
    public mode=1;
    public modenum=3;

    @property
    public num=3;
    @property
    public nummax=9;
    @property
    public nummin=3;

    public funmode=1;
    public funmax=9;
    @property 
    public usefun=2;
        
    public deflen=60;
    public defscale=1.0;

    scale=1.0;
    interval=0;    
    diffidx:Number=0;
    useidxs:Array<Number>=[];
    unuseidxs:Array<Number>=[];
    oldnum=0;
    

    public level=1;
    public error=0;

    public funSize=new Size(1,1);
    public cellSize=new Size(1,1);

    public cells=[];
    public funcs=[];

    @property
    public isFuns=false;

    start () {
        // [3]
        //this.initFinding();

        // resources.load("cell/Hrdaya",Prefab,(err:any,perfab:Prefab)=>{//load cell/func prefab
        //     const hrdaya=instantiate(perfab) as Node;
        //     hrdaya.setParent(this.node);
        // });
        this.cells=[];
        this.initFinding();
    }
    randomColor()
    {
        let r=randomRangeInt(0,255);
        let g=randomRangeInt(0,255);
        let b=randomRangeInt(0,255);
        let a=randomRangeInt(0,255);
        return new Color(r,g,b,a);
    }
    clearCells()
    {
        const self=this;
        // let nmax=self.num;
        // let perres="Hrdaya";
        // for(let i=0;i<nmax*nmax;i++)
        // {
        //     if(i<self.cells.length)
        //     {
        //         (self.cells[i] as Node).active=false;
        //         resources.release("cell/"+perres,self.cells[i]);
        //     }
        // }
    }
    reDraw(color:Color)
    {
        const self=this; 
        let nmax=self.num;
        for(let i=0;i<nmax*nmax;i++)
        {
            if(i>=self.cells.length) break;
            let hd=(self.cells[i] as Node).getComponent(Hrdaya);
            let g=hd?.graphic;
            let hsv=color.toHSV();
            if(self.diffidx==i)
            {                    
                hsv.h=((hsv.h*360+7)%360)/360;
                //hsv.s=((hsv.s*100+3)%100)/100;
                //hsv.v=((hsv.v*100+3)%100)/100;
                console.log('difference:'+i+":"+hsv.h);
            }
            g!.fillColor.fromHSV(hsv.h,hsv.s,hsv.v);
            g!.strokeColor.fromHEX('#00ff00');
            hd?.reDraw();
        }
    }
    randomCellIdx()
    {
        this.unuseidxs=[];
        for(let i=0;i<this.num*this.num;i++)
        {
            let isUse:Boolean=false;
            for(let j=0;j<this.useidxs.length;j++)
            {
                if(i==this.useidxs[j])
                {
                    isUse=true;
                    break;
                }
            }
            if(!isUse)
            {
                this.unuseidxs.push(i);
            }
        }
        if(this.unuseidxs.length>1)
        {
            this.diffidx=this.unuseidxs[Math.trunc(Math.random()*this.unuseidxs.length)];
            return this.diffidx;
        }
        else
        {
            return -1;
        }
    }
    refreshCounts()
    {
        let lbl=(this.funcs[0] as Node).getComponentInChildren(Label);
        lbl!.string=this.error.toString();
        let lbl1=(this.funcs[1] as Node).getComponentInChildren(Label);
        lbl1!.string=this.level.toString();
    }
    refreshCells()
    {        
        const self=this;
        self.clearCells();        
        //self.num=randomRangeInt(self.nummin,self.nummax);
        let diff=self.num*self.num-self.oldnum*self.oldnum;
        let offset=self.oldnum*self.oldnum;
        self.oldnum=self.num;
        let perres="Hrdaya";
        let nmax=self.num;        
        let color=self.randomColor();
        if(diff>0)
        {                
            resources.load("cell/"+perres,Prefab,(err:any,perfab:Prefab)=>{//load cell/func prefab
                if(err)
                {
                    console.warn(err);
                }                
                for(let i=offset;i<offset+diff;i++)
                {
                    const hdaya=instantiate(perfab) as Node;
                    self.cells.push(hdaya);
                    let c=hdaya.addComponent(Cell);
                    hdaya.setParent(self.node)                    
                    //hdaya.active=false;
                    hdaya.setPosition(new Vec3(5000,0,0));
                    c!.rowi=Math.trunc(i/nmax);
                    c!.coli=i%nmax;
                    c!.idx=i;
                    // hdaya.on(SystemEventType.TOUCH_START,(event)=>{
                    //     if(event.target.name==perres)
                    //         self.touchSprite(hdaya,0);
                    //     let c=hdaya.getComponent(Cell);
                    //     let rtc=hdaya.getComponentInChildren(RichTextComponent);
                    //     console.log(c!.idx+":"+rtc?.string);
                    // },self);
                }
                self.reDraw(color);
                self.doCellsLayout();
            });
        }
        else if(diff<0)
        {
            let len=self.cells.length;
            for(let i=0;i<-diff;i++)
            {
                if(i>=self.cells.length||len-i-1<0) break;
                (self.cells[len-i-1] as Node).active=false;
            }
            self.reDraw(color);
            self.doCellsLayout();
        }
        else
        {
            self.reDraw(color);
            self.doCellsLayout();
        }        
    }    
    initFinding()
    {        
        const self=this;        
        
        let cntsize=self.node.getComponent(UITransform);
        let s=cntsize!.contentSize;
        let cmdnum=self.num;
        if(self.num<self.funmax)      
            cmdnum=self.funmax;
        self.refreshCells();        
        self.diffidx=self.randomCellIdx();
        self.useidxs=[self.diffidx];

        self.node.on(Node.EventType.TOUCH_START, function (touch) {            
            var touchLoc = touch.getLocation();                
            for(let i=0;i<self.num*self.num;i++)
            {
                if(i>=self.cells.length) break;
                let hn=self.cells[i] as Node;
                let hd=hn.getComponent(Hrdaya);
                let tc=new Vec2(touchLoc.x-s.width/2,touchLoc.y-s.height/2);
                console.log(touchLoc+":"+s+":"+tc);
                if(hd!.inHrdaya(tc,self.scale))
                {
                    let c=hn.getComponent(Cell);
                    let rtc=hn.getComponentInChildren(RichTextComponent);
                    console.log("hitted:"+c!.idx);
                    if(c!.idx==self.diffidx)
                    {
                        self.diffidx=self.randomCellIdx();
                        if(self.diffidx==-1)
                        {
                            self.num=self.num+1;
                            self.diffidx=self.randomCellIdx();
                            self.useidxs=[self.diffidx];
                        }
                        else
                        {
                            self.useidxs.push(self.diffidx);
                        }
                        self.level++;
                        self.refreshCells();
                    }
                    else
                    {
                        self.error++;
                        console.log(self.error);
                    }
                    self.refreshCounts();
                }
            }
        });

        if(self.isFuns)
        {
            let perres="Sprite3";
            resources.load("cell/"+perres,Prefab,(err:any,perfab:Prefab)=>{//load cell/func prefab
                if(err)
                {
                    console.warn(err);
                }
                //国家，线索，笔记/推理，模式，出题，误解，对战,0~N
                for(let i=0;i<self.funmax*2;i++)
                {
                    const hdaya=instantiate(perfab) as Node;//PoolMgr.newNode(perfab,self.node);
                    self.funcs.push(hdaya);
                    let c=hdaya.addComponent(Cmd);                
                    hdaya.setParent(self.node);
                    hdaya!.active=false;
                    hdaya.on(SystemEventType.TOUCH_START,(event)=>{
                        if(event.target.name==perres)
                            self.touchSprite(hdaya,0);
                        let c=hdaya.getComponent(Cmd);
                        let rtc=hdaya.getComponentInChildren(RichTextComponent);
                        console.log(c!.cmds+":"+rtc?.string+":"+event.target.name);
                    },self);                
                }
                let node=self.funcs[0] as Node;
                let trans=(node).getComponent(UITransform)!;
                self.funSize=trans!.contentSize;
                //self.defscale=trans!.node.scale.x;
                //console.log(self.defscale);
                //self.deflen=self.pfSize.width;
                self.doFunsLayout();
                self.refreshCounts();
            });
        }
        
        //self.node.on(SystemEventType.SIZE_CHANGED,(event)=>{
        self.node.on(Node.EventType.SIZE_CHANGED,(event)=>{
            console.log("SIZE_CHANGED");
            self.doCellsLayout();
            if(self.isFuns)
                self.doFunsLayout();            
        },self);

        this.node.on("orientationchange",(event)=>{
            console.log('orientationchange1');
        },this)       

        self.interval=setInterval(()=>{
            clearInterval(self.interval);
            let hd=(self.cells[0] as Node).getComponent(Hrdaya);
            self.cellSize=new Size(hd!.width,hd!.height);
            self.doCellsLayout();
        },120);
    }
    touchSprite(sprite:Node,implus:number=0)
    {
        let self=this;
        let rtc=sprite.getComponentInChildren(RichTextComponent);
        console.log(rtc!.string);
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
        self.scale=(w/self.num/self.cellSize.width);
        let offset=(w-20)/2;
        let bigoffset=self.num*(iw-self.deflen)/2;        
        for(let i=0;i<self.num*self.num;i++)
        {
            if(i>=self.cells.length) break;
            const hrdaya=self.cells[i] as Node;
            //let hd=hrdaya.getComponent(Hrdaya);
            //console.log(hd?.width+":"+hd?.height);
            hrdaya!.active=true;
            //s!.contentSize=new Size(iw,iw);
            let scale=iw/self.cellSize.width;            
            if(this.mode==1)
            {
                hrdaya.setScale(new Vec3(scale,scale,scale));
                bigoffset=0;
            }
            else
            {
                if(bigoffset>0)
                {
                    iw=self.deflen;
                    hrdaya.setScale(new Vec3(self.defscale,self.defscale,self.defscale));
                }
                else
                {
                    hrdaya.setScale(new Vec3(scale,scale,scale));
                    bigoffset=0;
                }
            }
            let x=i%self.num;
            let y=Math.trunc(i/self.num);
            if(islanscapse)
            {
                hrdaya.setPosition(new Vec3(bigoffset+(x+0.5)*iw-offset+15,bigoffset+(y+0.5)*iw-offset,0));
            }
            else
            {
                hrdaya.setPosition(new Vec3(bigoffset+(x+0.5)*iw-offset,bigoffset+(y+0.5)*iw-offset+15,0));
            }
            let rtc=hrdaya.getComponentInChildren(RichTextComponent);
            //rtc!.string=(i%self.num+1).toString();
            rtc!.string=(i+1).toString();
            //console.log(i);
            //hrdaya.getComponent(Hrdaya)?.reDraw();
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
        let funidx=0;  
        for(let i=0;i<cmdnum;i++)
        {
            const hrdaya=self.funcs[i] as Node;
            let s=hrdaya.getComponent(UITransform);  
            if(funidx<this.usefun)          
                hrdaya!.active=true;
            funidx=funidx+1;
            //s!.contentSize=new Size(ciw,ciw);
            let scale=ciw/self.funSize.width;
            if(this.funmode==1)
            {
                hrdaya.setScale(new Vec3(scale,scale,scale));
                cbigoffset=0;
            }
            else
            {
                if(bigoffset>0)
                {
                    ciw=self.deflen;
                    hrdaya.setScale(new Vec3(self.defscale,self.defscale,self.defscale));
                }
                else
                {
                    hrdaya.setScale(new Vec3(scale,scale,scale));
                    bigoffset=0;
                }
            }            
            if(islanscapse)
            {
                hrdaya.setPosition(new Vec3(cbigoffset-offset-ciw/2+5,(i+0.5)*ciw-offset,cbigoffset));
            }
            else
            {
                hrdaya.setPosition(new Vec3(cbigoffset+(i+0.5)*ciw-offset,-offset-ciw/2+5,cbigoffset));
            }
            let rtc=hrdaya.getComponentInChildren(RichTextComponent);
            rtc!.string="A"+(i+1).toString();            
            if(i==0)
            {
                rtc!.string="错误";
                rtc!.fontSize=25;
                rtc!.lineHeight=25;                
            }
            else if(i==1)
            {
                rtc!.string="关卡";
                rtc!.fontSize=25;
                rtc!.lineHeight=25;                
            }
        }
        for(let i=0;i<cmdnum;i++)
        {
            let idx=self.funcs.length-i-1;
            const hrdaya=self.funcs[idx] as Node;
            if(funidx<this.usefun)          
                hrdaya!.active=true;
            funidx=funidx+1;
            let s=hrdaya.getComponent(UITransform);
            //s!.contentSize=new Size(ciw,ciw);
            let scale=ciw/self.funSize.width;
            if(this.funmode==1)
            {
                hrdaya.setScale(new Vec3(scale,scale,scale));                
                cbigoffset=0;
            }
            else
            {
                if(bigoffset>0)
                {
                    ciw=self.deflen;
                    hrdaya.setScale(new Vec3(self.defscale,self.defscale,self.defscale));
                }
                else
                {
                    hrdaya.setScale(new Vec3(scale,scale,scale));
                    bigoffset=0;
                }
            }
            if(islanscapse)
            {
                hrdaya.setPosition(new Vec3(cbigoffset+offset+ciw/2+25,(i+0.5)*ciw-offset,cbigoffset));
            }
            else
            {
                hrdaya.setPosition(new Vec3(cbigoffset+(i+0.5)*ciw-offset,offset+ciw/2+25,cbigoffset));
            }
            let rtc=hrdaya.getComponentInChildren(RichTextComponent);
            rtc!.string="B"+(idx%9+1).toString();
        }        
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}

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
