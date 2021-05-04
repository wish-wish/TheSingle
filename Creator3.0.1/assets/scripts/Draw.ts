
import { _decorator, Component, Node,find,Graphics, bits, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Draw')
export class Draw extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    idx:number=0;
    idx1:number=0;
    idx2:number=0;
    idx3:number=0;    
    arr:number[][]=[];
    xscale:number=3;
    yscale:number=17*1.1;
    start () {
        // [3]
        let n=find('Canvas/Graphics');
        let g=n!.getComponent(Graphics);
        n!.position=new Vec3(100,100);
        // g!.moveTo(0, 0);
        // g!.lineTo(0, 100);
        // g!.lineTo(20, 0);
        // g!.lineTo(0, 200);
        // g!.close();

        //g!.lineWidth = 10;
        // //g!.fillColor.fromHSV(0,0,1);
        // g!.fillColor.fromHEX("#ff0000");
        // g?.circle(150,0,100);
        // g?.ellipse(-150,0,100,70);
        // g?.stroke();
        // g?.fill();

        // g!.lineWidth = 5;
        // g!.fillColor.fromHEX('#ff0000');
        
        // g!.arc(0, 0, 100, Math.PI/2, Math.PI, false);
        // g!.lineTo(0, 0);
        // g!.close();

        // g!.stroke();
        // g!.fill();

        // g!.fillColor.fromHEX('#00ff00');

        // g!.arc(-10, 10, 100, Math.PI/2, Math.PI, true);
        // g!.lineTo(-10, 10);
        // g!.close();        

        g!.lineWidth=3;
        g!.fillColor.fromHEX('#ff0000');
        g!.strokeColor.fromHEX('#ffff00');
        this.Diamond(g!);

        let n1=find('Canvas/Graphics3') as Node;
        let g1=n1!.getComponent(Graphics);
        n1.position=new Vec3(-50,-130,0);
        g1!.lineWidth=3;
        g1!.fillColor.fromHEX('#ff0000');
        g1!.strokeColor.fromHEX('#0000ff');
        
        let n2=find('Canvas/Graphics4') as Node;
        let g2=n2!.getComponent(Graphics);
        n2.position=new Vec3(-50,0,0);
        g2!.lineWidth=3;
        g2!.fillColor.fromHEX('#ff0000');
        g2!.strokeColor.fromHEX('#00ff00');

        let n3=find('Canvas/Graphics1') as Node;
        let g3=n3!.getComponent(Graphics);
        n3.position=new Vec3(-250,-130,0);
        g3!.lineWidth=3;
        g3!.fillColor.fromHEX('#ff0000');
        g3!.strokeColor.fromHEX('#0000ff');

        let n4=find('Canvas/Graphics2') as Node;
        let g4=n4!.getComponent(Graphics);
        n4.position=new Vec3(-250,0,0);
        g4!.lineWidth=3;
        g4!.fillColor.fromHEX('#00ff00');
        g4!.strokeColor.fromHEX('#ff0000');

        this.idx=0;
        this.idx1=0;
        this.idx2=0;
        this.idx3=0;
        this.arr=this.Hrdaya(20,20,20);

        g1!.moveTo(this.arr[0][0]*this.xscale, this.arr[0][1]*this.yscale);
        g2!.moveTo(this.arr[0][0]*this.xscale, this.arr[0][1]*this.yscale);
        g3!.moveTo(this.arr[0][0]*this.xscale, this.arr[0][1]*this.yscale);
        g4!.moveTo(this.arr[0][0]*this.xscale, this.arr[0][1]*this.yscale);

        setInterval(()=>{
            this.idx=this.Line(g1!,this.idx);
            this.idx1=this.Line(g2!,this.idx1);
            this.idx2=this.Line(g3!,this.idx2);
            this.idx3=this.Line(g4!,this.idx3);
        },100);
    }    
    Diamond(g:Graphics)
    {
        let start=0;        
        let toset=0;
        let radius=17;
        let sec=200;
        let arc=2*Math.PI/sec;
        let arr=[];
        for(let i=0;i<sec;i++)
        {
            toset+=i;
            let xp:number=radius*16*Math.pow(Math.sin(start+arc*toset),3);
            let yp:number=radius*(13*Math.cos(start+arc*toset)-5*Math.cos(start+2*arc*toset)-2*Math.cos(start+3*arc*toset)-Math.cos(start+4*arc*toset));    
            arr.push([xp,yp]);        
        }        
        g!.moveTo(arr[0][0], arr[0][1]);
        for(let i=0;i<arr.length-1;i++)
        {                        
            g!.lineTo(arr[i+1][0], arr[i+1][1]);
        }
        g!.close();
        g!.stroke();        
    }
    Line(g:Graphics,idx:number)
    {        
        if(idx<this.arr.length)
        {            
            //g!.moveTo(this.arr[this.idx-1>=0?this.idx-1:0][0]*this.xscale, this.arr[this.idx-1>=0?this.idx-1:0][1]*this.yscale);
            g!.lineTo(this.arr[idx][0]*this.xscale, this.arr[idx][1]*this.yscale);
            g!.stroke();
            idx+=1;
        }
        else if(idx<=(this.arr.length+5))
        {        
            //g!.lineTo(this.arr[0][0]*this.xscale, this.arr[0][1]*this.yscale)            
            g!.close();
            g!.stroke();
            g!.fill();
            idx+=1;
        }
        else if(idx>(this.arr.length+5))
        {        
            g!.clear();
            g!.moveTo(this.arr[0][0]*this.xscale, this.arr[0][1]*this.yscale);
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
            arr.push([xp*1.18,(yp+offsety)*0.18]);
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
