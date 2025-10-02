/*
  # Initial Database Schema for Pragmatic Drag and Drop Demo

  ## Overview
  This migration creates the foundational tables for all drag and drop use cases:
  - Board/Kanban pattern (boards, columns, cards)
  - List pattern (list_items)
  - Tree pattern (tree_items)
  - Grid pattern (grid_items)

  ## Tables Created

  ### 1. boards
  - `id` (uuid, primary key)
  - `title` (text) - Board name
  - `created_at` (timestamptz) - When board was created
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. columns
  - `id` (uuid, primary key)
  - `board_id` (uuid, foreign key) - Reference to boards table
  - `title` (text) - Column name
  - `position` (integer) - Column order position
  - `created_at` (timestamptz) - Creation timestamp

  ### 3. cards
  - `id` (uuid, primary key)
  - `column_id` (uuid, foreign key) - Reference to columns table
  - `title` (text) - Card title
  - `description` (text, nullable) - Card description
  - `position` (integer) - Card order within column
  - `created_at` (timestamptz) - Creation timestamp

  ### 4. list_items
  - `id` (uuid, primary key)
  - `label` (text) - Item label
  - `position` (integer) - Item order position
  - `created_at` (timestamptz) - Creation timestamp

  ### 5. tree_items
  - `id` (uuid, primary key)
  - `label` (text) - Tree node label
  - `parent_id` (uuid, nullable, foreign key) - Parent node reference
  - `position` (integer) - Position among siblings
  - `is_expanded` (boolean) - Node expansion state
  - `created_at` (timestamptz) - Creation timestamp

  ### 6. grid_items
  - `id` (uuid, primary key)
  - `src` (text) - Image source URL
  - `position` (integer) - Grid position
  - `created_at` (timestamptz) - Creation timestamp

  ## Security
  All tables have RLS enabled with policies that allow public access for demo purposes.
  In a production environment, these would be restricted to authenticated users.
*/

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create boards table
CREATE TABLE IF NOT EXISTS boards (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create columns table
CREATE TABLE IF NOT EXISTS columns (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  board_id uuid NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  title text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create cards table
CREATE TABLE IF NOT EXISTS cards (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  column_id uuid NOT NULL REFERENCES columns(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create list_items table
CREATE TABLE IF NOT EXISTS list_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  label text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create tree_items table
CREATE TABLE IF NOT EXISTS tree_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  label text NOT NULL,
  parent_id uuid REFERENCES tree_items(id) ON DELETE CASCADE,
  position integer NOT NULL DEFAULT 0,
  is_expanded boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create grid_items table
CREATE TABLE IF NOT EXISTS grid_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  src text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_columns_board_id ON columns(board_id);
CREATE INDEX IF NOT EXISTS idx_columns_position ON columns(position);
CREATE INDEX IF NOT EXISTS idx_cards_column_id ON cards(column_id);
CREATE INDEX IF NOT EXISTS idx_cards_position ON cards(position);
CREATE INDEX IF NOT EXISTS idx_list_items_position ON list_items(position);
CREATE INDEX IF NOT EXISTS idx_tree_items_parent_id ON tree_items(parent_id);
CREATE INDEX IF NOT EXISTS idx_tree_items_position ON tree_items(position);
CREATE INDEX IF NOT EXISTS idx_grid_items_position ON grid_items(position);

-- Enable Row Level Security
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE tree_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE grid_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (demo purposes)
-- In production, these would check auth.uid() for user-specific access

CREATE POLICY "Allow public read access to boards"
  ON boards FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to boards"
  ON boards FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to boards"
  ON boards FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from boards"
  ON boards FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Allow public read access to columns"
  ON columns FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to columns"
  ON columns FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to columns"
  ON columns FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from columns"
  ON columns FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Allow public read access to cards"
  ON cards FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to cards"
  ON cards FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to cards"
  ON cards FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from cards"
  ON cards FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Allow public read access to list_items"
  ON list_items FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to list_items"
  ON list_items FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to list_items"
  ON list_items FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from list_items"
  ON list_items FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Allow public read access to tree_items"
  ON tree_items FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to tree_items"
  ON tree_items FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to tree_items"
  ON tree_items FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from tree_items"
  ON tree_items FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Allow public read access to grid_items"
  ON grid_items FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to grid_items"
  ON grid_items FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to grid_items"
  ON grid_items FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from grid_items"
  ON grid_items FOR DELETE
  TO public
  USING (true);
