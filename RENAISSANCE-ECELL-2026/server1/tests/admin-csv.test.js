import test from 'node:test';
import assert from 'node:assert/strict';
import { csvCell } from '../../client/src/lib/admin-csv.js';
test('CSV export quotes delimiters and neutralizes formula injection', () => {
  assert.equal(csvCell('Name, "Quoted"\nLine'), '"Name, ""Quoted""\nLine"');
  for (const value of ['=1+1', ' +SUM(A1)', '-1+1', '@evil', '\t=cmd', '\rtext']) assert(csvCell(value).startsWith('"\''));
  assert.equal(csvCell(null), '""');
  assert.equal(csvCell(42), '"42"');
});
