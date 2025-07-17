import {
    _decorator, Component, Node, Sprite, Prefab, instantiate, PhysicsSystem2D, EPhysics2DDrawFlags, Button, RigidBody2D,
    Label,
    Collider2D,
    Camera

} from 'cc';
import BirdControl from './BirdControl';
const { ccclass, property } = _decorator;

export enum GameStatus {
    Game_Ready = 0,
    Game_Playing,
    Game_Over
}
@ccclass('MainControl')
export class MainControl extends Component {
    @property([Sprite])
    spBg: Sprite[] = [null, null];
    @property(Prefab)
    pipePrefab: Prefab = null;
    pipe: [Node, boolean][] = [];
    @property(Button)
    btnStart: Button = null;
    @property(Button)
    btnReset: Button = null;
    @property(Button)
    btnContinue: Button = null;
    @property(Label)
    labelScore: Label = null;
    gameScore: number = 0;
    gameStatus: GameStatus = GameStatus.Game_Ready;
    @property(Label)
    labelHightScore: Label = null;
    @property(Sprite)
    darkmode: Sprite = null;
    doActionDarkMode: () => void;
    doActionLightMode: () => void;
    start() {
        for (let i = 0; i < 3; i++) {
            const pipeNode = instantiate(this.pipePrefab);
            this.node.addChild(pipeNode);
            const posNode = pipeNode.getPosition();
            posNode.x = 170 + 200 * i;
            var minY = -120;
            var maxY = 120;
            posNode.y = minY + Math.random() * (maxY - minY);
            pipeNode.setPosition(posNode);
            this.pipe.push([pipeNode, false]);
        }
    }

    update(deltaTime: number) {
        if (this.gameStatus !== GameStatus.Game_Playing) {
            return;
        }
        for (let i = 0; i < this.spBg.length; i++) {
            const node = this.spBg[i].node;
            const pos = node.getPosition();
            pos.x -= deltaTime * 100;
            if (pos.x <= -280) {
                pos.x = 280;
            }
            node.setPosition(pos);
        }
        // move pipes
        for (let i = 0; i < this.pipe.length; i++) {
            const pipeData = this.pipe[i];
            const posPipe = pipeData[0].getPosition();
            posPipe.x -= deltaTime * 100;
            if (posPipe.x <= -170) {
                posPipe.x = 430;
                var minY = -120;
                var maxY = 120;
                posPipe.y = minY + Math.random() * (maxY - minY);
            }
            pipeData[0].setPosition(posPipe);
            this.pipe[i] = [pipeData[0], false];
        }
        this.labelScore.node.setSiblingIndex(this.node.children.length - 1);
        this.labelHightScore.node.setSiblingIndex(this.node.children.length - 1);
        this.darkmode.node.setSiblingIndex(this.node.children.length - 1);
    }

    onLoad() {
        //turn physical
        PhysicsSystem2D.instance.enable = true;
        // PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb | EPhysics2DDrawFlags.Shape;

        let spGameOver = this.node.getChildByName("GameOver").getComponent(Sprite);
        spGameOver.node.active = false;

        this.btnStart = this.node.getChildByName("BtnStart").getComponent(Button);
        this.btnStart.node.on(Node.EventType.TOUCH_END, this.onTouchStartBtn, this);
        this.btnStart.node.active = true;
        this.btnReset = this.node.getChildByName("BtnReset").getComponent(Button);
        this.btnReset.node.on(Node.EventType.TOUCH_END, this.onTouchResetBtn, this);
        this.btnReset.node.active = false;
        this.btnContinue = this.node.getChildByName("BtnContinue").getComponent(Button);
        this.btnContinue.node.on(Node.EventType.TOUCH_END, this.onTouchContinueBtn, this);
        this.btnContinue.node.active = false;
        this.labelScore = this.node.getChildByName("LabelScore").getComponent(Label);
        this.labelHightScore = this.node.getChildByName("LabelHightScore").getComponent(Label);
        this.darkmode = this.node.getChildByName("DarkUI").getComponent(Sprite);
        this.darkmode.node.active = false;
        let isA = true;
        this.doActionDarkMode = () => {
            if (isA) {
                this.ModeDark();
            } else {
                this.UnMode();
            }
            isA = !isA;
        };
        // this.schedule(this.doActionDarkMode, 2);
        // localStorage.setItem("hightScore", "0");
        if (localStorage.getItem("hightScore") === null) {
            localStorage.setItem("hightScore", "0");
        }
        this.labelHightScore.string = "Hight score: " + localStorage.getItem("hightScore");
        let bird = this.node.getChildByName("Bird");
        const birdRigidBody = bird.getComponent(RigidBody2D);
        if (birdRigidBody) {
            birdRigidBody.enabled = false;
        }
        bird.active = false;
    }
    onTouchStartBtn() {
        this.btnStart.node.active = false;
        this.gameStatus = GameStatus.Game_Playing;
        let spGameOver = this.node.getChildByName("GameOver").getComponent(Sprite);
        spGameOver.node.active = false;
        for (let i = 0; i < this.pipe.length; i++) {
            const pipeData = this.pipe[i];
            const posPipe = pipeData[0].getPosition();
            posPipe.x = 170 + 200 * i;
            var minY = -120;
            var maxY = 120;
            posPipe.y = minY + Math.random() * (maxY - minY);
            pipeData[0].setPosition(posPipe);
            this.pipe[i] = [pipeData[0], false];
        }

        let bird = this.node.getChildByName("Bird");
        let posBrid = bird.getPosition();
        posBrid.y = 0;
        bird.setPosition(posBrid);
        bird.angle = 0;
        bird.active = true;
        const birdRigidBody = bird.getComponent(RigidBody2D);
        if (birdRigidBody) {
            birdRigidBody.enabled = true;
        }
        this.gameScore = 0;
        this.labelScore.string = this.gameScore.toString();
    }
    onTouchResetBtn() {
        this.btnStart.node.active = false;
        this.btnReset.node.active = false;
        this.btnContinue.node.active = false;
        this.gameStatus = GameStatus.Game_Playing;
        let spGameOver = this.node.getChildByName("GameOver").getComponent(Sprite);
        spGameOver.node.active = false;

        this.destroyAllPipes()
        for (let i = 0; i < 3; i++) {
            const pipeNode = instantiate(this.pipePrefab);
            this.node.addChild(pipeNode);
            const posNode = pipeNode.getPosition();
            posNode.x = 170 + 200 * i;
            var minY = -120;
            var maxY = 120;
            posNode.y = minY + Math.random() * (maxY - minY);
            pipeNode.setPosition(posNode);
            this.pipe.push([pipeNode, false]);
        }

        let bird = this.node.getChildByName("Bird");
        let posBrid = bird.getPosition();
        posBrid.y = 0;
        bird.setPosition(posBrid);
        bird.angle = 0;
        bird.active = true;
        const birdRigidBody = bird.getComponent(RigidBody2D);
        if (birdRigidBody) {
            birdRigidBody.enabled = true;
        }
        this.gameScore = 0;
        this.labelScore.string = this.gameScore.toString();
        if (localStorage.getItem("hightScore") as unknown as number < this.gameScore) {
            localStorage.setItem("hightScore", this.gameScore.toString());
        }
        bird.getComponent(BirdControl).nextPipeIndex = 0;
        if (localStorage.getItem("hightScore") as unknown as number < this.gameScore) {
            localStorage.setItem("hightScore", this.gameScore.toString());
        }
        this.labelHightScore.string = "Hight score: " + localStorage.getItem("hightScore");
        // this.schedule(this.doActionDarkMode, 2);
    }

    destroyAllPipes() {
        for (let i = 0; i < this.pipe.length; i++) {
            const pipeNode = this.pipe[i][0];
            if (pipeNode && pipeNode.isValid) {
                pipeNode.destroy();
            }
        }
        this.pipe.length = 0;
    }

    onTouchContinueBtn() {
        this.btnContinue.node.active = false;
        this.btnStart.node.active = false;
        this.btnReset.node.active = false;
        this.gameStatus = GameStatus.Game_Playing;
        let spGameOver = this.node.getChildByName("GameOver").getComponent(Sprite);
        spGameOver.node.active = false;

        let bird = this.node.getChildByName("Bird");
        let posBrid = bird.getPosition();
        let nearPipeWithBird: Node = null;
        let minDistanceX = Infinity;
        for (let i = 0; i < this.pipe.length; i++) {
            const currentPipe = this.pipe[i][0];
            if (currentPipe.position.x > posBrid.x) {
                const distanceX = currentPipe.position.x - posBrid.x;
                if (distanceX < minDistanceX) {
                    minDistanceX = distanceX;
                    nearPipeWithBird = currentPipe;
                }
            }
        }
        if (nearPipeWithBird) {
            posBrid.y = nearPipeWithBird.position.y;
        } else {
            posBrid.y = 0;
        }
        bird.setPosition(posBrid);
        bird.angle = 0;
        const birdRigidBody = bird.getComponent(RigidBody2D);
        if (birdRigidBody) {
            birdRigidBody.enabled = true;
        }
        bird.active = true;

        // Reset the isScore flag for all pipes when continuing
        for (let i = 0; i < this.pipe.length; i++) {
            const pipeData = this.pipe[i];
            this.pipe[i] = [pipeData[0], false];
        }
    }

    GameOver() {
        let spGameOver = this.node.getChildByName("GameOver").getComponent(Sprite);
        spGameOver.node.active = true;
        spGameOver.node.setSiblingIndex(this.node.children.length - 1);

        this.btnStart.node.active = false;
        this.btnReset.node.active = true;
        this.btnReset.node.setSiblingIndex(this.node.children.length - 1);
        this.btnContinue.node.active = true;
        this.btnContinue.node.setSiblingIndex(this.node.children.length - 1);
        this.gameStatus = GameStatus.Game_Over;

        this.scheduleOnce(() => {
            let bird = this.node.getChildByName("Bird");
            const birdRigidBody = bird.getComponent(RigidBody2D);
            if (birdRigidBody) {
                birdRigidBody.enabled = false;
            }
        }, 0);

        //update hight score in local
        if (localStorage.getItem("hightScore") as unknown as number < this.gameScore) {
            localStorage.setItem("hightScore", this.gameScore.toString());
        }
        console.log("hight score: ", localStorage.getItem("hightScore"));
        // this.unschedule(this.doAction);
    }
    ModeDark() {
        this.darkmode.node.active = true;
    }
    ModeWeather() {

    }
    UnMode() {
        this.darkmode.node.active = false;
    }
} 
