import { _decorator, AudioSource, Collider2D, Component, Contact2DType, instantiate, Node } from 'cc';
import BirdControl from './BirdControl';
import { MainControl } from './MainControl';
const { ccclass, property } = _decorator;

@ccclass('GhostItem')
export class GhostItem extends Component {

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
            this.mainControl.ghostItem.active = false;
            this.mainControl.ghostUI.active = true;
            for (let i = 0; i < this.mainControl.pipe.length; i++) {
                let pipeCollider = this.mainControl.pipe[i][0].getComponentsInChildren(Collider2D);
                for (let c of pipeCollider) {
                    c.enabled = false;
                }
            }
            this.scheduleOnce(() => {
                for (let i = 0; i < this.mainControl.pipe.length; i++) {
                    let pipeCollider = this.mainControl.pipe[i][0].getComponentsInChildren(Collider2D);
                    for (let c of pipeCollider) {
                        c.enabled = true;
                    }
                }
                this.mainControl.ghostUI.active = false;
            }, 5);
        }, 0);
    }
}


