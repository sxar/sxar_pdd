'use client';

import { useEffect, useState, useCallback } from 'react';
import PageLayout from '@/components/PageLayout';
import { supabase } from '@/lib/supabase';
import Board from './components/Board';
import type { BoardData, Column, Card } from './types';
import styles from './board.module.css';

export default function BoardPage() {
  const [boardData, setBoardData] = useState<BoardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBoardData() {
      try {
        setLoading(true);

        const { data: boards, error: boardError } = await supabase
          .from('boards')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (boardError) throw boardError;
        if (!boards) throw new Error('No board found');

        const { data: columns, error: columnsError } = await supabase
          .from('columns')
          .select('*')
          .eq('board_id', boards.id)
          .order('position');

        if (columnsError) throw columnsError;

        const { data: cards, error: cardsError } = await supabase
          .from('cards')
          .select('*')
          .in('column_id', (columns || []).map(c => c.id))
          .order('position');

        if (cardsError) throw cardsError;

        const columnsWithCards: Column[] = (columns || []).map(column => ({
          ...column,
          cards: (cards || []).filter(card => card.column_id === column.id),
        }));

        setBoardData({
          ...boards,
          columns: columnsWithCards,
        });
      } catch (err) {
        console.error('Error fetching board data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load board');
      } finally {
        setLoading(false);
      }
    }

    fetchBoardData();
  }, []);

  const updateCardPosition = useCallback(async (
    cardId: string,
    newColumnId: string,
    newPosition: number
  ) => {
    try {
      const { error } = await supabase
        .from('cards')
        .update({ column_id: newColumnId, position: newPosition })
        .eq('id', cardId);

      if (error) throw error;
    } catch (err) {
      console.error('Error updating card position:', err);
    }
  }, []);

  const updateColumnPosition = useCallback(async (
    columnId: string,
    newPosition: number
  ) => {
    try {
      const { error } = await supabase
        .from('columns')
        .update({ position: newPosition })
        .eq('id', columnId);

      if (error) throw error;
    } catch (err) {
      console.error('Error updating column position:', err);
    }
  }, []);

  if (loading) {
    return (
      <PageLayout
        title="Board / Kanban"
        description="Multi-column board with draggable cards and column reordering"
      >
        <div className={styles.loading}>Loading board...</div>
      </PageLayout>
    );
  }

  if (error || !boardData) {
    return (
      <PageLayout
        title="Board / Kanban"
        description="Multi-column board with draggable cards and column reordering"
      >
        <div className={styles.error}>
          {error || 'Failed to load board data'}
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Board / Kanban"
      description="Multi-column board with draggable cards and column reordering"
    >
      <Board
        data={boardData}
        onUpdate={setBoardData}
        onCardMove={updateCardPosition}
        onColumnMove={updateColumnPosition}
      />
    </PageLayout>
  );
}
