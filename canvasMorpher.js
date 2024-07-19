// to-do: fix the gliching loading


function createAndManipulateCanvases(originalCanvas) {
    const body = document.body;
    // Create a new canvas element
    const newCanvas = document.createElement('canvas');

    // Set dimensions for the new canvas
    newCanvas.width = originalCanvas.width;
    newCanvas.height = originalCanvas.height;

    // Get context
    const ctx = newCanvas.getContext('2d');

    let container = document.getElementById('canvasContainer');
    if (!container) {
        // Create a new container if it does not exist
        container = document.createElement('div');
        container.id = 'canvasContainer';
        document.body.appendChild(container); // Append the container to the body or any other suitable element

        // Optionally set styles directly via JavaScript
        container.style.width = '100%'; // Adjust as necessary
        container.style.height = 'auto';
        container.style.display = 'none';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
    }

    // Append the new canvas to the container
    container.appendChild(newCanvas);

    return newCanvas;
}

class CanvasMorpher {
    constructor(c, numPoints, radius) {
        this.ctx = c.getContext('2d');
        this.canvas = this.ctx.canvas;
        this.numPoints = numPoints;
        this.radius = radius;

        this.intrablob_distance = 500;
        this.num_ctrls = 4;
        this.offset = 1.7;
        this.maxxy = 700;
        this.A = 230;
        this.B = 670;
        this.distortion_amount = 50;

        this.x_points = [[], [], [], [], []];
        this.y_points = [[], [], [], [], []];
        this.ctrl_x_first = [[], [], [], [], []];
        this.ctrl_y_first = [[], [], [], [], []];
        this.ctrl_x_second = [[], [], [], [], []];
        this.ctrl_y_second = [[], [], [], [], []];
        this.initializePoints();
    }

    initializePoints() {
        this.x_points[0] = [100, 220, 310, 210];
        this.y_points[0] = [190, 140, 250, 320];
        for (let i = 1; i < 5; i++) {
            this.x_points[i] = this.cloneObject(this.x_points[0]);
            this.y_points[i] = this.cloneObject(this.y_points[0]);
        }

        this.ctrl_x_first[0] = [142, 255, 362, 137];
        this.ctrl_y_first[0] = [58, 239, 479, 286];
        for (let i = 1; i < 5; i++) {
            this.ctrl_x_first[i] = this.cloneObject(this.ctrl_x_first[0]);
            this.ctrl_y_first[i] = this.cloneObject(this.ctrl_y_first[0]);
        }

        this.applyDistortion();

    }

    cloneObject(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        const temp = obj.constructor();
        for (const key in obj) {
            temp[key] = this.cloneObject(obj[key]);
        }
        return temp;
    }

    applyDistortion() {
        this.distort(1, 0, Math.PI / 4, this.distortion_amount);
        this.distort(2, 0, (Math.PI / 2) + Math.PI / 4, this.distortion_amount);
        this.distort(3, 0, Math.PI / 4, this.distortion_amount);
        this.distort(3, 0, (Math.PI / 2) + Math.PI / 4, this.distortion_amount);

        this.distort(1, 1, Math.PI * 3 / 4, this.distortion_amount);
        this.distort(2, 1, (Math.PI / 2) + Math.PI * 3 / 4, this.distortion_amount);
        this.distort(3, 1, Math.PI * 3 / 4, this.distortion_amount);
        this.distort(3, 1, (Math.PI / 2) + Math.PI * 3 / 4, this.distortion_amount);

        this.distort(1, 2, Math.PI * 5 / 4, this.distortion_amount);
        this.distort(2, 2, (Math.PI / 2) + Math.PI * 5 / 4, this.distortion_amount);
        this.distort(3, 2, Math.PI * 5 / 4, this.distortion_amount);
        this.distort(3, 2, (Math.PI / 2) + Math.PI * 5 / 4, this.distortion_amount);

        this.distort(1, 2, Math.PI, this.distortion_amount);
        this.distort(2, 2, (Math.PI / 2) + Math.PI, this.distortion_amount);
        this.distort(3, 2, Math.PI, this.distortion_amount);
        this.distort(3, 2, (Math.PI / 2) + Math.PI, this.distortion_amount);
    }

    distort(blob, ctrl, angle, distance) {
        this.ctrl_x_first[blob][ctrl] = this.ctrl_x_first[blob][ctrl] + Math.cos(angle) * distance;
        this.ctrl_y_first[blob][ctrl] = this.ctrl_y_first[blob][ctrl] + Math.sin(angle) * distance;
    }

    morphAndDraw(p, rand, arrangementType = 'dual') {
        const flipped = (px, py, cx, cy) => {
            const nx = (cx - px) + cx;
            const ny = (cy - py) + cy;
            return [nx, ny];
        };

        const which = 4;
        const center_x = 0;
        const center_y = 0;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let e;
        switch (arrangementType) {
            case 'circle':
                const thetaCircle = p * 2 * Math.PI;
                e = { x: (this.maxxy / 2) + Math.cos(thetaCircle) * (this.maxxy / 2), y: (this.maxxy / 2) + Math.sin(thetaCircle) * (this.maxxy / 2) };
                break;
            case 'sineWave':
                e = { x: p * this.maxxy, y: Math.sin(p * 2 * Math.PI) * (this.maxxy / 2) };
                break;
            case 'halfCircle':
                const thetaHalfCircle = p * Math.PI;
                e = { x: (this.maxxy / 2) + Math.cos(thetaHalfCircle) * (this.maxxy / 2), y: (this.maxxy / 2) + Math.sin(thetaHalfCircle) * (this.maxxy / 2) };
                //e = { x: 1185, y: 5};
                break;
            case 'halfEllipse':
                const thetaHalfEllipse = p * Math.PI;
                e = { x: (this.maxxy / 2) + Math.cos(thetaHalfEllipse) * (this.maxxy / 2.5), y: (this.maxxy / 2) + Math.sin(thetaHalfEllipse) * (this.maxxy / 1.5) };
                break;
            case 'dual':
                const noise = rand * 70
                e = { x : this.A + (this.B * p) + noise, y : this.A + (this.B * p) - noise};
                //e = { x: 860, y: 940};
                break;
        }
        console.log(`Blob controled by:`, p, rand);
        console.log(`Blob renders:`, e);

        for (let j = 0; j < this.num_ctrls; j++) {
            let m = (this.ctrl_x_first[1][j] - this.ctrl_x_first[0][j]) / this.intrablob_distance;
            let b = this.ctrl_x_first[0][j] - m * this.intrablob_distance;
            let horizontal_rec_x = (e.x - 100) * this.offset * m + b;

            m = (this.ctrl_y_first[1][j] - this.ctrl_y_first[0][j]) / this.intrablob_distance;
            b = this.ctrl_y_first[0][j] - m * this.intrablob_distance;
            let horizontal_rec_y = (e.x - 100) * this.offset * m + b;

            m = (this.ctrl_x_first[2][j] - this.ctrl_x_first[0][j]) / this.intrablob_distance;
            b = this.ctrl_x_first[0][j] - m * this.intrablob_distance;
            let vertical_rec_x = (e.y - 100) * this.offset * m + b;

            m = (this.ctrl_y_first[2][j] - this.ctrl_y_first[0][j]) / this.intrablob_distance;
            b = this.ctrl_y_first[0][j] - m * this.intrablob_distance;
            let vertical_rec_y = (e.y - 100) * this.offset * m + b;

            this.ctrl_x_first[4][j] = (horizontal_rec_x + vertical_rec_x) / 2;
            this.ctrl_y_first[4][j] = (horizontal_rec_y + vertical_rec_y) / 2;
        }

        let c2 = flipped(this.ctrl_x_first[which][1], this.ctrl_y_first[which][1], this.x_points[which][1], this.y_points[which][1]);
        this.ctrl_x_second[which][0] = c2[0];
        this.ctrl_y_second[which][0] = c2[1];

        c2 = flipped(this.ctrl_x_first[which][2], this.ctrl_y_first[which][2], this.x_points[which][2], this.y_points[which][2]);
        this.ctrl_x_second[which][1] = c2[0];
        this.ctrl_y_second[which][1] = c2[1];

        c2 = flipped(this.ctrl_x_first[which][3], this.ctrl_y_first[which][3], this.x_points[which][3], this.y_points[which][3]);
        this.ctrl_x_second[which][2] = c2[0];
        this.ctrl_y_second[which][2] = c2[1];

        c2 = flipped(this.ctrl_x_first[which][0], this.ctrl_y_first[which][0], this.x_points[which][0], this.y_points[which][0]);
        this.ctrl_x_second[which][3] = c2[0];
        this.ctrl_y_second[which][3] = c2[1];


        // Log the points and control points
        //console.log(`Blob ${which} Control Points First:`, this.ctrl_x_first[which], this.ctrl_y_first[which]);
        //console.log(`Blob ${which} Control Points Second:`, this.ctrl_x_second[which], this.ctrl_y_second[which]);


        this.ctx.lineWidth = 6;
        this.ctx.beginPath();
        this.ctx.moveTo(this.x_points[which][0] + center_x, this.y_points[which][0] + center_y);
        this.ctx.bezierCurveTo(this.ctrl_x_first[which][0] + center_x, this.ctrl_y_first[which][0] + center_y, this.ctrl_x_second[which][0] + center_x, this.ctrl_y_second[which][0] + center_y, this.x_points[which][1] + center_x, this.y_points[which][1] + center_y);
        this.ctx.bezierCurveTo(this.ctrl_x_first[which][1] + center_x, this.ctrl_y_first[which][1] + center_y, this.ctrl_x_second[which][1] + center_x, this.ctrl_y_second[which][1] + center_y, this.x_points[which][2] + center_x, this.y_points[which][2] + center_y);
        this.ctx.bezierCurveTo(this.ctrl_x_first[which][2] + center_x, this.ctrl_y_first[which][2] + center_y, this.ctrl_x_second[which][2] + center_x, this.ctrl_y_second[which][2] + center_y, this.x_points[which][3] + center_x, this.y_points[which][3] + center_y);
        this.ctx.bezierCurveTo(this.ctrl_x_first[which][3] + center_x, this.ctrl_y_first[which][3] + center_y, this.ctrl_x_second[which][3] + center_x, this.ctrl_y_second[which][3] + center_y, this.x_points[which][0] + center_x, this.y_points[which][0] + center_y);
        this.ctx.fillStyle = "#73C6B6";
        this.ctx.fill();
    }


    canvasToImage(canvas) {
     return new Promise((resolve, reject) => {
       const img = new Image();
       img.onload = () => {
         //console.log("Image loaded");
         resolve(img);
       };
       img.onerror = (error) => {
         console.error("Image load error:", error);
         reject(error);
       };
       img.src = canvas.toDataURL('image/png');
     });
   }

    scaleCanvas(originalCanvas, targetWidth, targetHeight) {
        const scaledCanvas = document.createElement('canvas');
        scaledCanvas.width = targetWidth;
        scaledCanvas.height = targetHeight;
        const scaledCtx = scaledCanvas.getContext('2d');

        // Clear canvas
        scaledCtx.clearRect(0, 0, targetWidth, targetHeight);

        // Draw the original canvas onto the scaled canvas
        scaledCtx.drawImage(originalCanvas, 0, 0, targetWidth, targetHeight);

        return scaledCanvas;
    }


    combineImages(canvas, p1, p2, n1=0, n2=0) {
        const ctx = canvas.getContext('2d');
        const newCanvas = createAndManipulateCanvases(canvas);
        const canvasMorpher = new CanvasMorpher(newCanvas, 1200, 1200);

        // Create a 1200x1200 canvas for original drawing
        const originalCanvas = document.createElement('canvas');
        originalCanvas.width = 1200;
        originalCanvas.height = 1200;
        const originalCtx = originalCanvas.getContext('2d');

        // Draw the first shape
        // Clear the original canvas and newCanvas before drawing the second shape
        //originalCtx.clearRect(0, 0, originalCanvas.width, originalCanvas.height); // Clear canvas
        //newCanvas.getContext('2d').clearRect(0, 0, newCanvas.width, newCanvas.height); // Clear newCanvas

        canvasMorpher.morphAndDraw(p1, n1);
        originalCtx.drawImage(newCanvas, 0, 0, 1200, 1200);

        // Scale the original canvas to fit the target size
        const scaledCanvas1 = this.scaleCanvas(originalCanvas, canvas.width, canvas.height);
        const img1Promise = this.canvasToImage(scaledCanvas1);

        // Draw the second shape
        // Clear the original canvas and newCanvas before drawing the second shape
        originalCtx.clearRect(0, 0, originalCanvas.width, originalCanvas.height); // Clear canvas
        //newCanvas.getContext('2d').clearRect(0, 0, newCanvas.width, newCanvas.height); // Clear newCanvas

        canvasMorpher.morphAndDraw(p2, n2);
        originalCtx.drawImage(newCanvas, 0, 0, 1200, 1200);

        // Scale the original canvas to fit the target size
        const scaledCanvas2 = this.scaleCanvas(originalCanvas, canvas.width, canvas.height);
        const img2Promise = this.canvasToImage(scaledCanvas2);

        //console.log(`size:`, canvas.width, canvas.height);
        // Combine the scaled images
         Promise.all([img1Promise, img2Promise]).then(([img1, img2]) => {
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
                ctx.drawImage(img1, 0, 0);
                ctx.drawImage(img2, canvas.width / 2, 0);
            });
    }

    XAB(canvas, p1, p2, n1=0, n2=0, condition=0) {
      console.log(`variables:`, p1, p2, n1, n2, condition, `type of condition:`, typeof condition);

      const ctx = canvas.getContext('2d');
      const newCanvas = createAndManipulateCanvases(canvas);
      const canvasMorpher = new CanvasMorpher(newCanvas, 1200, 1200);

      // Create a 1200x1200 canvas for original drawing
      const originalCanvas = document.createElement('canvas');
      originalCanvas.width = 1200;
      originalCanvas.height = 1200;
      const originalCtx = originalCanvas.getContext('2d');

      // Draw the first shape (condition 1: p1, else: p2)
      // old code
      if (condition == 1) {
        console.log(`Condition 1`);
        canvasMorpher.morphAndDraw(p1, 0);
        //canvasMorpher.morphAndDraw(p1, 0); // if XAB identical, then n1 == 0, else it takes the baseline
      }
      //new condition for similarity
      else if (condition == 2) {
        console.log(`Condition 2`);
        canvasMorpher.morphAndDraw(p2, 0); // if XAB identical, then n1 == 0, else it takes the baseline
      }
      else if (condition == 0){
        console.log(`Condition 0`);
        canvasMorpher.morphAndDraw(p2, n2);
      }

      originalCtx.drawImage(newCanvas, 0, 0, 1200, 1200);

      // Scale the original canvas to fit the target size
      const scaledCanvas1 = this.scaleCanvas(originalCanvas, canvas.width*2/3, canvas.height*2/3);
      const img1Promise = this.canvasToImage(scaledCanvas1);

      // Clear the original canvas for the next shape
      originalCtx.clearRect(0, 0, originalCanvas.width, originalCanvas.height);

      // Draw the second shape (p2)
      canvasMorpher.morphAndDraw(p1, n1);
      originalCtx.drawImage(newCanvas, 0, 0, 1200, 1200);

      // Scale the original canvas to fit the target size
      const scaledCanvas2 = this.scaleCanvas(originalCanvas, canvas.width*2/3, canvas.height*2/3);
      const img2Promise = this.canvasToImage(scaledCanvas2);

      // Clear the original canvas for the next shape
      originalCtx.clearRect(0, 0, originalCanvas.width, originalCanvas.height);

      // Draw the third shape (p3)
      canvasMorpher.morphAndDraw(p2, n2);
      originalCtx.drawImage(newCanvas, 0, 0, 1200, 1200);

      // Scale the original canvas to fit the target size
      const scaledCanvas3 = this.scaleCanvas(originalCanvas, canvas.width*2/3, canvas.height*2/3);
      const img3Promise = this.canvasToImage(scaledCanvas3);

      // Combine the scaled images in a triangular arrangement
      Promise.all([img1Promise, img2Promise, img3Promise]).then(([img1, img2, img3]) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

            // Calculate the positions
            const centerX = (canvas.width) / 4;
            const row1Y = 0;
            const row2Y = canvas.height / 2;
            const img2X = 0;
            const img3X = (canvas.width / 2);
            // Draw the images
            ctx.drawImage(img1, centerX, row1Y);           // Top center image
            ctx.drawImage(img2, img2X, row2Y);             // Bottom left image
            ctx.drawImage(img3, img3X, row2Y);             // Bottom right image

          });
        };
      };

// Usage example:
// const canvasMorpher = new CanvasMorpher('myCanvas', 100, 105);
// canvasMorpher.morphAndDraw();
// Usage example:
// const canvas = document.getElementById('myCanvas');
// const canvasMorpher = new CanvasMorpher(canvas, 100, 105);
// canvasMorpher.morphAndDraw(0.5);
