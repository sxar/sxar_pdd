'use client';

import { useEffect, useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { supabase } from '@/lib/supabase';
import Tree from './components/Tree';
import styles from './tree.module.css';

export interface TreeItem {
  id: string;
  label: string;
  parent_id: string | null;
  position: number;
  is_expanded: boolean;
  children: TreeItem[];
}

export default function TreePage() {
  const [treeData, setTreeData] = useState<TreeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTreeData() {
      try {
        const { data, error } = await supabase
          .from('tree_items')
          .select('*')
          .order('position');

        if (error) throw error;

        const buildTree = (items: any[]): TreeItem[] => {
          const itemMap = new Map<string, TreeItem>();
          const rootItems: TreeItem[] = [];

          items.forEach(item => {
            itemMap.set(item.id, { ...item, children: [] });
          });

          items.forEach(item => {
            const treeItem = itemMap.get(item.id)!;
            if (item.parent_id === null) {
              rootItems.push(treeItem);
            } else {
              const parent = itemMap.get(item.parent_id);
              if (parent) {
                parent.children.push(treeItem);
              }
            }
          });

          return rootItems;
        };

        setTreeData(buildTree(data || []));
      } catch (err) {
        console.error('Error fetching tree:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTreeData();
  }, []);

  if (loading) {
    return (
      <PageLayout
        title="Tree Structure"
        description="Hierarchical tree with nested drag and drop"
      >
        <div className={styles.loading}>Loading tree...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Tree Structure"
      description="Hierarchical tree with nested drag and drop"
    >
      <Tree items={treeData} onUpdate={setTreeData} />
    </PageLayout>
  );
}
