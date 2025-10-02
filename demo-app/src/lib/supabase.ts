import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      boards: {
        Row: {
          id: string;
          title: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      columns: {
        Row: {
          id: string;
          board_id: string;
          title: string;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          board_id: string;
          title: string;
          position: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          board_id?: string;
          title?: string;
          position?: number;
          created_at?: string;
        };
      };
      cards: {
        Row: {
          id: string;
          column_id: string;
          title: string;
          description: string | null;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          column_id: string;
          title: string;
          description?: string | null;
          position: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          column_id?: string;
          title?: string;
          description?: string | null;
          position?: number;
          created_at?: string;
        };
      };
      list_items: {
        Row: {
          id: string;
          label: string;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          label: string;
          position: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          label?: string;
          position?: number;
          created_at?: string;
        };
      };
      tree_items: {
        Row: {
          id: string;
          label: string;
          parent_id: string | null;
          position: number;
          is_expanded: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          label: string;
          parent_id?: string | null;
          position: number;
          is_expanded?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          label?: string;
          parent_id?: string | null;
          position?: number;
          is_expanded?: boolean;
          created_at?: string;
        };
      };
      grid_items: {
        Row: {
          id: string;
          src: string;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          src: string;
          position: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          src?: string;
          position?: number;
          created_at?: string;
        };
      };
    };
  };
};
