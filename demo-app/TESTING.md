# Testing Guide for Pragmatic Drag and Drop Demo

This document provides information about testing the demo application, including test selectors and interaction patterns.

## Test Selectors

All interactive elements include `data-testid` attributes for easy identification in UI tests:

### Home Page
- `pattern-card-board` - Board/Kanban pattern card
- `pattern-card-list` - List pattern card
- `pattern-card-tree` - Tree pattern card
- `pattern-card-grid` - Grid pattern card
- `pattern-card-file` - File upload pattern card
- `pattern-card-table` - Table pattern card

### Board Pattern
- `board` - Board container
- `column-{columnId}` - Individual column (e.g., `column-550e8400-e29b-41d4-a716-446655440001`)
- `card-{cardId}` - Individual card

### List Pattern
- `sortable-list` - List container
- `list-item-{itemId}` - Individual list item

### Tree Pattern
- `tree` - Tree container

### Grid Pattern
- `grid` - Grid container
- `grid-item-{src}` - Individual grid item (identified by image source)

### File Upload Pattern
- `file-drop-zone` - File drop zone
- `uploaded-file` - Uploaded file preview card

### Table Pattern
- `data-table` - Table container

## Test Scenarios

### Board/Kanban

1. **Card Reordering within Column**
   - Drag a card within the same column
   - Verify drop indicator appears above/below target card
   - Verify card position updates in database

2. **Card Movement between Columns**
   - Drag a card from one column to another
   - Verify card moves to new column
   - Verify database updates column_id and position

3. **Column Reordering**
   - Drag a column by its header
   - Verify columns reorder horizontally
   - Verify database updates column positions

### Sortable List

1. **Item Reordering**
   - Grab item by drag handle (⋮⋮)
   - Move to new position
   - Verify drop indicator shows insertion point
   - Verify list updates and database persists position

2. **Drag Handle Interaction**
   - Verify drag only works from handle, not entire item
   - Test cursor changes (grab → grabbing)

### Grid

1. **Position Swapping**
   - Drag grid item over another
   - Verify hover state (rotation and scale)
   - Verify items swap positions
   - Verify database updates positions

2. **Visual Feedback**
   - Dragging item shows opacity reduction
   - Target item shows scale and rotation
   - Smooth transition animations

### File Upload

1. **External Drag and Drop**
   - Drag image file from desktop
   - Verify drop zone shows "potential" state (blue border)
   - Verify drop zone shows "over" state when file hovers
   - Verify file appears in gallery after drop

2. **Manual File Selection**
   - Click "Select Files" button
   - Choose images from file picker
   - Verify images appear in gallery

3. **File Validation**
   - Only image files should be processed
   - Non-image files should be ignored
   - File name and size should display correctly

### Tree

1. **Node Expansion/Collapse**
   - Click expand/collapse button
   - Verify children visibility toggles
   - Verify correct icon (▶ or ▼)

2. **Visual Hierarchy**
   - Verify indentation increases with nesting level
   - Folder icon (📁) for parent nodes
   - File icon (📄) for leaf nodes

### Table

1. **Visual Rendering**
   - Verify table headers display correctly
   - Verify status badges have correct colors
   - Verify drag handles are visible

## Testing with Playwright

Example test structure:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Board Pattern', () => {
  test('should reorder cards within a column', async ({ page }) => {
    await page.goto('/board');

    // Wait for board to load
    await page.waitForSelector('[data-testid="board"]');

    // Get first and second card
    const firstCard = page.locator('[data-testid^="card-"]').first();
    const secondCard = page.locator('[data-testid^="card-"]').nth(1);

    // Drag first card below second card
    await firstCard.dragTo(secondCard);

    // Verify order changed
    // Add assertions here
  });
});
```

## Testing with Cypress

Example test structure:

```typescript
describe('List Pattern', () => {
  beforeEach(() => {
    cy.visit('/list');
  });

  it('should reorder list items', () => {
    cy.get('[data-testid="sortable-list"]').should('be.visible');

    // Get list items
    cy.get('[data-testid^="list-item-"]').first().as('firstItem');
    cy.get('[data-testid^="list-item-"]').eq(2).as('thirdItem');

    // Perform drag
    cy.get('@firstItem').find('.dragHandle').trigger('dragstart');
    cy.get('@thirdItem').trigger('drop');

    // Verify reorder
    // Add assertions here
  });
});
```

## Database Testing

### Verify Persistence

After drag and drop operations, verify database updates:

```typescript
test('should persist card position to database', async ({ page }) => {
  // Perform drag operation
  // ...

  // Wait for database update
  await page.waitForTimeout(500);

  // Refresh page
  await page.reload();

  // Verify card is still in new position
  // Add assertions here
});
```

## Accessibility Testing

### Keyboard Navigation

1. **Tab Navigation**
   - Tab through all interactive elements
   - Verify focus indicators are visible
   - Verify logical tab order

2. **Drag Handle Accessibility**
   - Drag handles should be keyboard accessible
   - Verify ARIA labels are present
   - Test screen reader announcements

## Performance Testing

### Large Dataset Testing

1. Modify seed data to include more items
2. Test drag performance with 100+ cards
3. Verify smooth animations
4. Check for memory leaks during repeated operations

## Mobile Testing

### Touch Interactions

1. **Touch Drag**
   - Verify touch start initiates drag
   - Verify touch move updates position
   - Verify touch end completes drop

2. **Responsive Layout**
   - Test on mobile viewport (375x667)
   - Test on tablet viewport (768x1024)
   - Verify touch targets are adequately sized

## Cross-Browser Testing

Test in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- iOS Safari
- Android Chrome

## Common Test Patterns

### Wait for Drag Operation

```typescript
// Wait for drop indicator to appear
await page.waitForSelector('[class*="dropIndicator"]');

// Wait for animation to complete
await page.waitForTimeout(300);
```

### Verify Database Update

```typescript
// Check if position was updated
const { data } = await supabase
  .from('cards')
  .select('position')
  .eq('id', cardId)
  .single();

expect(data.position).toBe(expectedPosition);
```

### Simulate External File Drop

```typescript
const dataTransfer = await page.evaluateHandle(() => new DataTransfer());
const input = await page.locator('input[type="file"]');
await input.setInputFiles(['path/to/test-image.jpg']);
```

## Debugging Tips

1. **Visual Debugging**
   - Add `{ headless: false }` to see browser during tests
   - Use `page.pause()` to inspect state
   - Take screenshots: `await page.screenshot({ path: 'debug.png' })`

2. **Network Debugging**
   - Monitor Supabase API calls
   - Verify request/response payloads
   - Check for rate limiting

3. **State Debugging**
   - Log component state before/after drag
   - Verify drop target detection
   - Check event listener attachment

## Continuous Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npx playwright install
      - run: npx playwright test
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_KEY }}
```
