'use client';

import { useState } from 'react';
import styles from '../table.module.css';

interface TableRow {
  id: string;
  task: string;
  status: 'todo' | 'in-progress' | 'done';
  assignee: string;
}

const initialData: TableRow[] = [
  { id: '1', task: 'Design system updates', status: 'in-progress', assignee: 'Alice' },
  { id: '2', task: 'API documentation', status: 'todo', assignee: 'Bob' },
  { id: '3', task: 'Testing framework', status: 'done', assignee: 'Charlie' },
  { id: '4', task: 'Performance optimization', status: 'in-progress', assignee: 'Diana' },
  { id: '5', task: 'Security audit', status: 'todo', assignee: 'Eve' },
];

export default function SimpleTable() {
  const [rows] = useState<TableRow[]>(initialData);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'todo':
        return styles.statusTodo;
      case 'in-progress':
        return styles.statusInProgress;
      case 'done':
        return styles.statusDone;
      default:
        return '';
    }
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table} data-testid="data-table">
        <thead className={styles.tableHeader}>
          <tr>
            <th style={{ width: '40px' }}></th>
            <th>Task</th>
            <th style={{ width: '150px' }}>Status</th>
            <th style={{ width: '150px' }}>Assignee</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className={styles.tableRow}>
              <td className={styles.dragHandle}>⋮⋮</td>
              <td>{row.task}</td>
              <td>
                <span className={`${styles.status} ${getStatusClass(row.status)}`}>
                  {row.status}
                </span>
              </td>
              <td>{row.assignee}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
