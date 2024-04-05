class CanvasMorpher {
  constructor(canvas, numPoints, radius) {
    this.ctx = canvas.getContext('2d');
    this.numPoints = numPoints;
    this.radius = radius;
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
  }

  generateRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

  generateRandomCircleCoordinates(offsetX = 0) {
    const coordinates = [];
    for (let i = 0; i < this.numPoints; i++) {
      const angle = (Math.PI * 2 * i) / this.numPoints;
      const x = Math.cos(angle) * this.radius + offsetX;
      const y = Math.sin(angle) * this.radius + this.canvasHeight / 4; // Center vertically
      coordinates.push({ x, y });
    }
    return coordinates;
  }

  nonlinearAsymmetricPerspectiveShift(x, y, p) {
    const scaleFactorX = 1 + p * Math.pow((x - this.canvasWidth / 4) / 110, 3); // Adjust for offsetX
    const scaleFactorY = 1 + 0.2 * Math.pow((y - this.canvasHeight / 4) / 110, 2); // Center vertically
    const newX = x * Math.pow(scaleFactorX, 2);
    const newY = y * Math.pow(scaleFactorY, 1.5);
    return { x: newX, y: newY };
  }

  morphAndDraw(p1, p2) {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight); // Clear the canvas

    // Draw first morph on the left half
    let originalCoordinates = this.generateRandomCircleCoordinates(this.canvasWidth / 4);
    let morphedCoordinates = originalCoordinates.map(({ x, y }) => this.nonlinearAsymmetricPerspectiveShift(x, y, p1));
    this.drawCircle(morphedCoordinates, this.generateRandomColor());

    // Draw second morph on the right half
    originalCoordinates = this.generateRandomCircleCoordinates(3 * this.canvasWidth / 4);
    morphedCoordinates = originalCoordinates.map(({ x, y }) => this.nonlinearAsymmetricPerspectiveShift(x, y, p2));
    this.drawCircle(morphedCoordinates, this.generateRandomColor());
  }

  drawCircle(coordinates, color) {
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



