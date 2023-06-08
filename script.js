// create a canvas

    const createCanvas = (id, width, height) => {
        const canvas = document.createElement('canvas')
        canvas.id = id
        canvas.width = width
        canvas.height = height
        document.body.appendChild(canvas)
        return canvas.getContext('2d')
    }
    // add it to the canvas-container
    
    // canvas.width = window.innerWidth 
    // canvas.height = window.innerHeight 
  

    // make use of drawImage and getImageData methods to analyse images pixel by pixel
    // particle class 
    // console.log(ctx)
    class Particle{
        constructor(effect, x, y, color){
            this.effect = effect // reference to the entire effect class
            this.x = Math.random() * this.effect.width // xPos of particle
            this.y = Math.random() * this.effect.height // yPos of particle
            this.color = color
            this.text = ['#','*','!','0','a','c','[','@','//','8']
            this.OriginYPos = Math.floor(y) // remembers the oroginal position after being destroyed
            this.OriginXPos = Math.floor(x)
            this.size  = this.effect.gap // size of the particle
            this.velocityX =  0
            this.velocityY = 0
            this.ease = 0.05
            this.dx = 0
            this.dy = 0
            this.distance = 0
            this.force = 0
            this.angle = 0
            this.friction = 0.98
        }

        

        draw(context){
            context.fillStyle = this.color
            context.fillRect(this.x, this.y, this.size, this.size) // xpos, ypos, width, height
        }

        asciiText(context){ // custom method for generating ascii art..................
            const randomLetter = this.text[Math.floor(Math.random() * this.text.length)]
            context.font = '10px sans serif'
            context.fillStyle = this.color
            context.fillText(randomLetter, this.x, this.y)
        }

        update(){


            this.dx = this.effect.mouse.x - this.x // the difference between the mousex pos and the particle x pos
            this.dy = this.effect.mouse.y - this.y // the difference between the mousey pos and the particle y pos

            this.distance = this.dx * this.dx + this.dy * this.dy // Pythagoras theoren to find the distance between the dx and dy, the distance sqr has been ommited for performance reasons.

            this.force = -this.effect.mouse.radius / this.distance

            if(this.distance < this.effect.mouse.radius && this.effect.enablePhysics == true){
                this.angle = Math.atan2(this.dy, this.dx) // takes the range between +pi and -pi
                this.velocityX += this.force * Math.cos(this.angle)
                this.velocityY += this.force * Math.sin(this.angle)
            }

            // return back to original state
            this.x += (this.velocityX *= this.friction) + (this.OriginXPos - this.x) * this.ease
            this.y += (this.velocityY *= this.friction) + (this.OriginYPos - this.y) * this.ease
            
            


           
        }
    

    }

   
    class Effect{
        constructor(canvas, width, height, image){
            this.width = width
            this.height = height
            this.particlesArray = [] // particle array
            this.image = image
            this.gap = 3
            this.enablePhysics = false
            this.canvas = canvas

            this.mouse = {
                radius : 3000,
                x : undefined,
                y : undefined
            }

            canvas.addEventListener('mousemove',e => {
                const rect = canvas.getBoundingClientRect(); // get the position and size of the canvas element
                const scaleX = canvas.width / rect.width; // calculate the scale factor in X direction
                const scaleY = canvas.height / rect.height; // calculate the scale factor in Y direction
                
                // Scale the mouse coordinates to match the canvas size
                this.mouse.x = (e.clientX - rect.left) * scaleX;
                this.mouse.y = (e.clientY - rect.top) * scaleY;
            })

            

        }

        Init(context){
           
            context.drawImage(this.image, 0, 0)
            const imagedata = context.getImageData(0, 0, this.width, this.height)
            const pixels = imagedata.data
            // console.log(pixels) // we are searching for pixels with alpha values more than 0 and replacing them with a particle instance of the object

            // first we will be cycling through both rows and columns for this data --- RGBA
            
            for(let y = 0; y < this.height; y += this.gap){
                for(let x = 0; x < this.width; x += this.gap){
                    const index = (y * this.width + x) * 4 // col * the width of our canvas + left over row from iteration) * rgba(values per pixel)

                    const r = pixels[index]
                    const g = pixels[index + 1]
                    const b = pixels[index + 2]
                    const a = pixels[index + 3]

                    const colorData = `rgb(${r}, ${g}, ${b})` 

                    

                    // console.log(colorData)

                    if(a > 0){ // if pixels with alpha values more than 0 and replacing them with a particle instance of the object
                        this.particlesArray.push(new Particle(this, x, y, colorData))
                        
                    }
               }
            } 



           
        }



        drawEffect(context){
            this.particlesArray.forEach(particle => particle.draw(context)) // each particle that has been pushed will utilise the 'draw' method from the 
            
            // particle class
        }

        // ascii
        drawAsciiEffect(context){
            this.particlesArray.forEach(particle =>particle.asciiText(context))
        }

        drawImage(context){
            context.drawImage(this.image, 0, 0, this.width, this.height);
        }

        update(){
            this.particlesArray.forEach(particle => particle.update())
        }

        
        togglePhysics(){
            return this.enablePhysics = !this.enablePhysics
        }

    

    }
    

  

     
    
    
    // console.log(effect1)
    

export{Particle, Effect};

// add physics

