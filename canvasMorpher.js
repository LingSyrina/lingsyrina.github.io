class CanvasMorpher {
  constructor(c, numPoints, radius) {
    this.ctx = c.getContext('2d');
    this.canvas = this.ctx.canvas;
    this.numPoints = numPoints;
    this.radius = radius;
  }

  // Function to generate random hex color
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

  morphAndDraw(p) {
    const originalCoordinates = this.generateRandomCircleCoordinates();
    const morphedCoordinates = originalCoordinates.map(({ x, y }) => 
      this.nonlinearAsymmetricPerspectiveShift(x, y, p)
    );

    // Use generateRandomColor to set dynamic colors
    const backgroundColor = this.generateRandomColor();
    const originalColor = this.generateRandomColor();
    const morphedColor = this.generateRandomColor();

    // Clear canvas with the specified background color
    this.ctx.fillStyle = backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw original and morphed circles with specified colors
    this.drawCircle(originalCoordinates, originalColor, 1.5);
    this.drawCircle(morphedCoordinates, morphedColor, 1.5, true); // Adjust for normalized drawing
  }

  drawCircle(coordinates, color, scaleFactor, normalize = false) {
    if (normalize) {
      const minX = Math.min(...coordinates.map(coord => coord.x));
      const minY = Math.min(...coordinates.map(coord => coord.y));
      coordinates = coordinates.map(({ x, y }) => ({
        x: x - minX + this.canvas.width / 2,
        y: y - minY + this.canvas.height / 2
      }));
    }

    this.ctx.beginPath();
    this.ctx.moveTo(coordinates[0].x, coordinates[0].y);

    for (let i = 1; i < coordinates.length; i++) {
      this.ctx.lineTo(coordinates[i].x, coordinates[i].y);
    }

    this.ctx.closePath();
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }
}

// Usage example:
// const canvas = document.getElementById('myCanvas');
// const canvasMorpher = new CanvasMorpher(canvas, 100, 105);
// canvasMorpher.morphAndDraw(0.5);
