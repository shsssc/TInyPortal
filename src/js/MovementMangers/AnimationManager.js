export class AnimationManager {

    constructor() {
        this.update = this.update.bind(this);
        this.init = this.init.bind(this);
    }

    /**
     *
     * @param scene{RenderScene}
     */
    // eslint-disable-next-line no-unused-vars
    init(scene) {

    }

    /**
     *
     * @param scene{RenderScene}
     * @param time {number}
     * @return {boolean} true if we want to stop the animation.
     */
    // eslint-disable-next-line no-unused-vars
    update(scene, time) {
        return false;
    }
}
