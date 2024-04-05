// canvasMorpher.js

class CanvasMorpher {
  constructor(c, numPoints, radius) {
    this.container = c; // This is now a container for two canvases
    this.numPoints = numPoints;
    this.radius = radius;
  }

  generateRandomColor() {
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

  morphAndDraw(p1, p2) {
    this.container.innerHTML = ''; // Clear previous contents
    this.canvas1 = this.createCanvas();
    this.canvas2 = this.createCanvas();

    this.ctx = this.canvas1.getContext('2d');
    this.processMorph(p1);

    this.ctx = this.canvas2.getContext('2d');
    this.processMorph(p2);
  }

  createCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = this.container.clientWidth / 2;
    canvas.height = this.container.clientHeight;
    this.container.appendChild(canvas);
    return canvas;
  }

  processMorph(p) {
    const originalCoordinates = this.generateRandomCircleCoordinates();
    const morphedCoordinates = originalCoordinates.map(({ x, y }) => this.nonlinearAsymmetricPerspectiveShift(x, y, p));

    this.morphAndDrawCircles(morphedCoordinates, this.generateRandomColor());
  }

  morphAndDrawCircles(coordinates, color) {
    this.ctx.beginPath();
    this.ctx.moveTo(coordinates[0].x, coordinates[0].y);

    for (let i = 1; i < coordinates.length; i++) {
      const { x, y } = coordinates[i];
      this.ctx.lineTo(x, y);
    }

    this.ctx.closePath();
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }
}


// Example usage
// Create a container in your HTML: <div id="morphContainer" style="width: 600px; height: 300px;"></div>
// Then:
// const container = document.getElementById('morphContainer');
// Morphfunction(container, 0.5, 1.0); // Example parameters

