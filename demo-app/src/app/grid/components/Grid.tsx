'use client';

import { useEffect, useState } from 'react';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import GridItem from './GridItem';
import styles from '../grid.module.css';

interface GridItemType {
  id: string;
  src: string;
  position: number;
}

interface GridProps {
  items: GridItemType[];
  onUpdate: (items: GridItemType[]) => void;
  onPositionUpdate: (items: GridItemType[]) => void;
}

export default function Grid({ items, onUpdate, onPositionUpdate }: GridProps) {
  const [instanceId] = useState(() => Symbol('grid-instance'));

  useEffect(() => {
    return monitorForElements({
      canMonitor({ source }) {
        return source.data.instanceId === instanceId;
      },
      onDrop({ source, location }) {
        const target = location.current.dropTargets[0];
        if (!target) return;

        const sourceSrc = source.data.src as string;
        const targetSrc = target.data.src as string;

        if (sourceSrc === targetSrc) return;

        const sourceIndex = items.findIndex(item => item.src === sourceSrc);
        const targetIndex = items.findIndex(item => item.src === targetSrc);

        if (sourceIndex === -1 || targetIndex === -1) return;

        const newItems = [...items];
        [newItems[sourceIndex], newItems[targetIndex]] = [newItems[targetIndex], newItems[sourceIndex]];

        const updatedItems = newItems.map((item, index) => ({
          ...item,
          position: index,
        }));

        onUpdate(updatedItems);
        onPositionUpdate(updatedItems);
      },
    });
  }, [items, instanceId, onUpdate, onPositionUpdate]);

  return (
    <div className={styles.gridContainer}>
      <div className={styles.grid} data-testid="grid">
        {items.map((item) => (
          <GridItem
            key={item.id}
            src={item.src}
            instanceId={instanceId}
          />
        ))}
      </div>
    </div>
  );
}
