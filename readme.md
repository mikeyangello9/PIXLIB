# pixel Lib
connvert images to pixels and enable physics to have mouse interactions, create multiple instances and position using traditional CSS.

## initialisation

instantaite the effect class:

new effect(canvas.width, canvas,height, Image)

## Methods
init() --> this method takes in the canvas context as an argument, loops through the width(rows) and the height(column) of the image, getting the color data(RGBA) and instantiates a particle class if the alpha value in the data is more than one.

drawEffect() --> this method takes all of the particle class instances in the particleArray property and draws using the draw() method from the Particle class, sets the fill style for each particle to the the RGBA values gotten from analysing the image data


update() --> this.dx = this.effect.mouse.x - this.x // the difference between the mousex pos and the particle x pos
            this.dy = this.effect.mouse.y - this.y // the difference between the mousey pos and the particle y pos

            this.distance = this.dx * this.dx + this.dy * this.dy // Pythagoras theoren to find the distance between the dx and dy, the distance sqr has been ommited for performance reasons.

