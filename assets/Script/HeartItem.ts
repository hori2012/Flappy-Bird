import { _decorator, AudioSource, Collider2D, Component, Contact2DType, Node } from 'cc';
import { MainControl } from './MainControl';
import BirdControl from './BirdControl';
const { ccclass, property } = _decorator;

@ccclass('HeartItem')
export class HeartItem extends Component {

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
            this.mainControl.heartItem.active = false;
            if (this.birtControl.heart < 3) {
                this.birtControl.heart += 1;
                this.mainControl.heartUI.children[this.birtControl.heart - 1].active = true;
            }
            console.log("So mang sau khi lay : ", this.birtControl.heart);
        }, 0);
    }
}


