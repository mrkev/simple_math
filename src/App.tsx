import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Engine } from "./engine/Engine";
import { Entity } from "./engine/Entity";
import { GlobalState } from "./GameState";
import { useAppGlobalKeyboardInput } from "./useAppGlobalKeyboardInput";

const GLOBAL_STATE = new GlobalState();
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const BPM = 128;

class EngineState {
  entities: Entity[];
  constructor(entities: Entity[]) {
    this.entities = entities;
  }
}

class Ball extends Entity {
  private vx: number;
  private vy: number;
  private r: number;
  constructor(x: number, y: number, r: number) {
    super(x, y, r * 2, r * 2);
    this.vx = 1.5;
    this.vy = 2;
    this.r = r;
  }
  destroy(): void {
    /* */
  }
  update(): void {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x - this.r < 0 || this.x + this.r > CANVAS_WIDTH) {
      this.vx *= -1;
    }

    if (this.y - this.r < 0 || this.y + this.r > CANVAS_WIDTH) {
      this.vy *= -1;
    }
  }
  render(ctx: CanvasRenderingContext2D, tick: number): void {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fill();
  }
}

class Paddle extends Entity {
  private vx: number;
  private vy: number;
  private ax: number;
  // private ay: number;
  private MAX_VELOCITY = 2;
  constructor(x: number, y: number, w: number, h: number) {
    super(x, y, w, h);
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    // this.ay = 0;
  }
  destroy(): void {
    throw new Error("Method not implemented.");
  }
  update(): void {
    // console.log(GLOBAL_STATE.actions.size);
    if (GLOBAL_STATE.actions.has("paddle-left")) {
      this.vx -= 1;
    }
    if (GLOBAL_STATE.actions.has("paddle-right")) {
      this.vx += 1;
    }

    this.x += this.vx;
    this.y += this.vy;

    this.vx = 0;
  }
  render(ctx: CanvasRenderingContext2D, tick: number): void {
    ctx.fillStyle = "black";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

function App() {
  const [count, setCount] = useState(0);
  const [es] = useState<EngineState>(new EngineState([new Ball(200, 200, 5)]));
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useAppGlobalKeyboardInput(GLOBAL_STATE);

  return (
    <div className="App">
      <Engine
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        entities={[new Ball(20, 20, 10), new Paddle(100, 300, 100, 20)]}
      />
    </div>
  );
}

export default App;
