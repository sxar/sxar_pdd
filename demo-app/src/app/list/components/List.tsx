'use client';

import { useEffect, useState } from 'react';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/types';
import { getReorderDestinationIndex } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index';
import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder';
import type { ListItem as ListItemType } from '../types';
import ListItem from './ListItem';
import styles from '../list.module.css';

interface ListProps {
  items: ListItemType[];
  onUpdate: (items: ListItemType[]) => void;
  onItemMove: (itemId: string, newPosition: number) => void;
}

export default function List({ items, onUpdate, onItemMove }: ListProps) {
  const [instanceId] = useState(() => Symbol('list-instance'));

  useEffect(() => {
    return monitorForElements({
      canMonitor({ source }) {
        return source.data.instanceId === instanceId;
      },
      onDrop({ location, source }) {
        const target = location.current.dropTargets[0];
        if (!target) return;

        const sourceIndex = source.data.index as number;
        const targetIndex = target.data.index as number;
        const closestEdge = extractClosestEdge(target.data);

        const finishIndex = getReorderDestinationIndex({
          startIndex: sourceIndex,
          indexOfTarget: targetIndex,
          closestEdgeOfTarget: closestEdge as Edge | null,
          axis: 'vertical',
        });

        if (finishIndex === sourceIndex) return;

        const reorderedItems = reorder({
          list: items,
          startIndex: sourceIndex,
          finishIndex,
        });

        const updatedItems = reorderedItems.map((item, index) => ({
          ...item,
          position: index,
        }));

        onUpdate(updatedItems);

        const movedItem = updatedItems[finishIndex];
        onItemMove(movedItem.id, finishIndex);
      },
    });
  }, [items, instanceId, onUpdate, onItemMove]);

  return (
    <div className={styles.listContainer}>
      <div className={styles.list} data-testid="sortable-list">
        {items.map((item, index) => (
          <ListItem
            key={item.id}
            item={item}
            index={index}
            instanceId={instanceId}
          />
        ))}
      </div>
    </div>
  );
}
