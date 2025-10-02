'use client';

import { useEffect, useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { supabase } from '@/lib/supabase';
import Grid from './components/Grid';
import styles from './grid.module.css';

const defaultImages = [
  'https://images.pexels.com/photos/1170686/pexels-photo-1170686.jpeg?w=300',
  'https://images.pexels.com/photos/1181357/pexels-photo-1181357.jpeg?w=300',
  'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?w=300',
  'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?w=300',
  'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?w=300',
  'https://images.pexels.com/photos/1758531/pexels-photo-1758531.jpeg?w=300',
];

interface GridItem {
  id: string;
  src: string;
  position: number;
}

export default function GridPage() {
  const [items, setItems] = useState<GridItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGridItems() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('grid_items')
          .select('*')
          .order('position');

        if (error) throw error;

        if (!data || data.length === 0) {
          const initialItems = defaultImages.map((src, index) => ({
            src,
            position: index,
          }));

          const { data: insertedData, error: insertError } = await supabase
            .from('grid_items')
            .insert(initialItems)
            .select();

          if (insertError) throw insertError;
          setItems(insertedData || []);
        } else {
          setItems(data);
        }
      } catch (err) {
        console.error('Error with grid items:', err);
        setItems(defaultImages.map((src, index) => ({
          id: `temp-${index}`,
          src,
          position: index,
        })));
      } finally {
        setLoading(false);
      }
    }

    fetchGridItems();
  }, []);

  const updatePositions = async (updatedItems: GridItem[]) => {
    try {
      for (const item of updatedItems) {
        await supabase
          .from('grid_items')
          .update({ position: item.position })
          .eq('id', item.id);
      }
    } catch (err) {
      console.error('Error updating grid positions:', err);
    }
  };

  if (loading) {
    return (
      <PageLayout
        title="Grid Layout"
        description="Draggable grid with position swapping"
      >
        <div className={styles.loading}>Loading grid...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Grid Layout"
      description="Draggable grid with position swapping"
    >
      <Grid items={items} onUpdate={setItems} onPositionUpdate={updatePositions} />
    </PageLayout>
  );
}
