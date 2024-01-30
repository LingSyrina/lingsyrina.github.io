
// canvasMorpher.js

class CanvasMorpher {
  constructor(c, numPoints, radius) {
    //this.canvas = document.getElementById(canvasId);
    this.ctx = c.getContext('2d');
    this.canvas = this.ctx.canvas;
    this.numPoints = numPoints;
    this.radius = radius;
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

  nonlinearAsymmetricPerspectiveShift(x, y) {
    const scaleFactorX = 1 + 0.7 * Math.pow(x / this.radius, 3);
    const scaleFactorY = 1 + 0.2 * Math.pow(y / this.radius, 2);

    const newX = x * Math.pow(scaleFactorX, 2);
    const newY = y * Math.pow(scaleFactorY, 1.5);

    return { x: newX, y: newY };
  }

  morphAndDraw() {
    const originalCoordinates = this.generateRandomCircleCoordinates();
    const morphedCoordinates = originalCoordinates.map(({ x, y }) => this.nonlinearAsymmetricPerspectiveShift(x, y));

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

    this.ctx.fillStyle = '#A3C1AD';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawCircle(originalCoordinates, '#D9AFAF', 1.5);
    this.drawCircle(normalizedCoordinates, '#87A6B8', 1.5);
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
