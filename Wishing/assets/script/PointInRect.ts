
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PointInRect')
export class PointInRect extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    start () {
        // [3]
    }

    //https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html
    
    //https://www.cnblogs.com/anningwang/p/7581545.html
    //https://cloud.tencent.com/developer/article/1644785
    
    static pointInPolygonFlat (point:number[], vs:number[], start?:number, end?:number) {
        var x = point[0], y = point[1];
        var inside = false;
        if (start === undefined) start = 0;
        if (end === undefined) end = vs.length;
        var len = (end-start)/2;
        for (var i = 0, j = len - 1; i < len; j = i++) {
            var xi = vs[start+i*2+0], yi = vs[start+i*2+1];
            var xj = vs[start+j*2+0], yj = vs[start+j*2+1];
            var intersect = ((yi > y) !== (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    };

    static pointInPolygonNested (point:number[], vs:number[][], start?:number, end?:number) {
        var x = point[0], y = point[1];
        var inside = false;
        if (start === undefined) start = 0;
        if (end === undefined) end = vs.length;
        var len = end - start;
        for (var i = 0, j = len - 1; i < len; j = i++) {
            var xi = vs[i+start][0], yi = vs[i+start][1];
            var xj = vs[j+start][0], yj = vs[j+start][1];
            var intersect = ((yi > y) !== (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    };

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
