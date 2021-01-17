//this implementation is required for our project to move the perscpective of the
//user based on their movements and inputs from their input devices, such as 
//the keyboard and mouse

export class UserInput {
    /**
     *
     * @param element{HTMLElement}
     */
    constructor(element) {
        this.keymap = {};
        this.mouseX = 0;
        this.mouseY = 0;
        this.keydown = this.keydown.bind(this);
        this.keyup = this.keyup.bind(this);
        this.mousemove = this.mousemove.bind(this);
        this.readMouseMove = this.readMouseMove.bind(this);
        document.body.addEventListener("keyup", this.keyup, false);
        document.body.addEventListener("keydown", this.keydown, false);
        element.addEventListener("mousemove", this.mousemove, false);
        element.addEventListener("click", (e) => {
            element.requestPointerLock();
            element.focus();
            e.preventDefault();
        }, false);
    }

    keydown(e) {
        this.keymap[e.key] = true;
    }

    keyup(e) {
        this.keymap[e.key] = false;
    }

    mousemove(e) {
        this.mouseX += e.movementX;
        this.mouseY += e.movementY;
    }

    /**
     * return keymap.
     * @returns {{}}
     */
    readKeymap(){
        return this.keymap;
    }

    /**
     * return mouse relative movement.
     * @returns {[number, number]}
     */
    readMouseMove() {
        const result = [this.mouseX, this.mouseY];
        this.mouseX = 0;
        this.mouseY = 0;
        return result;
    }
}
