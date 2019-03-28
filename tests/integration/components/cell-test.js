import { module, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import { generateTable, generateColumns } from '../../helpers/generate-table';
import { componentModule } from '../../helpers/module';
import { set, get } from '@ember/object';

import { fillIn } from 'ember-native-dom-helpers';
import wait from 'ember-test-helpers/wait';

import TablePage from 'ember-table/test-support/pages/ember-table';
import { run } from '@ember/runloop';
import Ember from 'ember';

let table = new TablePage();

module('Integration | cell', function() {
  componentModule('basic', function() {
    test('sends onClick action', async function(assert) {
      this.on(
        'onCellClick',
        ({ event, cellValue, cellMeta, columnValue, columnMeta, rowValue, rowMeta }) => {
          assert.ok(event, 'event sent');

          assert.equal(cellValue, '0A', 'cellValue sent');
          assert.ok(cellMeta, 'cellMeta sent');

          assert.equal(columnValue.name, 'A', 'columnValue sent');
          assert.ok(columnMeta, 'columnMeta sent');

          assert.ok(rowValue, 'rowValue sent');
          assert.ok(rowMeta, 'rowMeta sent');
        }
      );

      await generateTable(this);
      await table.getCell(0, 0).click();
    });

    test('sends onDoubleClick action', async function(assert) {
      this.on(
        'onCellDoubleClick',
        ({ event, cellValue, cellMeta, columnValue, columnMeta, rowValue, rowMeta }) => {
          assert.ok(event, 'event sent');

          assert.equal(cellValue, '0A', 'cellValue sent');
          assert.ok(cellMeta, 'cellMeta sent');

          assert.equal(columnValue.name, 'A', 'columnValue sent');
          assert.ok(columnMeta, 'columnMeta sent');

          assert.ok(rowValue, 'rowValue sent');
          assert.ok(rowMeta, 'rowMeta sent');
        }
      );

      await generateTable(this);
      await table.getCell(0, 0).doubleClick();
    });
  });

  componentModule('mutation', function() {
    test('it updates cell values when changed externally', async function(assert) {
      let columnCount = 2;
      let rows = [
        {
          A: 'A',
          B: 'B',
        },
      ];

      await generateTable(this, { rows, columnCount });

      assert.equal(table.getCell(0, 0).text, 'A', 'renders correct initial value');
      assert.equal(table.getCell(0, 1).text, 'B', 'renders correct initial value');

      run(() => {
        set(rows[0], 'A', 'Y');
        set(rows[0], 'B', 'Z');
      });

      await wait();

      assert.equal(table.getCell(0, 0).text, 'Y', 'renders correct updated value');
      assert.equal(table.getCell(0, 1).text, 'Z', 'renders correct updated value');
    });

    test('Can update cell values directly', async function(assert) {
      let columnCount = 1;
      let rows = [
        {
          A: 'A',
        },
      ];

      this.set('columns', generateColumns(columnCount));
      this.set('rows', rows);

      this.render(hbs`
        <div id="container" style="height: 500px;">
          {{#ember-table as |t|}}
            {{ember-thead api=t columns=columns}}

            {{#ember-tbody api=t rows=rows as |b|}}
              {{#ember-tr api=b as |r|}}
                {{#ember-td api=r as |cellValue|}}
                  {{input value=cellValue}}
                {{/ember-td}}
              {{/ember-tr}}
            {{/ember-tbody}}
          {{/ember-table}}
        </div>
      `);

      await wait();

      fillIn('input', 'Z');

      assert.equal(get(rows[0], 'A'), 'Z', 'value updated successfully');
    });

    test('check whether default rowHeight is 32 or not', async function(assert) {
      let columnCount = 1;
      let rows = [
        {
          A: 'A',
        },
      ];

      this.set('columns', generateColumns(columnCount));
      this.set('rows', rows);

      this.render(hbs`
        <div id="container" style="height: 500px;">
          {{#ember-table as |t|}}
            {{ember-thead api=t columns=columns}}

            {{#ember-tbody api=t rows=rows as |b|}}
              {{#ember-tr api=b as |r|}}
                {{#ember-td class='hellow' api=r as |cellValue|}}
                  {{cellValue}}
                {{/ember-td}}
              {{/ember-tr}}
            {{/ember-tbody}}
          {{/ember-table}}
        </div>
      `);

      await wait();


      assert.equal(document.querySelector('.hellow').style.height, '32px');
    });

    test('add custom row height', async function(assert) {
      let columnCount = 1;
      let rows = [
        {
          A: 'A',
        },
      ];

      this.set('columns', generateColumns(columnCount));
      this.set('rows', rows);

      this.render(hbs`
        <div id="container" style="height: 500px;">
          {{#ember-table as |t|}}
            {{ember-thead api=t columns=columns}}

            {{#ember-tbody api=t rows=rows as |b|}}
              {{#ember-tr api=b as |r|}}
                {{#ember-td  rowHeight=56 class='hellow' api=r as |cellValue|}}
                  {{cellValue}}
                {{/ember-td}}
              {{/ember-tr}}
            {{/ember-tbody}}
          {{/ember-table}}
        </div>
      `);

      await wait();


      assert.equal(document.querySelector('.hellow').style.height, '56px');
    });

    test('selected cell on td click', async function(assert) {
      this.on(
        'onCellClick',
        ({ event, cellValue, cellMeta, columnValue, columnMeta, rowValue, rowMeta }) => {
          console.log(event)
           Ember.set(cellMeta,'selectedCell',true)
        }
      );

      await generateTable(this);
      await table.getCell(0, 0).click();
      await wait();
      assert.ok(document.querySelector('.selectedCell'))
    });
  });
});
