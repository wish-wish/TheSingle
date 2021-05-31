
import { _decorator, Component, Node,resources,Prefab,instantiate,UITransform,RichTextComponent,Color,Vec2,Vec3, tween, Graphics, view, Size, Tween, randomRangeInt, UIOpacityComponent, SpriteComponent, Sprite } from 'cc';
import { Cell } from './Cell';
import { Hrdaya } from './Hrdaya';
const { ccclass, property } = _decorator;

@ccclass('AHeart')
export class AHeart extends Component {

    public logo:Node=null!;
    public toucheart:boolean=false;
    public num:number=5;
    public funmax:number=10;
    public act:string="";
    public state:string="";
    public cells:Node[]=[];
    public funcs:Node[]=[];
    public oldnum:number=0;
    public color:Color=Color.RED;
    
    public cellsize:Size=new Size(1,1);
    public funsize:Size=new Size(1,1);

    public cellscale:Vec3=new Vec3(1,1,1);
    public funscale:Vec3=new Vec3(1,1,1);
    public funmode:number=1;
    public deflen:number=60;
    public defscale:number=1;
    public scale:number=1;
    public mode:number=1;

    public isAnim:boolean=false;
    @property({type:Node})
    public nodes:Node[]=[];
    @property({type:Node})
    public sprite:Node=null!;

    start () {
        const self=this;        
        resources.load("cell/Hrdaya",Prefab,(err:any,perfab:Prefab)=>{
            if(err)
            {
                console.warn(err);
            }
            let lg=instantiate(perfab) as Node;
            self.logo=lg;
            //let hd=lg.addComponent(Hrdaya);
            let trans=lg.getComponent(UITransform);
            lg.active=false;
            lg.setParent(self.node);
            trans!.priority=5;
            let rtc=lg.getComponentInChildren(RichTextComponent);
            rtc!.node.active=false;
            self.drawLoading();
            self.refreshCells();
        });

        self.node.on(Node.EventType.TOUCH_START, (touch:any)=>{            
            var touchLoc = touch.getLocation();                
            self.toucheart=false;
            for(let i=0;i<self.num*self.num;i++)
            {
                if(i>=self.cells.length) break;
                let hn=self.cells[i] as Node;
                if(!hn.active) continue;
                let hd=hn.getComponent(Hrdaya);
                let tc=new Vec2(touchLoc.x,touchLoc.y);
                if(hd!.inHrdaya1(tc))
                {
                    self.toucheart=true;
                    hd!.isAnimDraw=true;
                    hd!.reDraw((timer:number,act:string)=>{
                        let c=hn.getComponent(Cell);
                        // let rtc=hn!.getComponentInChildren(RichTextComponent);
                        // console.log("hitted:"+c!.idx+":"+rtc?.string);
                        self.doCellsLayout(false);
                        if(act=="end")
                        {
                            
                        }
                        if(act=="anim"&&self.state=="started")
                        {
                            //TODO:show the poem                            
                            tween(hn)
                                .parallel(
                                    tween(hn).by(0.6, {scale: new Vec3(0.3, 0.3, 0.3)}, {easing: 'quintInOut'})
                                        .to(0.05,{scale:new Vec3(1,1,1)},{easing: 'elasticOutIn'}),
                                    tween(hn).delay(0.2)
                                        .call(()=>{
                                            //
                                        }).delay(0.45)
                                )
                                .set({scale: self.cellscale})
                                .start()
                            
                        }
                        if(act=="clear")
                        {
                            
                        }
                    });
                }                
            }
            if(!self.toucheart)
            {                                
                self.drawBack(self.randomColor());
                self.doCellsLayout(false);
                self.drawImg(touchLoc.x,touchLoc.y);
            }
        },this);

        this.tweenDemo();
        this.jumpAction();

    }

    ActionTest()
    {
        
    }

    jumpAction()
    {        
        // this.squashAction = scaleTo(0.2, 1, 0.6);
        // this.stretchAction = scaleTo(0.2, 1, 1.2);
        // this.scaleBackAction = scaleTo(0.1, 1, 1);
        // this.moveUpAction = moveBy(1, Vec2(0, 200)).easing(easeCubicActionOut());
        // this.moveDownAction = moveBy(1, Vec2(0, -200)).easing(easeCubicActionIn());
        // var seq = cc.sequence(this.squashAction, this.stretchAction, 
        //     this.moveUpAction, this.scaleBackAction, this.moveDownAction, this.squashAction, this.scaleBackAction,
        //     cc.callFunc(this.callback.bind(this)));        
        let tw=tween(this.sprite)
            .to(0.2,{scale:new Vec3(1,0.6,0)})
            .to(0.2,{scale:new Vec3(1,1.2,0)})            
            .by(1,{position:new Vec3(0,800,0)},{easing:'cubicOut'})
            .to(0.1,{scale:new Vec3(1,1,0)})
            .by(1,{position:new Vec3(0,-800,0)},{easing:'cubicIn'})
            .to(0.2,{scale:new Vec3(1,0.6,0)})
            .to(0.1,{scale:new Vec3(1,1,0)})            
        tween(this.sprite)
            .delay(0.5)
            .repeat(130000,
                tw
            )
            .start();        
    }
    
    setOpacity(node:Node,opacity:number)
    {
        let op=node.getComponent(UIOpacityComponent);
        op!.opacity=opacity;
    }

    drawImg(x:number,y:number)
    {
        let cvs=document.createElement('canvas');
        let ctx=cvs.getContext('2d');
        cvs.width=1;
        cvs.height=1;

        //var imgObj = sprite.spriteFrame.getTexture().getHtmlElementObj();

        let sf=this.sprite.getComponent(SpriteComponent)?.spriteFrame;
        let sp=this.sprite.getComponent(Sprite);
        
        let data=sp?.requestRenderData();

        let img=document.getElementById("scream") as any;
        ctx?.drawImage(img,x,y,1,1,0,0,1,1);

        let imgdata=ctx?.getImageData(0,0,1,1);
        return imgdata?.data[3];
    }

    tweenDemo()
    {
        //TODO:add fadeIn/FadeOut
        let nodes = this.nodes;
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            let x=node.position.x;            
            let pl3=tween(node.getComponent(UIOpacityComponent))
                .to(1, { opacity: 255 })
            let pl1=tween(node)
                .call(()=>{
                    pl3.start();
                })
                .to(1, { scale: new Vec3(1,1,1) }, { easing: 'quintInOut' });
                
            let pl2=tween(node)
                .to(2.5, { position: new Vec3(x,0,0) }, { easing: 'backOut' });            

            let tw=tween(node)
                // first reset node properties
                //.hide()
                .set({ scale: new Vec3(10,10,10), position: new Vec3(0,0,0), angle: 0 })
                .call(()=>{
                    this.setOpacity(node,0)
                })
                // parallel exec tween
                .parallel(pl1
                    ,pl2                    
                )
                .delay(0.5)
                .to(0.8, { angle: 360 }, { easing: 'cubicInOut' })
                .delay(1)                
                .to(0.3, { scale:new Vec3(3,3,3) }, { easing: "quintIn" })
                .call(()=>{
                    tween(node.getComponent(UIOpacityComponent))
                        .to(0.3, { opacity: 0 }).start();
                })
                .delay(1);

            tween(node)
                // The defference delay should only eval once
                .delay(0.5 + i * 0.2)
                // repeat 1000 times
                .repeat(130000,
                    tw
                )
                .start()
        }
    }

    tweenDemoBK()
    {
        let nodes = this.nodes;
        for (let i = 0; i < nodes.length; i++) {
          let node = nodes[i];
          tween(node)
            // The defference delay should only eval once
            .delay(0.5 + i * 0.2)
            // repeat 1000 times
            .repeat(1000,
                tween()
                // first reset node properties
                .set({ opacity: 0, scale: 10, x: 0, rotation: 0 })
                // parallel exec tween
                .parallel(
                    tween().to(1, { opacity: 255, scale: 1 }, { easing: 'quintInOut' }),
                    tween().to(2.5, { x: node.position.x }, { easing: 'backOut' })
                )
                .delay(0.5)
                .to(0.8, { rotation: 360 }, { easing: 'cubicInOut' })
                .delay(1)
                .to(0.3, { opacity: 0, scale: 3 }, { easing: "quintIn" })
                .delay(1)
            )
            .start()
        }
    }

    randomColor() {
        let r=randomRangeInt(0,256);
        let g=randomRangeInt(0,256);
        let b=randomRangeInt(0,256);
        //let a=randomRangeInt(0,256);
        return new Color(r,g,b);
    }

    drawLoading(color?:Color)
    {
        const self=this;
        let lg=this.logo;    
        lg.active=true;    
        let hd=lg.getComponent(Hrdaya);
        hd!.isAnimDraw=true;
        hd!.maxtimes=130000;
        if(color)
            hd!.g.fillColor=color;        
        else
            hd!.g.fillColor=Color.RED;        
        hd!.g.strokeColor=Color.GREEN;
        hd!.Draw();
        hd!.reDraw((times:number,act:string)=>{
        });
    }

    forceDrawLoading()
    {
        if(!this.logo.active)
        {
            this.drawLoading();
        }
    }

    hideLoading()
    {
        const self=this;
        if(self.logo)
        {
            self.logo.active=false;
            let hd=self.logo.getComponent(Hrdaya);
            if(hd)
            {
                hd?.stopAnimDraw();
            }            
        }
    }

    drawBack(col:Color) {
        const self=this;
        let gr=self.node!.getChildByName("bg")?.getComponent(Graphics);
        gr!.clear();
        gr!.fillColor=col;
        let s=view.getVisibleSize();
        let factor=1.5;
        gr!.moveTo(-s.width/factor,-s.height/factor);
        gr!.lineTo(-s.width/factor,s.height/factor);
        gr!.lineTo(s.width/factor,s.height/factor);
        gr!.lineTo(s.width/factor,-s.height/factor); 
        gr!.stroke();
        gr!.close();
        gr!.fill();
    }

    reDraw(color:Color){

    }

    refreshCells()
    {        
        const self=this;                
        //self.num=randomRangeInt(self.nummin,self.nummax);
        let diff=self.num*self.num-self.oldnum*self.oldnum;
        let offset=self.oldnum*self.oldnum;
        self.oldnum=self.num;
        let perres="Hrdaya";
        let nmax=self.num;        
        self.color=Color.RED;//self.randomColor();        
        self.forceDrawLoading();
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
                    //let hd=hdaya.addComponent(Hrdaya);
                    let c=hdaya.addComponent(Cell);
                    hdaya.setParent(self.node)
                    //hdaya.active=false;
                    hdaya.setPosition(new Vec3(5000,0,0));
                    c!.rowi=Math.trunc(i/nmax);
                    c!.coli=i%nmax;
                    c!.idx=i;                    
                }
                self.reDraw(self.color);                
                
                let intv=setInterval(()=>{
                    clearInterval(intv);
                    let hd=(self.cells[0] as Node).getComponent(Hrdaya);
                    self.cellsize=new Size(hd!.width,hd!.height);
                    self.doCellsLayout();
                },500);                
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
            self.reDraw(self.color);
            
            let intv=setInterval(()=>{
                clearInterval(intv);
                let hd=(self.cells[0] as Node).getComponent(Hrdaya);
                self.cellsize=new Size(hd!.width,hd!.height);
                self.doCellsLayout();
            },500);
        }
        else
        {
            self.reDraw(self.color);
            self.doCellsLayout();
        }        
    }

    doCellsLayout(isAnim?:boolean)
    {
        const self=this;
        
        //console.log(Date.now()+":doCellsLayout start:Wishing:"+self.num);
        //self.hideLoading();
        if(isAnim==null)
        {
            isAnim=true;
        }

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

        let funw=(w-20)/self.funmax
        let iw = (w-20)/self.num;
        let iwy=0;
        let offsety=0;
        
        self.scale=(w/self.num/self.cellsize.width);
        let offset=(w-20)/2;
        if(self.funmode==2||self.funmode==3)
        {
            iwy = (w-20-funw)/self.num;
            offsety=(w-20-funw)/2;
        }
        let bigoffset=self.num*(iw-self.deflen)/2;

        for(let i=0;i<self.num*self.num;i++)
        {
            if(i>=self.cells.length) break;
            const hrdaya=self.cells[i];
            hrdaya!.active=true;
            let scale=iw/self.cellsize.width;
            let scaley=iwy/self.cellsize.width;
            let vscale=new Vec3(1,1,1);
            if(self.funmode==3)
            {
                vscale=new Vec3(scale,scaley,scale);
                 bigoffset=0;
            }
            else
            {
                if(this.mode==1)
                {
                    vscale=new Vec3(scale,scale,scale);
                    bigoffset=0;
                }
                else
                {
                    if(bigoffset>0)
                    {
                        iw=self.deflen;
                        vscale=new Vec3(self.defscale,self.defscale,self.defscale);
                    }
                    else
                    {
                        vscale=new Vec3(scale,scale,scale);
                        bigoffset=0;
                    }
                }
            }            
            hrdaya.setScale(vscale.multiplyScalar(0.9));   
            if(i==0)
            {
                self.cellscale=vscale;
            }         
            let x=i%self.num;
            let y=Math.trunc(i/self.num);
            let y1=self.num-y-1;
            let c=hrdaya.getComponent(Cell);            
            c!.idx=y1*self.num+x;
            c!.coli=x;
            c!.rowi=y1;
            c!.idx=i;

            let p=new Vec3(0,0,0);
            if(self.funmode==2)
            {
                p=new Vec3(bigoffset+(x)*iw-offset+3,bigoffset+(y+0.5)*iw-offset+4,0);
            }
            else if(self.funmode==3)
            {
                p=new Vec3(bigoffset+(x+0.5)*iw-offset,bigoffset+(y+0.5)*iwy-offsety+10,0);
            }
            else
            {
                if(islanscapse)
                {
                    p=new Vec3(bigoffset+(x+0.5)*iw-offset+15,bigoffset+(y+0.5)*iw-offset,0);
                }
                else
                {
                    p=new Vec3(bigoffset+(x+0.5)*iw-offset,bigoffset+(y+0.5)*iw-offset+15,0);
                }
            }
            
            if(isAnim)
            {
                Tween.stopAllByTarget(hrdaya);
                tween(hrdaya)
                    .show()
                    .set({position:new Vec3(0,0,0)})
                    .to(0.65,{position:p},{easing: 'elasticOut'})
                    .call(()=>{
                        if(i==self.num*self.num-1)
                        {
                            if(self.state!=="wishing")
                                self.state="started";
                            self.hideLoading();
                            //console.log(Date.now()+":doCellsLayout done:Wishing:"+self.num);
                        }
                    })
                    .start();
            }
            else
            {
                self.hideLoading();
                hrdaya.setPosition(p);
            }
            
            c!.pos=p;
            c!.scale=hrdaya.scale;
            let hrd=hrdaya.getComponent(Hrdaya);
            hrd!.drawbox=false;
            hrd!.node.scale=hrdaya.scale;
            hrd!.node.position=hrdaya.position;
            hrd?.reCurve();
            let rtc=hrdaya!.getComponentInChildren(RichTextComponent);
            rtc!.string="<color=#ffffff><outline color=#000000 width=2>"+(i+1).toString()+"</o></c>";            
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
