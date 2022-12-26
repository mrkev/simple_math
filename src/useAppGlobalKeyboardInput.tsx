import { useEffect } from "react";
import { GlobalState } from "./GameState";

/**
 * Handles keyboard interaction
 */
export function useAppGlobalKeyboardInput(globalState: GlobalState) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      // console.log("DOWN", e.key, ".");

      // Application Shortcuts
      switch (e.key) {
        case "ArrowLeft": {
          globalState.actions.add("paddle-left");
          console.log(globalState.actions);
          break;
        }
        case "ArrowRight": {
          globalState.actions.add("paddle-right");
          break;
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.repeat) return;

      switch (e.key) {
        case "ArrowLeft": {
          globalState.actions.delete("paddle-left");
          console.log(globalState.actions);

          break;
        }
        case "ArrowRight": {
          globalState.actions.delete("paddle-right");
          break;
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [globalState]);
}
