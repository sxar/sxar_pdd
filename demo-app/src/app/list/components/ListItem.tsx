'use client';

import { useEffect, useRef, useState } from 'react';
import invariant from 'tiny-invariant';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { attachClosestEdge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/types';
import type { ListItem as ListItemType } from '../types';
import styles from '../list.module.css';

interface ListItemProps {
  item: ListItemType;
  index: number;
  instanceId: symbol;
}

export default function ListItem({ item, index, instanceId }: ListItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  useEffect(() => {
    const itemElement = itemRef.current;
    const dragHandle = dragHandleRef.current;
    invariant(itemElement);
    invariant(dragHandle);

    return combine(
      draggable({
        element: dragHandle,
        getInitialData: () => ({
          type: 'list-item',
          id: item.id,
          index,
          instanceId,
        }),
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      }),
      dropTargetForElements({
        element: itemElement,
        canDrop: ({ source }) => {
          return (
            source.data.instanceId === instanceId &&
            source.data.type === 'list-item' &&
            source.data.id !== item.id
          );
        },
        getData: ({ input }) => {
          return attachClosestEdge(
            {
              type: 'list-item',
              id: item.id,
              index,
            },
            {
              element: itemElement,
              input,
              allowedEdges: ['top', 'bottom'],
            }
          );
        },
        onDragEnter: ({ self, source }) => {
          if (source.data.id === item.id) {
            setClosestEdge(null);
            return;
          }
          const edge = extractClosestEdge(self.data);
          setClosestEdge(edge);
        },
        onDrag: ({ self, source }) => {
          if (source.data.id === item.id) {
            setClosestEdge(null);
            return;
          }
          const edge = extractClosestEdge(self.data);
          setClosestEdge(edge);
        },
        onDragLeave: () => setClosestEdge(null),
        onDrop: () => setClosestEdge(null),
      })
    );
  }, [item.id, index, instanceId]);

  return (
    <div
      ref={itemRef}
      className={styles.listItem}
      data-testid={`list-item-${item.id}`}
      data-is-dragging={isDragging}
    >
      <div ref={dragHandleRef} className={styles.dragHandle}>
        ⋮⋮
      </div>
      <div className={styles.listItemContent}>{item.label}</div>
      {closestEdge && (
        <div className={styles.dropIndicator} data-edge={closestEdge} />
      )}
    </div>
  );
}
