'use client';

import { useEffect, useRef, useState } from 'react';
import invariant from 'tiny-invariant';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import styles from '../grid.module.css';

interface GridItemProps {
  src: string;
  instanceId: symbol;
}

export default function GridItem({ src, instanceId }: GridItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'idle' | 'dragging' | 'over'>('idle');

  useEffect(() => {
    const element = itemRef.current;
    invariant(element);

    return combine(
      draggable({
        element,
        getInitialData: () => ({ type: 'grid-item', src, instanceId }),
        onDragStart: () => setState('dragging'),
        onDrop: () => setState('idle'),
      }),
      dropTargetForElements({
        element,
        getData: () => ({ src }),
        getIsSticky: () => true,
        canDrop: ({ source }) =>
          source.data.instanceId === instanceId &&
          source.data.type === 'grid-item' &&
          source.data.src !== src,
        onDragEnter: () => setState('over'),
        onDragLeave: () => setState('idle'),
        onDrop: () => setState('idle'),
      })
    );
  }, [src, instanceId]);

  return (
    <div
      ref={itemRef}
      className={styles.gridItem}
      data-state={state}
      data-testid={`grid-item-${src}`}
    >
      <img src={src} alt="Grid item" draggable={false} />
    </div>
  );
}
