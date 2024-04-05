
// canvasMorpher.js

class CanvasMorpher {
  constructor(c, numPoints, radius) {
    //this.canvas = document.getElementById(canvasId);
    //this.ctx = c.getContext('2d');
    //this.canvas = this.ctx.canvas;
    
    this.container = c; // This is now a container for two canvases

    this.numPoints = numPoints;
    this.radius = radius;
  }
  
  morphAndDraw(p1, p2) {
    // Clear the container and prepare for two new canvases
    this.container.innerHTML = '';
    this.canvas1 = this.createCanvas();
    this.canvas2 = this.createCanvas();

    // First morph
    this.ctx = this.canvas1.getContext('2d');
    this.morph_Draw(p1);

    // Second morph
    this.ctx = this.canvas2.getContext('2d');
    this.morph_Draw(p2);
  }

  createCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = this.container.clientWidth / 2; // Assuming the container's width is set to hold two canvases side by side
    canvas.height = this.container.clientHeight; // Use the full height of the container
    this.container.appendChild(canvas);
    return canvas;
  }

  //Random Color generator
  generateRandomColor(){
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

  generateRandomCircleCoordinates() {
    const coordinates = [];

    for (let i = 0; i < this.numPoints; i++) {
      const angle = (Math.PI * 2 * i) / this.numPoints;
      const x = Math.cos(angle) * this.radius;
      const y = Math.sin(angle) * this.radius;

      coordinates.push({ x, y });
    }

    return coordinates;
  }

  nonlinearAsymmetricPerspectiveShift(x, y, p) {
    const scaleFactorX = 1 + p * Math.pow(x / 110, 3);
    const scaleFactorY = 1 + 0.2 * Math.pow(y / 110, 2);

    const newX = x * Math.pow(scaleFactorX, 2);
    const newY = y * Math.pow(scaleFactorY, 1.5);

    return { x: newX, y: newY };
  }

  morph_Draw(p) {
    const originalCoordinates = this.generateRandomCircleCoordinates();
    const morphedCoordinates = originalCoordinates.map(({ x, y }) => this.nonlinearAsymmetricPerspectiveShift(x, y, p));

    const minX = Math.min(...morphedCoordinates.map(coord => coord.x));
    const minY = Math.min(...morphedCoordinates.map(coord => coord.y));
    const maxX = Math.max(...morphedCoordinates.map(coord => coord.x));
    const maxY = Math.max(...morphedCoordinates.map(coord => coord.y));

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    const normalizedCoordinates = morphedCoordinates.map(({ x, y }) => ({
      x: x - minX + this.canvas.width / 2,
      y: y - minY + this.canvas.height / 2
    }));

    const backgroundColor = this.generateRandomColor();
    const originalColor = this.generateRandomColor();
    const morphedColor = this.generateRandomColor();

    this.ctx.fillStyle = backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawCircle(originalCoordinates, originalColor, 1.5);
    this.drawCircle(normalizedCoordinates, morphedColor, 1.5);
  }

  drawCircle(coordinates, color, scaleFactor) {
    this.ctx.beginPath();

    this.ctx.moveTo(coordinates[0].x, coordinates[0].y);

    for (let i = 1; i < coordinates.length; i++) {
      const x = coordinates[i].x;
      const y = coordinates[i].y;
      this.ctx.lineTo(x, y);
    }

    this.ctx.closePath();

    this.ctx.fillStyle = color;
    this.ctx.fill();
  }
}

// Usage example:
// const canvasMorpher = new CanvasMorpher('myCanvas', 100, 105);
// canvasMorpher.morphAndDraw();
