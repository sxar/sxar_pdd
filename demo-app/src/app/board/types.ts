export interface Card {
  id: string;
  column_id: string;
  title: string;
  description: string | null;
  position: number;
  created_at: string;
}

export interface Column {
  id: string;
  board_id: string;
  title: string;
  position: number;
  created_at: string;
  cards: Card[];
}

export interface BoardData {
  id: string;
  title: string;
  columns: Column[];
  created_at: string;
  updated_at: string;
}

export interface DragItem {
  type: 'card' | 'column';
  id: string;
  columnId?: string;
  index: number;
}
