import { _decorator, Component, Node, Sprite, EventTouch, Collider2D, IPhysics2DContact, Contact2DType, RigidBody2D, Vec2, Collider, log, AudioSource } from 'cc';
import { GameStatus, MainControl } from './MainControl';
const { ccclass, property } = _decorator;

@ccclass('BirdControl')
export default class BirdControl extends Component {

    public speed: number = 0;
    public jumforce: number = 2;
    mainControl: MainControl = null;
    public heart: number = 3;
    public nextPipeIndex: number = 0;
    public isGravityReversed: boolean = false;
    lastPipeX: number = null;
    @property(AudioSource)
    audioDie: AudioSource = null!;
    @property(AudioSource)
    audioScore: AudioSource = null!;
    @property(AudioSource)
    audioFlap: AudioSource = null!;
    start() {
        this.node.parent.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        let collider = this.node.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
        this.mainControl = this.node.parent.getComponent(MainControl);
    }

    update(dt: number) {
        if (this.mainControl.gameStatus === GameStatus.Game_Playing) {
            if (this.isGravityReversed) {
                this.speed += 0.05;
            } else {
                this.speed -= 0.05;
            }
            this.node.setPosition(this.node.position.x, this.node.position.y + this.speed);
            this.playAudioScore();
        }
    }

    playAudioScore() {
        let birdX = this.node.position.x;
        let nextPipeTuple = this.mainControl.pipe[this.nextPipeIndex];
        if (nextPipeTuple) {
            let nextPipeNode = nextPipeTuple[0];
            let nexIsScore = nextPipeTuple[1];
            if (nextPipeNode && birdX > nextPipeNode.position.x && !nexIsScore) {
                this.mainControl.gameScore++;
                this.mainControl.labelScore.string = this.mainControl.gameScore.toString();
                this.audioScore.playOneShot(this.audioScore.clip, 1);
                this.mainControl.pipe[this.nextPipeIndex][1] = true;
                this.nextPipeIndex = (this.nextPipeIndex + 1) % this.mainControl.pipe.length;
            }
        }
    }

    playAudioDie() {
        this.audioDie.playOneShot(this.audioDie.clip, 1);
    }
    playAudioFlap() {
        this.audioFlap.playOneShot(this.audioFlap.clip, 1);
    }

    onTouchStart(event: EventTouch) {
        this.speed = this.isGravityReversed ? -this.jumforce : this.jumforce;
        this.playAudioFlap();
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact) {
        if (otherCollider.tag === 0 || otherCollider.tag === 2) {
            this.heart--;
            console.log("So mang con lai : ", this.heart);
            this.mainControl.GameOver();
            this.playAudioDie();
        }
    }
}
