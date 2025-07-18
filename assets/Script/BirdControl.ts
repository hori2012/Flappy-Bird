import { _decorator, Component, Node, Sprite, EventTouch, Collider2D, IPhysics2DContact, Contact2DType, RigidBody2D, Vec2, Collider, log, AudioSource } from 'cc';
import { GameStatus, MainControl } from './MainControl';
const { ccclass, property } = _decorator;

@ccclass('BirdControl')
export default class BirdControl extends Component {

    public speed: number = 0;
    mainControl: MainControl = null;
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
            this.speed -= 0.05;
            this.node.setPosition(this.node.position.x, this.node.position.y + this.speed);
            this.playAudioScore();
        }
    }

    public nextPipeIndex: number = 0;
    lastPipeX: number = null;
    @property(AudioSource)
    audioDie: AudioSource = null!;
    @property(AudioSource)
    audioScore: AudioSource = null!;
    @property(AudioSource)
    audioFlap: AudioSource = null!;

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
                // console.log("Điểm số:", this.mainControl.gameScore);
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
        this.speed = 1.5;
        this.playAudioFlap();
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact) {
        this.speed = 0;
        this.mainControl.GameOver();
        this.playAudioDie();
    }


}
