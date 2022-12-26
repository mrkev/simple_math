import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Entity } from "./Entity";

const seenEntities = new WeakSet<Entity>();

export type EngineClickHandler = (entities: Entity[]) => void;

export function Engine({
  width,
  height,
  entities,
  onClick,
}: {
  width: number;
  height: number;
  entities: readonly Entity[];
  onClick?: EngineClickHandler;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const onCanvasClick = useEngineClickEvent(entities, canvasRef, onClick);

  useEngineLoop(canvasRef, entities);

  return (
    <canvas
      style={{ background: "gray" }}
      width={width}
      height={height}
      ref={canvasRef}
      onClick={onCanvasClick}
    />
  );
}

function useEngineClickEvent(
  entities: readonly Entity[],
  canvasRef: MutableRefObject<HTMLCanvasElement | null>,
  onClick?: EngineClickHandler
) {
  return useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>): void => {
      // todo: !
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const rect = canvasRef.current!.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const clickedEntities = entitiesAtPoint(clickX, clickY, entities);

      onClick?.(clickedEntities);
    },
    [canvasRef, entities, onClick]
  );
}

function useEngineLoop(
  canvasRef: MutableRefObject<HTMLCanvasElement | null>,
  entities: readonly Entity[]
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas == null || ctx == null) {
      return;
    }
    // ctx.imageSmoothingEnabled = false;

    let nextRaf = 0; // todo is setting to default 0 an issue?
    let lastTime = -1;
    const frame = function frame(time: number) {
      const tick = (time / 200) >> 0;

      // Let entities update themselves
      for (const entity of entities) {
        if (!seenEntities.has(entity)) {
          seenEntities.add(entity);
        }
        entity.update();
      }

      // Render entities
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const entity of entities) {
        entity.update();
        entity.render(ctx, tick);
      }

      lastTime = time;
      nextRaf = requestAnimationFrame(frame);
    };
    nextRaf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(nextRaf);
      // console.log("HERE");
      // for (const entity of entities) {
      //   entity.destroy();
      // }
    };
  }, [canvasRef, entities]);
}

export function entitiesAtPoint(
  px: number,
  py: number,
  entities: readonly Entity[]
): Entity[] {
  const result: Entity[] = [];
  for (const entity of entities) {
    const { x, y, width, height } = entity;
    if (px > x && px < x + width && py > y && py < y + height) {
      result.push(entity);
    }
  }
  return result;
}
