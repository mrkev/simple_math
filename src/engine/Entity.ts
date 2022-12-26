export type CollisionMode = "none" | "collides" | "static";

export abstract class Entity {
  x: number;
  y: number;
  readonly width: number;
  readonly height: number;
  highlight: boolean = false;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  abstract destroy(): void;
  abstract update(): void;
  abstract render(ctx: CanvasRenderingContext2D, tick: number): void;
}
