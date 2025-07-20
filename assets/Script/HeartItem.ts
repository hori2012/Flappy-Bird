import { _decorator, AudioSource, Collider2D, Component, Contact2DType, Node } from 'cc';
import { MainControl } from './MainControl';
import BirdControl from './BirdControl';
const { ccclass, property } = _decorator;

@ccclass('HeartItem')
export class HeartItem extends Component {

    @property(AudioSource)
    audioPick: AudioSource = null!;
    mainControl: MainControl = null;
    birdControl: BirdControl = null;

    start() {
        let collider = this.node.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        }
        this.mainControl = this.node.parent.getComponent(MainControl);
        this.birdControl = this.node.parent.getChildByName("Bird").getComponent(BirdControl);
    }
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        this.scheduleOnce(() => {
            this.audioPick.playOneShot(this.audioPick.clip, 1);
            this.mainControl.heartItem.active = false;
            if (this.birdControl.heart < 3) {
                this.birdControl.heart += 1;
                this.mainControl.heartUI.children[this.birdControl.heart - 1].active = true;
            }
            console.log("So mang sau khi lay : ", this.birdControl.heart);
        }, 0);
    }
}


