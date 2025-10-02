'use client';

import { useEffect, useState, useCallback } from 'react';
import invariant from 'tiny-invariant';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/types';
import { getReorderDestinationIndex } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index';
import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder';
import type { BoardData, Column as ColumnType, Card as CardType, DragItem } from '../types';
import Column from './Column';
import styles from '../board.module.css';

interface BoardProps {
  data: BoardData;
  onUpdate: (data: BoardData) => void;
  onCardMove: (cardId: string, newColumnId: string, newPosition: number) => void;
  onColumnMove: (columnId: string, newPosition: number) => void;
}

export default function Board({ data, onUpdate, onCardMove, onColumnMove }: BoardProps) {
  const [instanceId] = useState(() => Symbol('board-instance'));

  useEffect(() => {
    return monitorForElements({
      canMonitor({ source }) {
        return source.data.instanceId === instanceId;
      },
      onDrop({ location, source }) {
        const target = location.current.dropTargets[0];
        if (!target) return;

        const sourceData = source.data as unknown as DragItem & { instanceId: symbol };
        const targetData = target.data;

        if (sourceData.type === 'column') {
          handleColumnDrop(sourceData, targetData);
        } else if (sourceData.type === 'card') {
          handleCardDrop(sourceData, targetData);
        }
      },
    });
  }, [data, instanceId]);

  const handleColumnDrop = useCallback((
    sourceData: DragItem & { instanceId: symbol },
    targetData: Record<string | symbol, unknown>
  ) => {
    if (targetData.type !== 'column') return;

    const startIndex = sourceData.index;
    const targetIndex = targetData.index as number;
    const closestEdge = extractClosestEdge(targetData);

    const finishIndex = getReorderDestinationIndex({
      startIndex,
      indexOfTarget: targetIndex,
      closestEdgeOfTarget: closestEdge as Edge | null,
      axis: 'horizontal',
    });

    if (finishIndex === startIndex) return;

    const newColumns = reorder({
      list: data.columns,
      startIndex,
      finishIndex,
    });

    newColumns.forEach((col, idx) => {
      if (col.position !== idx) {
        onColumnMove(col.id, idx);
      }
    });

    onUpdate({
      ...data,
      columns: newColumns.map((col, idx) => ({ ...col, position: idx })),
    });
  }, [data, onUpdate, onColumnMove]);

  const handleCardDrop = useCallback((
    sourceData: DragItem & { instanceId: symbol },
    targetData: Record<string | symbol, unknown>
  ) => {
    const sourceColumnId = sourceData.columnId;
    invariant(sourceColumnId, 'Card must have a column ID');

    if (targetData.type === 'column') {
      const targetColumnId = targetData.columnId as string;
      if (sourceColumnId === targetColumnId) return;

      moveCardToColumn(sourceData.id, sourceColumnId, targetColumnId);
    } else if (targetData.type === 'card') {
      const targetColumnId = targetData.columnId as string;
      const targetIndex = targetData.index as number;
      const closestEdge = extractClosestEdge(targetData);

      if (sourceColumnId === targetColumnId) {
        reorderCardInColumn(sourceData.id, sourceColumnId, sourceData.index, targetIndex, closestEdge);
      } else {
        moveCardBetweenColumns(sourceData.id, sourceColumnId, targetColumnId, targetIndex, closestEdge);
      }
    }
  }, [data, onUpdate, onCardMove]);

  const moveCardToColumn = (cardId: string, sourceColumnId: string, targetColumnId: string) => {
    const newColumns = data.columns.map(col => {
      if (col.id === sourceColumnId) {
        return {
          ...col,
          cards: col.cards.filter(card => card.id !== cardId),
        };
      }
      if (col.id === targetColumnId) {
        const card = data.columns
          .find(c => c.id === sourceColumnId)
          ?.cards.find(c => c.id === cardId);
        if (card) {
          return {
            ...col,
            cards: [...col.cards, { ...card, column_id: targetColumnId, position: col.cards.length }],
          };
        }
      }
      return col;
    });

    onCardMove(cardId, targetColumnId, newColumns.find(c => c.id === targetColumnId)?.cards.length || 0);
    onUpdate({ ...data, columns: newColumns });
  };

  const reorderCardInColumn = (
    cardId: string,
    columnId: string,
    startIndex: number,
    targetIndex: number,
    closestEdge: Edge | null
  ) => {
    const finishIndex = getReorderDestinationIndex({
      startIndex,
      indexOfTarget: targetIndex,
      closestEdgeOfTarget: closestEdge,
      axis: 'vertical',
    });

    if (finishIndex === startIndex) return;

    const newColumns = data.columns.map(col => {
      if (col.id === columnId) {
        const reorderedCards = reorder({
          list: col.cards,
          startIndex,
          finishIndex,
        });
        return { ...col, cards: reorderedCards.map((card, idx) => ({ ...card, position: idx })) };
      }
      return col;
    });

    onCardMove(cardId, columnId, finishIndex);
    onUpdate({ ...data, columns: newColumns });
  };

  const moveCardBetweenColumns = (
    cardId: string,
    sourceColumnId: string,
    targetColumnId: string,
    targetIndex: number,
    closestEdge: Edge | null
  ) => {
    const card = data.columns
      .find(c => c.id === sourceColumnId)
      ?.cards.find(c => c.id === cardId);

    if (!card) return;

    const insertIndex = closestEdge === 'bottom' ? targetIndex + 1 : targetIndex;

    const newColumns = data.columns.map(col => {
      if (col.id === sourceColumnId) {
        return {
          ...col,
          cards: col.cards.filter(c => c.id !== cardId),
        };
      }
      if (col.id === targetColumnId) {
        const newCards = [...col.cards];
        newCards.splice(insertIndex, 0, { ...card, column_id: targetColumnId });
        return {
          ...col,
          cards: newCards.map((c, idx) => ({ ...c, position: idx })),
        };
      }
      return col;
    });

    onCardMove(cardId, targetColumnId, insertIndex);
    onUpdate({ ...data, columns: newColumns });
  };

  return (
    <div className={styles.boardContainer} data-testid="board">
      {data.columns.map((column, index) => (
        <Column
          key={column.id}
          column={column}
          index={index}
          instanceId={instanceId}
        />
      ))}
    </div>
  );
}
