import { _decorator, AudioSource, Collider2D, Component, Contact2DType, Node } from 'cc';
import BirdControl from './BirdControl';
import { GameStatus, MainControl } from './MainControl';
const { ccclass, property } = _decorator;

@ccclass('GravityItem')
export class GravityItem extends Component {

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
        if (this.mainControl.gameStatus !== GameStatus.Game_Playing) return;
        this.scheduleOnce(() => {
            this.audioPick.playOneShot(this.audioPick.clip, 1);
            this.mainControl.gravityItem.active = false;
            this.birdControl.isGravityReversed = true;
            this.mainControl.gravityUI.active = true;
            this.mainControl.scheduleOnce(() => {
                this.birdControl.isGravityReversed = false;
                this.mainControl.gravityUI.active = false;
                console.log("Het trang thai gravity");
            }, 8);
        }, 0);
    }
}


