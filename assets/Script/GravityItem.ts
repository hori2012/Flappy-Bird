import { _decorator, AudioSource, Collider2D, Component, Contact2DType, Node } from 'cc';
import BirdControl from './BirdControl';
import { MainControl } from './MainControl';
const { ccclass, property } = _decorator;

@ccclass('GravityItem')
export class GravityItem extends Component {
    @property(AudioSource)
    audioPick: AudioSource = null!;
    mainControl: MainControl = null;
    birtControl: BirdControl = null;

    start() {
        let collider = this.node.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        }
        this.mainControl = this.node.parent.getComponent(MainControl);
        this.birtControl = this.node.parent.getChildByName("Bird").getComponent(BirdControl);
    }
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        this.scheduleOnce(() => {
            this.audioPick.playOneShot(this.audioPick.clip, 1);
            this.mainControl.gravityItem.active = false;
            this.birtControl.isGravityReversed = true;
            this.scheduleOnce(() => {
                this.birtControl.isGravityReversed = false;
            }, 5);
            console.log("Trang thai grivity sau 5s:", this.birtControl.isGravityReversed);
        }, 0);
    }
}


