'use client';

import { useEffect, useRef, useState } from 'react';
import invariant from 'tiny-invariant';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { attachClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import type { Column as ColumnType } from '../types';
import Card from './Card';
import styles from '../board.module.css';

interface ColumnProps {
  column: ColumnType;
  index: number;
  instanceId: symbol;
}

export default function Column({ column, index, instanceId }: ColumnProps) {
  const columnRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    const columnElement = columnRef.current;
    const headerElement = headerRef.current;
    invariant(columnElement);
    invariant(headerElement);

    return combine(
      draggable({
        element: headerElement,
        getInitialData: () => ({
          type: 'column',
          id: column.id,
          index,
          instanceId,
        }),
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      }),
      dropTargetForElements({
        element: columnElement,
        canDrop: ({ source }) => {
          return (
            source.data.instanceId === instanceId &&
            (source.data.type === 'column' || source.data.type === 'card')
          );
        },
        getData: ({ input }) => {
          return attachClosestEdge(
            {
              type: 'column',
              columnId: column.id,
              index,
            },
            {
              element: columnElement,
              input,
              allowedEdges: ['left', 'right'],
            }
          );
        },
        onDragEnter: () => setIsOver(true),
        onDragLeave: () => setIsOver(false),
        onDrop: () => setIsOver(false),
      })
    );
  }, [column.id, index, instanceId]);

  return (
    <div
      ref={columnRef}
      className={styles.column}
      data-testid={`column-${column.id}`}
      data-is-dragging={isDragging}
      data-is-over={isOver}
    >
      <div ref={headerRef} className={styles.columnHeader}>
        <h3 className={styles.columnTitle}>{column.title}</h3>
        <span className={styles.columnCount}>{column.cards.length}</span>
      </div>
      <div className={styles.cardsContainer}>
        {column.cards.length === 0 ? (
          <div className={styles.emptyColumn}>Drop cards here</div>
        ) : (
          column.cards.map((card, cardIndex) => (
            <Card
              key={card.id}
              card={card}
              columnId={column.id}
              index={cardIndex}
              instanceId={instanceId}
            />
          ))
        )}
      </div>
    </div>
  );
}
