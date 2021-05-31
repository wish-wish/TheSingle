
import { _decorator, Component, Node, find, Graphics, Vec2,Intersection2D, Vec3, Color, Size, size,view,screen,director} from 'cc';
import { PointInRect } from './PointInRect';
const { ccclass, property } = _decorator;

@ccclass('Hrdaya')
export class Hrdaya extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    public arr:number[][]=[];
    public fansec:number=20;

    idx:number=0;
    idx_fan:number=0;
    xscale:number=3;
    yscale:number=17*1.1;
    interval:number=0;
    drawtimes:number=0;    
    iscb:boolean=false;
    drawbox:boolean=false;
    g:Graphics=null!;        
    
    public pts:Vec2[]=[];
    public minx:number=1;
    public miny:number=1;
    public maxx:number=1;
    public maxy:number=1;
    
    @property
    public mode:number=0;//0:hrdaya,1:rect,2:roundrect,3:....
    public csize:Size=new Size(100,100);

    @property
    public width:number=2;
    @property
    public height:number=2;
    @property
    public isAnimDraw:boolean=false;
    @property
    public maxtimes:number=1;
    @property
    public intval:number=30;

    onLoad()
    {
        let self=this;
        //let n=self.node;
        //n!.position=new Vec3(0,0);
        //let n=find('Canvas/Graphics');
        let g=self.node!.getComponent(Graphics);
        self.g=g!;                 
    }
    start () {    
        const self=this;
        if(self.mode==0)
        {
            self.Draw();
        }
        else if(self.mode==1)
        {
            self.RoundRect(()=>{});
        }
    }
    Circle(cb:Function)
    {
        let self=this;
        let g=self.g;        
        if(g)
        {
            g!.clear();
            g!.circle(0,0,60);
            g!.stroke();
            g!.fill();
            if(cb)
                cb("end");
        }
    }
    Ellipse(cb:Function)
    {
        let self=this;
        let g=self.g;
        if(g)
        {
            g!.clear();
            g!.ellipse(0,0,100,70);
            g!.stroke();
            g!.fill();
            if(cb)
                cb("end");
        }
    }
    Rect(cb:Function)
    {
        let self=this;
        let g=self.g;
        if(g)
        {
            g!.clear();
            g!.rect(-self.csize.width/2,-self.csize.height/2,self.csize.width,self.csize.height);
            g!.stroke();
            g!.fill();
            if(cb)
                cb("end");
        }
    }
    RoundRect(cb:Function)
    {
        let self=this;
        let g=self.g;
        if(g)
        {
            g!.clear();
            g!.roundRect(-self.csize.width/2,-self.csize.height/2,self.csize.width,self.csize.height,self.csize.width*0.1);
            g!.stroke();
            g!.fill();
            if(cb)
                cb("end");
        }
    }
    Draw()
    {
        let self=this;
        let g=self.g;        
        if(g)
        {            
            //g!.lineWidth=3;
            //g!.fillColor.fromHEX('#ff0000');
            //g!.strokeColor.fromHEX('#ffff00');
            //g!.strokeColor.fromHSV(0,0,1);
            //g!.strokeColor=Color.YELLOW;
            self.reCurve();
            self.idx=0;
            g!.clear();
            g!.moveTo(self.arr[0][0],self.arr[0][1]);
            for(let i=0;i<self.arr.length+1;i++)
            {                
                self.idx=self.Line(g!,self.idx);
            }
        }
    }
    reCurve()
    {
        let self=this;
        if(self.mode==0)
        {
            self.arr=self.Hrdaya(self.fansec,self.fansec,self.fansec);            
            //calc size
            self.minx=self.maxx=this.arr[0][0];
            self.miny=self.maxy=this.arr[0][1];
            self.pts=[];
            for(let i=0;i<self.arr.length+1;i++)
            {                
                if(i>=self.arr.length) continue;
                //self.pts.push(new Vec2(self.arr[i][0]+n.position.x,self.arr[i][1]+n.position.y));
                if(self.minx>self.arr[i][0])
                {
                    self.minx=self.arr[i][0];
                }
                if(self.maxx<self.arr[i][0])
                {
                    self.maxx=self.arr[i][0];
                }
                if(self.miny>self.arr[i][1])
                {
                    self.miny=self.arr[i][1];
                }
                if(self.maxy<self.arr[i][1])
                {
                    self.maxy=self.arr[i][1];
                }                
            }
            // self.width=(self.maxx-self.minx)*1.07;
            // self.height=(self.maxy-self.miny)*0.97;
            self.width=(self.maxx-self.minx);
            self.height=(self.maxy-self.miny);

            if(self.drawbox)
                self.drawOutline(1);
        }
        else if(self.mode==1)
        {
            //todo:get section fan;

            let g_fan=self.node.getComponentInChildren(Graphics);  
            g_fan?.clear();
        }
    }
    stopAnimDraw()
    {
        const self=this;
        //self.isAnimDraw=false;
        clearInterval(self.interval);
        self.interval=0;
    }
    drawFragile(cb:Function)
    {
        let self=this;
        if(self.arr.length<1) return;                

        let g=self.g;    
        let node=self.node.getChildByName("Node") as Node;        
        let g_fan=node?.getComponent(Graphics);
         
        g_fan!.strokeColor=g.strokeColor; 
        g_fan!.lineWidth=g.lineWidth;
        if(self.isAnimDraw)
        {
            self.iscb=false;
            self.idx=0;
            self.idx_fan=0;
            self.drawtimes=0;    
            if(cb)
            {                
                cb(self.idx,"clear");
            }
            clearInterval(self.interval);
            self.interval=setInterval(()=>{     
                if(self.idx_fan==0)
                {                    
                    //g!.clear();
                    g!.moveTo(self.arr[0][0],self.arr[0][1]);
                    g_fan?.clear();
                    g_fan?.moveTo(self.arr[0][0],self.arr[0][1]);
                }           
                self.idx=self.Line(g!,self.idx);
                self.idx_fan=self.LineFan(g_fan!,self.idx_fan);
                if(self.drawtimes>=self.maxtimes)
                {
                    clearInterval(self.interval);
                    self.interval=0;
                    self.isAnimDraw=false;
                    if(cb){
                        cb(self.drawtimes,"end");                                        
                        if(self.drawbox)
                            self.drawOutline(1);
                    }
                }
                if(self.drawtimes>=self.maxtimes-1)
                {
                    if(cb&&self.idx>(self.fansec/2)&&!self.iscb)
                    {                        
                        self.iscb=true;
                        cb(self.drawtimes,"anim");                        
                    }
                }
                if(cb)
                {
                    cb(self.idx,"idx");
                }
            },self.intval);
        }
        else
        {
            self.idx=0;
            g!.clear();
            g!.moveTo(self.arr[0][0],self.arr[0][1]);
            for(let i=0;i<self.arr.length+1;i++)
            {                
                self.idx=self.Line(g!,self.idx);
            }
            if(cb)
                cb(1,"end");
        }
    }
    reDraw(cb:Function)
    {        
        const self=this;
        if(self.mode==0)
        {
            self.drawFragile(cb);
        }
        else if(self.mode==1)
        {
            self.RoundRect(cb);
        }
    }
    hitHrdaya(pt:Vec2,scale:number)
    {
        //TODO:横竖屏切换时的判断
        const self=this;
        let n=self.node;
        self.pts=[];
        let offset:Vec2=new Vec2(n.position.x,n.position.y);
        //scale=1;
        for(let i=0;i<self.arr.length;i++)
        {                            
            self.pts.push(new Vec2(self.arr[i][0]*scale+offset.x,self.arr[i][1]*scale+offset.y));
        }

        let isin=Intersection2D.pointInPolygon(pt,self.pts);//TODO:have some bug
        return isin;
    }
    ptInRect(pt:Vec2,rect:Vec2[])
    {
        const self=this;
        if(pt.x>rect[0].x&&pt.x<rect[1].x&&pt.y>rect[0].y&&pt.y<rect[1].y)
        {
            return true;
        }
        return false;
    }
    hitRect(pt:Vec2)
    {
        const self=this;
        let n=self.node;
        let rect:Vec2[]=[];
        let offset:Vec2=new Vec2(n.position.x,n.position.y);
        //let offset:Vec2=new Vec2(0,0);
        //scale=1;
        let vs=view.getCanvasSize();
        rect.push(new Vec2(-self.width/2+offset.x+vs.width/2,-self.height/2+offset.y+vs.height/2));
        rect.push(new Vec2(self.width/2+offset.x+vs.width/2,self.height/2+offset.y+vs.height/2));                

        // let g_fan=self.node.getComponentInChildren(Graphics);
        // g_fan!.moveTo(rect[0].x,rect[0].y);
        // g_fan!.lineTo(rect[1].x,rect[1].y);
        // g_fan!.stroke();

        let isin=self.ptInRect(pt,rect);
        return isin;
    }
    inHrdaya1(pt:Vec2)
    {
        const self=this;
        if(self.mode==0)
        {
            let pta:number[]=[pt.x,pt.y];
            return self.hitRect2(pta);
        }
        else if(self.mode==1)
        {
            //TODO:
        }
    }
    hitRect1(pt:number[])
    {
        const self=this;
        let n=self.node;        
        let rect:number[][]=[];
        let offset:Vec2=new Vec2(n.position.x,n.position.y);
        let scale:Vec3=new Vec3(n.scale.x,n.scale.y,n.scale.z);

        let point:number[]=[];
        let cs=view.getCanvasSize();
        //let cs=screen.
        let ds=view.getDesignResolutionSize();
        point=[pt[0]/cs.width*ds.width,pt[1]/cs.height*ds.height];

        //console.log("hitRect1:"+pt+":"+point+":"+ds+":"+cs+":"+offset);        
        rect.push([self.minx*scale.x+offset.x+ds.width/2,self.miny*scale.y+offset.y+ds.height/2]);
        rect.push([self.maxx*scale.x+offset.x+ds.width/2,self.miny*scale.y+offset.y+ds.height/2]);
        rect.push([self.maxx*scale.x+offset.x+ds.width/2,self.maxy*scale.y+offset.y+ds.height/2]);
        rect.push([self.minx*scale.x+offset.x+ds.width/2,self.maxy*scale.y+offset.y+ds.height/2]);
        let isin=PointInRect.pointInPolygonNested(point,rect);        
        return isin;
    }
    hitRect2(pt:number[])
    {        
        const self=this;
        if(self.node.active=false)
        {
            return false;
        }
        let n=self.node;        
        let rect:number[][]=[];
        let offset:Vec2=new Vec2(n.position.x,n.position.y);
        let scale:Vec3=new Vec3(n.scale.x*1.13,n.scale.y*1.13,n.scale.z*1.13);

        let point:number[]=[];
        let cs=view.getCanvasSize();
        let ds=view.getDesignResolutionSize();
        let fs=view.getFrameSize();
        let x:number=pt[0]/cs.width*ds.width;
        let y:number=pt[1]/cs.height*ds.height;
        let fh=ds.width/fs.width*fs.height;
        let scaleh=fh/ds.height;
        let pt1=[x-ds.width/2,(y-ds.height/2)*scaleh];

        rect.push([self.minx*scale.x+offset.x,self.miny*scale.y+offset.y]);
        rect.push([self.maxx*scale.x+offset.x,self.miny*scale.y+offset.y]);
        rect.push([self.maxx*scale.x+offset.x,self.maxy*scale.y+offset.y]);
        rect.push([self.minx*scale.x+offset.x,self.maxy*scale.y+offset.y]);
        let isin=PointInRect.pointInPolygonNested(pt1,rect);
        
        return isin;
    }

    drawOutline(scale:number)
    {
        const self=this;
        let n=self.node;
        let rect:Vec2[]=[];
        //let offset:Vec2=new Vec2(n.position.x,n.position.y);
        let offset:Vec2=new Vec2(0,0);
        scale=1;
        rect.push(new Vec2(self.minx*scale+offset.x,self.miny*scale+offset.y));
        rect.push(new Vec2(self.maxx*scale+offset.x,self.miny*scale+offset.y));
        rect.push(new Vec2(self.maxx*scale+offset.x,self.maxy*scale+offset.y));
        rect.push(new Vec2(self.minx*scale+offset.x,self.maxy*scale+offset.y));

        let g_box=self.node.getChildByName("box")?.getComponent(Graphics);
        g_box?.clear();
        g_box!.lineWidth=2;
        g_box!.strokeColor=Color.BLACK;
        g_box!.moveTo(rect[0].x,rect[0].y);
        g_box!.lineTo(rect[1].x,rect[1].y);
        g_box!.lineTo(rect[2].x,rect[2].y);
        g_box!.lineTo(rect[3].x,rect[3].y);
        g_box!.lineTo(rect[0].x,rect[0].y);
        g_box!.stroke();
    }
    inHrdaya(pt:Vec2)
    {
        const self=this;
        if(self.mode==0)
        {
            return self.hitRect(pt);
        }
        else if(self.mode==1)
        {
            //TODO:
        }
    }
    Line(g:Graphics,idx:number)
    {        
        const self=this;
        if(idx<self.arr.length)
        {            
            //g!.moveTo(this.arr[idx-1>=0?idx-1:0][0], this.arr[idx-1>=0?idx-1:0][1]);            
            g!.lineTo(self.arr[idx][0], self.arr[idx][1]);
            g!.stroke();
            //g!.moveTo(this.arr[0][0], this.arr[0][1]);
            //g!.lineTo(this.arr[idx][0],this.arr[idx][1]);
            //g!.stroke();
            idx+=1;
        }
        else if(idx<=(self.arr.length+10))
        {        
            if(idx==self.arr.length)
            {                
                //g!.lineTo(this.arr[0][0], this.arr[0][1]);
                g!.close();
                g!.stroke();
                g!.fill();
                //g!.moveTo(this.arr[0][0], this.arr[0][1]);
            }
            idx+=1;
        }
        else if(idx>(self.arr.length+10))
        {                    
            self.drawtimes++;
            //g!.clear();
            g!.moveTo(self.arr[0][0], self.arr[0][1]);
            idx=0;
        }
        return idx;
        //g!.fill();
    }
    LineFan(g:Graphics,idx:number)
    {       
        const self=this; 
        if(idx<self.arr.length)
        {            
            g!.lineTo(self.arr[idx][0], self.arr[idx][1]);
            g!.stroke();
            g!.moveTo(self.arr[0][0], self.arr[0][1]);
            g!.lineTo(self.arr[idx][0],self.arr[idx][1]);
            g!.stroke();
            idx+=1;
        }
        else if(idx<=(self.arr.length+10))
        {        
            if(idx==self.arr.length)
            {                
                // //g!.lineTo(self.arr[0][0], self.arr[0][1]);
                // g!.close();
                // g!.stroke();
                // g!.fill();
                // //g!.moveTo(self.arr[0][0], self.arr[0][1]);
                g!.clear();
            }
            idx+=1;
        }
        else if(idx>(self.arr.length+10))
        {                    
            self.drawtimes++;
            //g!.clear();
            //g!.moveTo(self.arr[0][0], self.arr[0][1]);
            idx=0;
        }
        return idx;
        //g!.fill();
    }

    Hrdaya(len:number,pos:number,count:number):number[][]
    {
        const self=this;
        let num=Math.sqrt(len);
        let x=pos%num;
        let y=Math.trunc(pos/num);
        let arc=0;
        let big=16;
        if(count>=big)
        {
            arc=2*Math.PI/(count+4+count%2);            
        }
        else
        {
            arc=2*Math.PI/(count+4);
        }
        let radius=Math.min(count/Math.PI/4,1.4);
        let start=0;
        let toset=0;
        let half=Math.trunc(Math.ceil(count/2));
        let arr=[];
        for(let i=0;i<count;i++)
        {
            if(count%2==0)
            {
                if(i==1||i==half||i==(half+1)) toset+=1;
            }
            else
            {
                if(count>=big)
                {
                    if(i==0) { toset+=1; } else if(i==(half+1)) { toset+=1.5; }else if(i==(half+2)) { toset+=0.5; }
                }
                else
                {
                    if(i==0) { toset+=1; } else if(i==(half+1)) { toset+=2.0; } else if(i==(half+2)) { toset+=0.5; }
                }
            }
            let xp=radius*16*Math.pow(Math.sin(start+arc*toset),3);
            let yp=radius*(13*Math.cos(start+arc*toset)-5*Math.cos(start+2*arc*toset)-2*Math.cos(start+3*arc*toset)-Math.cos(start+4*arc*toset));
            let offsety=1.7;
            //let p=(self.node as Node).position;
            arr.push([xp*1.18*self.xscale,(yp+offsety)*0.18*self.yscale]);
            if(count%2==0)
            {
                toset+=1.0;
            }
            else
            {
                toset+=1.0;
            }
        }
        return arr;
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
