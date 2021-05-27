
import { _decorator, Component, Node, find, Graphics, Vec2,Intersection2D, Vec3, Color} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Hrdaya')
export class Hrdaya extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    arr:number[][]=[];
    idx:number=0;
    xscale:number=3;
    yscale:number=17*1.1;
    
    public pts:Vec2[]=[];
    public minx:number=1;
    public miny:number=1;
    public maxx:number=1;
    public maxy:number=1;

    @property
    public graphic:Graphics=null!;
    @property
    public width:number=2;
    @property
    public height:number=2;

    onLoad()
    {      

        let self=this;        
        let n=self.node;
        //n!.position=new Vec3(0,0);
        //let n=find('Canvas/Graphics');        
        let g=n!.getComponent(Graphics);
        self.graphic=g!;  
    }
    start () {        
        this.Draw();
    }
    Draw()
    {
        let self=this;
        let g=self.graphic;
        if(g)
        {            
            //g!.lineWidth=3;
            //g!.fillColor.fromHEX('#ff0000');
            //g!.strokeColor.fromHEX('#ffff00');
            //g!.strokeColor.fromHSV(0,0,1);
            //g!.strokeColor=Color.YELLOW;                        
            self.arr=self.Hrdaya(20,20,20);
            self.idx=0;
            g!.clear();
            g!.moveTo(self.arr[0][0],self.arr[0][1]);
            self.minx=self.maxx=this.arr[0][0];
            self.miny=self.maxy=this.arr[0][1];
            self.pts=[];
            for(let i=0;i<self.arr.length+1;i++)
            {                
                self.idx=self.Line(g!,self.idx);
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
                // if(i<self.arr.length)
                // {
                //     console.log(i+":"+self.arr[i]);
                // }
            }
            self.width=(self.maxx-self.minx)*1.07;
            self.height=(self.maxy-self.miny)*0.97;
        }
        else
        {
            console.log('lineWidth');
        }
    }
    reDraw()
    {        
        let self=this;
        if(self.arr.length<1) return;
        let g=self.graphic;
        self.idx=0;
        g!.clear();
        g!.moveTo(self.arr[0][0],self.arr[0][1]);
        for(let i=0;i<self.arr.length+1;i++)
        {                
            self.idx=self.Line(g!,self.idx);
        }
    }
    inHrdaya(pt:Vec2,scale:number)
    {        
        //TODO:横竖屏切换时的判断
        let n=this.node;
        this.pts=[];
        for(let i=0;i<this.arr.length;i++)
        {                            
            this.pts.push(new Vec2(this.arr[i][0]*scale+n.position.x,this.arr[i][1]*scale+n.position.y));
        }
        let isin=Intersection2D.pointInPolygon(pt,this.pts);
        return isin;
    }
    Line(g:Graphics,idx:number)
    {        
        if(idx<this.arr.length)
        {            
            //g!.moveTo(this.arr[idx-1>=0?idx-1:0][0], this.arr[idx-1>=0?idx-1:0][1]);
            g!.lineTo(this.arr[idx][0], this.arr[idx][1]);            
            g!.stroke();            
            idx+=1;
        }
        else if(idx<=(this.arr.length+5))
        {        
            if(idx==this.arr.length)
            {
                //g!.moveTo(this.arr[idx-1>=0?idx-1:0][0], this.arr[idx-1>=0?idx-1:0][1]);
                g!.lineTo(this.arr[0][0], this.arr[0][1]);
                //g!.moveTo(this.arr[0][0], this.arr[0][1]);
                g!.close();
                g!.stroke();
                g!.fill();
                console.log('fill');
            }
            idx+=1;
        }
        else if(idx>(this.arr.length+5))
        {        
            //g!.clear();
            //g!.moveTo(this.arr[0][0], this.arr[0][1]);
            idx=0;
        }
        return idx;
        //g!.fill();
    }
    Hrdaya(len:number,pos:number,count:number):number[][]
    {
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
            let p=(this.node as Node).position;
            arr.push([xp*1.18*this.xscale,(yp+offsety)*0.18*this.yscale]);
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
