import Link from 'next/link';
import styles from './page.module.css';

const patterns = [
  {
    id: 'board',
    title: 'Board / Kanban',
    description: 'Multi-column board with draggable cards between columns and column reordering',
    path: '/board',
    icon: '📋',
  },
  {
    id: 'list',
    title: 'Sortable List',
    description: 'Single column list with drag handles and keyboard shortcuts for reordering',
    path: '/list',
    icon: '📝',
  },
  {
    id: 'tree',
    title: 'Tree Structure',
    description: 'Hierarchical tree with drag and drop for nested items and level changes',
    path: '/tree',
    icon: '🌳',
  },
  {
    id: 'grid',
    title: 'Grid Layout',
    description: 'Draggable grid items with position swapping and visual feedback',
    path: '/grid',
    icon: '⊞',
  },
  {
    id: 'file',
    title: 'File Upload',
    description: 'External drag adapter for file drops with image previews and validation',
    path: '/file',
    icon: '📁',
  },
  {
    id: 'table',
    title: 'Data Table',
    description: 'Sortable table with row and column reordering and sticky headers',
    path: '/table',
    icon: '📊',
  },
];

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          Pragmatic Drag and Drop Demo
        </h1>
        <p className={styles.subtitle}>
          Comprehensive demonstration of all drag and drop patterns
        </p>
      </header>

      <main className={styles.main}>
        <div className={styles.grid}>
          {patterns.map((pattern) => (
            <Link
              key={pattern.id}
              href={pattern.path}
              className={styles.card}
              data-testid={`pattern-card-${pattern.id}`}
            >
              <div className={styles.cardIcon}>{pattern.icon}</div>
              <h2 className={styles.cardTitle}>{pattern.title}</h2>
              <p className={styles.cardDescription}>{pattern.description}</p>
            </Link>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <p>
          Built with{' '}
          <a
            href="https://atlassian.design/components/pragmatic-drag-and-drop/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Pragmatic drag and drop
          </a>
        </p>
      </footer>
    </div>
  );
}
