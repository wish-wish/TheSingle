
import { _decorator, Component, Node,find,Graphics } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Draw')
export class Draw extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    start () {
        // [3]
        let g=find('Canvas/Graphics')!.getComponent(Graphics);
        
        g!.moveTo(0, 0);
        g!.lineTo(0, 100);
        g!.lineTo(20, 0);
        g!.lineTo(0, 200);
        g!.close();

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

        g!.stroke();
        g!.fill();
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
