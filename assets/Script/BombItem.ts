import { _decorator, AudioSource, Collider2D, Component, Contact2DType, instantiate, Node } from 'cc';
import BirdControl from './BirdControl';
import { MainControl } from './MainControl';
const { ccclass, property } = _decorator;

@ccclass('BombItem')
export class BombItem extends Component {

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
            this.mainControl.bombItem.active = false;
            this.mainControl.destroyAllPipes();
            this.birdControl.nextPipeIndex = 0;
            this.mainControl.bombUI.active = true;
            this.mainControl.scheduleOnce(() => {
                for (let i = 0; i < 3; i++) {
                    const pipeNode = instantiate(this.mainControl.pipePrefab);
                    this.mainControl.node.addChild(pipeNode);
                    const posNode = pipeNode.getPosition();
                    posNode.x = 170 + 200 * i;
                    var minY = -120;
                    var maxY = 120;
                    posNode.y = minY + Math.random() * (maxY - minY);
                    pipeNode.setPosition(posNode);
                    this.mainControl.pipe.push([pipeNode, false]);
                }
                this.mainControl.bombUI.active = false;
            }, 5);
        }, 0);
    }
}


