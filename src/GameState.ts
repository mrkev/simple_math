export type Action = "paddle-left" | "paddle-right";

/** Root object for the state of the game */
export class GlobalState {
  readonly actions: Set<Action>;
  constructor() {
    this.actions = new Set();
  }
}
