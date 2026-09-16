// ============================================================
// WASM Module Initialization
// ============================================================
import init, { GesturesManager } from "./pkg/samples_manager.js";

async function main() {
  await init(); // Loads and compiles the .wasm module — called only once

  // ============================================================
  // Canvas Setup
  // ============================================================
  const canva = document.getElementById("canvas");
  const canva_repr = canva.getContext("2d");
  canva.width = canva.offsetWidth;
  canva.height = canva.offsetHeight;

  const sche = document.getElementById("schema");
  const sche_repr = sche.getContext("2d");
  sche.width = sche.offsetWidth;
  sche.height = sche.offsetHeight;

  let lastX = 0;
  let lastY = 0;
  let isDrawing = false;

  // ============================================================
  // Draw Class — handles stroke rendering + point tracking
  // ============================================================
  class Draw {
    constructor(color, size, brushType, canvaContext) {
      this.color = color;
      this.brushSize = size;
      this.brushType = brushType;
      this.canvaContext = canvaContext;
      this.pos = {};

      // Tracks visited coordinates, grouped by x value
      this.track = (coordinates) => {
        const key = "" + coordinates.x;
        if (!(key in this.pos)) {
          this.pos[key] = [];
        }
        this.pos[key].push(coordinates.y);
      };
    }

    drawOnCanva(startPositionX, startPositionY, currentPositionX, currentPositionY, cornersDraw = "miter") {
      this.canvaContext.beginPath();
      this.canvaContext.moveTo(startPositionX, startPositionY); // start from last position
      this.canvaContext.lineTo(currentPositionX, currentPositionY); // draw to current position
      this.canvaContext.strokeStyle = this.color;
      this.canvaContext.lineWidth = this.brushSize;
      this.canvaContext.lineCap = this.brushType;
      this.canvaContext.lineJoin = cornersDraw; // sharp corners where lines meet
      this.canvaContext.stroke();
    }

    trackWhileDrawing(currentPositionX, currentPositionY) {
      this.track({ x: currentPositionX, y: currentPositionY });
    }
  }

  // ============================================================
  // Position Helpers
  // ============================================================
  function getMousePos(canvas, mouseEvent) {
    const rect = canvas.getBoundingClientRect();
    return {
      X: mouseEvent.clientX - rect.left,
      Y: mouseEvent.clientY - rect.top,
    };
  }

  function getTouchPos(canvas, touchEvent) {
    const rect = canvas.getBoundingClientRect();
    const touch = touchEvent.touches[0];
    return {
      X: touch.clientX - rect.left,
      Y: touch.clientY - rect.top,
    };
  }

  // ============================================================
  // Canvas Utilities
  // ============================================================
  function clearCanvas() {
    canva_repr.clearRect(0, 0, canva.width, canva.height);
  }

  // ============================================================
  // Instances
  // ============================================================
  let drawIn = new Draw(
    document.getElementById("colorPicker").value,
    document.getElementById("brushSize").value,
    "round",
    canva_repr
  );

  let schema = new Draw(document.getElementById("colorPicker").value, 2, "square", sche_repr);

  let gest_mngr = new GesturesManager(50);

  // ============================================================
  // Drawing Events — Mouse
  // ============================================================
  canva.addEventListener("mousedown", (e) => {
    const pos = getMousePos(canva, e);
    isDrawing = true;
    lastX = pos.X + 3;
    lastY = pos.Y + 3;
    drawIn.color = document.getElementById("colorPicker").value;
    drawIn.brushSize = document.getElementById("brushSize").value;
    drawIn.drawOnCanva(lastX, lastY, lastX, lastY); // draw a point at the initial position
    gest_mngr.start_gesture();
    gest_mngr.start_stroke(lastX, lastY);
  });

  canva.addEventListener("mousemove", (e) => {
    if (!isDrawing) return;

    const pos = getMousePos(canva, e);
    canva_repr.fillStyle = document.getElementById("colorPicker").value;

    drawIn.drawOnCanva(lastX, lastY, pos.X, pos.Y);

    lastX = pos.X;
    lastY = pos.Y;
    gest_mngr.add_stroke_point(lastX, lastY);
  });

  canva.addEventListener("mouseup", () => {
    if (!isDrawing) return;
    isDrawing = false;
    console.log("(x,y): ", drawIn.pos);
    gest_mngr.end_stroke();
  });

  canva.addEventListener("mouseleave", () => {
    if (!isDrawing) return;
    isDrawing = false;
    gest_mngr.end_stroke();
  });

  // ============================================================
  // Drawing Events — Touch
  // ============================================================
  canva.addEventListener("touchstart", (e) => {
    e.preventDefault();
    const pos = getTouchPos(canva, e);
    isDrawing = true;
    lastX = pos.X + 3;
    lastY = pos.Y + 3;
    drawIn.color = document.getElementById("colorPicker").value;
    drawIn.brushSize = document.getElementById("brushSize").value;
    drawIn.drawOnCanva(lastX, lastY, lastX, lastY); // draw a point at the initial position
    gest_mngr.start_gesture();
    gest_mngr.start_stroke(lastX, lastY);
  });

  canva.addEventListener("touchmove", (e) => {
    if (!isDrawing) return;
    e.preventDefault();

    const pos = getTouchPos(canva, e);
    canva_repr.fillStyle = document.getElementById("colorPicker").value;

    drawIn.drawOnCanva(lastX, lastY, pos.X, pos.Y);

    lastX = pos.X;
    lastY = pos.Y;
    gest_mngr.add_stroke_point(lastX, lastY);
  });

  canva.addEventListener("touchend", () => {
    if (!isDrawing) return;
    isDrawing = false;
    gest_mngr.end_stroke();
  });

  // ============================================================
  // Gesture Recognition — right click triggers shape matching
  // ============================================================
  function match(){
    let shape = gest_mngr.take_gesture("");
    console.log(shape);
    let result = gest_mngr.match_shape(shape);
    if (result !== undefined) {
      write_on_schema(result);
    }
  }

  // ============================================================
  // Schema Canvas — writing matched gesture names
  // ============================================================
  let x_writte = 0;
  let y_writte = 0;

  function write_on_schema(text) {
    sche_repr.font = "20px Arial";
    sche_repr.fillStyle = "black";
    sche_repr.fillText(text, x_writte, y_writte);
    x_writte+=1;
    y_writte+=1;
  }

  // ============================================================
  // Sample Saving
  // ============================================================
  function addSample() {
    let sample_name = String(document.getElementById("sampleName").value);
    if (sample_name === "") return;
    console.log(sample_name);
    gest_mngr.end_gesture();
    gest_mngr.add_gesture(sample_name);
    return;
  }
  window.addSample = addSample;
  window.clearCanvas = clearCanvas; 
  window.match = match;
}
main();