'use client';

import type { TreeItem } from '../page';
import styles from '../tree.module.css';

interface TreeItemProps {
  item: TreeItem;
  level: number;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}

export default function TreeItemComponent({ item, level, isExpanded, onToggle }: TreeItemProps) {
  const hasChildren = item.children && item.children.length > 0;
  const icon = item.children.length > 0 ? '📁' : '📄';

  return (
    <div>
      <div className={styles.treeItem} style={{ paddingLeft: `${level * 1.5}rem` }}>
        {hasChildren ? (
          <button
            className={styles.expandButton}
            onClick={() => onToggle(item.id)}
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        ) : (
          <span className={styles.expandButton} />
        )}
        <span className={styles.icon}>{icon}</span>
        <span className={styles.label}>{item.label}</span>
      </div>
      {isExpanded && hasChildren && (
        <div className={styles.children}>
          {item.children.map((child) => (
            <TreeItemComponent
              key={child.id}
              item={child}
              level={level + 1}
              isExpanded={false}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
