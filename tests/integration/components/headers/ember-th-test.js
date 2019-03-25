import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import { generateTableValues } from '../../../helpers/generate-table';
import TablePage from 'ember-table/test-support/pages/ember-table';

let table = new TablePage();

moduleForComponent('ember-th', '[Unit] ember-th', { integration: true });

test('A header cell accepts a block', async function(assert) {
  assert.expect(4);

  let columns = [
    {
      name: 'Name',
      valuePath: 'name',
      isAscending: false,
      isSortable: true,
    },
    {
      name: 'Age',
      valuePath: 'age',
    },
  ];

  let rows = [{ name: 'Zoe', age: 34 }, { name: 'Alex', age: 43 }, { name: 'Liz', age: 25 }];
  generateTableValues(this, { columns, rows });

  let firstHeader = table.headers.objectAt(0);

  await this.render(hbs`
  {{#ember-table data-test-ember-table=true as |t|}}
    {{#ember-thead
      api=t
      columns=columns
      sorts=sorts

      onUpdateSorts="onUpdateSorts"

      as |h|}}
      {{#ember-tr api=h as |r|}}
        {{#ember-th api=r as |column|}}
          <div data-test-block>
            {{column.name}}
          </div>
        {{/ember-th}}
      {{/ember-tr}}
    {{/ember-thead}}

    {{ember-tbody api=t rows=rows}}
  {{/ember-table}}
  `);
  await firstHeader.click();

  assert.equal(this.$('th [data-test-block]').length, 2, 'Header cells render passed block');
  assert.ok(!firstHeader.sortIndicator.isPresent, 'No sort indicator is rendered');
  assert.equal(this.$('th .et-sort-toggle').length, 0, 'No sort toggle is rendered');
  assert.equal(this.$('th .et-header-resize-area').length, 0, 'No resize area is rendered');
});
