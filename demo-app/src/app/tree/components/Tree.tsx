'use client';

import { useState } from 'react';
import type { TreeItem } from '../page';
import TreeItemComponent from './TreeItem';
import styles from '../tree.module.css';

interface TreeProps {
  items: TreeItem[];
  onUpdate: (items: TreeItem[]) => void;
}

export default function Tree({ items, onUpdate }: TreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(items.filter(item => item.is_expanded).map(item => item.id))
  );

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className={styles.treeContainer} data-testid="tree">
      {items.map((item) => (
        <TreeItemComponent
          key={item.id}
          item={item}
          level={0}
          isExpanded={expandedIds.has(item.id)}
          onToggle={toggleExpand}
        />
      ))}
    </div>
  );
}
