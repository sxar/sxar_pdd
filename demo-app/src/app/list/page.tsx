'use client';

import { useEffect, useState, useCallback } from 'react';
import PageLayout from '@/components/PageLayout';
import { supabase } from '@/lib/supabase';
import List from './components/List';
import type { ListItem } from './types';
import styles from './list.module.css';

export default function ListPage() {
  const [items, setItems] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchItems() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('list_items')
          .select('*')
          .order('position');

        if (fetchError) throw fetchError;
        setItems(data || []);
      } catch (err) {
        console.error('Error fetching list items:', err);
        setError(err instanceof Error ? err.message : 'Failed to load list');
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, []);

  const updateItemPosition = useCallback(async (itemId: string, newPosition: number) => {
    try {
      const { error: updateError } = await supabase
        .from('list_items')
        .update({ position: newPosition })
        .eq('id', itemId);

      if (updateError) throw updateError;
    } catch (err) {
      console.error('Error updating item position:', err);
    }
  }, []);

  if (loading) {
    return (
      <PageLayout
        title="Sortable List"
        description="Single column list with drag handles and keyboard navigation"
      >
        <div className={styles.loading}>Loading list...</div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout
        title="Sortable List"
        description="Single column list with drag handles and keyboard navigation"
      >
        <div className={styles.error}>{error}</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Sortable List"
      description="Single column list with drag handles and keyboard navigation"
    >
      <List items={items} onUpdate={setItems} onItemMove={updateItemPosition} />
    </PageLayout>
  );
}
