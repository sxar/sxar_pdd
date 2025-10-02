'use client';

import { useEffect, useRef, useState } from 'react';
import invariant from 'tiny-invariant';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { attachClosestEdge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/types';
import type { Card as CardType } from '../types';
import styles from '../board.module.css';

interface CardProps {
  card: CardType;
  columnId: string;
  index: number;
  instanceId: symbol;
}

export default function Card({ card, columnId, index, instanceId }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  useEffect(() => {
    const cardElement = cardRef.current;
    invariant(cardElement);

    return combine(
      draggable({
        element: cardElement,
        getInitialData: () => ({
          type: 'card',
          id: card.id,
          columnId,
          index,
          instanceId,
        }),
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      }),
      dropTargetForElements({
        element: cardElement,
        canDrop: ({ source }) => {
          return (
            source.data.instanceId === instanceId &&
            source.data.type === 'card' &&
            source.data.id !== card.id
          );
        },
        getData: ({ input }) => {
          return attachClosestEdge(
            {
              type: 'card',
              id: card.id,
              columnId,
              index,
            },
            {
              element: cardElement,
              input,
              allowedEdges: ['top', 'bottom'],
            }
          );
        },
        onDragEnter: ({ self }) => {
          const edge = extractClosestEdge(self.data);
          setClosestEdge(edge);
        },
        onDrag: ({ self }) => {
          const edge = extractClosestEdge(self.data);
          setClosestEdge(edge);
        },
        onDragLeave: () => setClosestEdge(null),
        onDrop: () => setClosestEdge(null),
      })
    );
  }, [card.id, columnId, index, instanceId]);

  return (
    <div
      ref={cardRef}
      className={styles.card}
      data-testid={`card-${card.id}`}
      data-is-dragging={isDragging}
    >
      <div className={styles.cardTitle}>{card.title}</div>
      {card.description && (
        <div className={styles.cardDescription}>{card.description}</div>
      )}
      {closestEdge && (
        <div
          className={styles.dropIndicator}
          data-edge={closestEdge}
        />
      )}
    </div>
  );
}
