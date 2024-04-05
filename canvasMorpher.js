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

  generateRandomCircleCoordinates(offsetX = 0, offsetY = 0) {
    const coordinates = [];
    for (let i = 0; i < this.numPoints; i++) {
      const angle = (Math.PI * 2 * i) / this.numPoints;
      const x = Math.cos(angle) * this.radius + offsetX;
      const y = Math.sin(angle) * this.radius + offsetY; // Adjust for offsetY
      coordinates.push({ x, y });
    }
    return coordinates;
  }

  nonlinearAsymmetricPerspectiveShift(x, y, p, offsetX, offsetY) {
    const adjustedX = x - offsetX;
    const adjustedY = y - offsetY;
    const scaleFactorX = 1 + p * Math.pow(adjustedX / 110, 3);
    const scaleFactorY = 1 + 0.2 * Math.pow(adjustedY / 110, 2);
    const newX = adjustedX * Math.pow(scaleFactorX, 2) + offsetX;
    const newY = adjustedY * Math.pow(scaleFactorY, 1.5) + offsetY;
    return { x: newX, y: newY };
  }

  morphAndDraw(p1, p2) {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight); // Clear the canvas

    // Draw first morph on the left half
    const offsetX1 = this.canvasWidth / 4;
    const offsetY = this.canvasHeight / 2;
    let originalCoordinates = this.generateRandomCircleCoordinates(offsetX1, offsetY);
    let morphedCoordinates = originalCoordinates.map(({ x, y }) => 
      this.nonlinearAsymmetricPerspectiveShift(x, y, p1, offsetX1, offsetY));
    this.drawCircle(morphedCoordinates, this.generateRandomColor());

    // Draw second morph on the right half
    const offsetX2 = 3 * this.canvasWidth / 4;
    originalCoordinates = this.generateRandomCircleCoordinates(offsetX2, offsetY);
    morphedCoordinates = originalCoordinates.map(({ x, y }) => 
      this.nonlinearAsymmetricPerspectiveShift(x, y, p2, offsetX2, offsetY));
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


// Integration with jsPsych goes here...
