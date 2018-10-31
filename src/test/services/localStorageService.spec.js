const { expect } = require('chai');
const localStorageService = require('../../services/localStorageService');

describe('Local Storage tests', async () => {
  before(() => {
    localStorageService.addItem('item1', { myfield1: 't1' });
    localStorageService.addItem('item3', { myfield1: 't2' });
    localStorageService.addItem('item2', { myfield1: 't3' });
  });

  it('Get item', async () => {
    const item = localStorageService.getItem('item1');
    expect(item).to.have.property('myfield1').to.equal('t1');
  });

  it('Get non existing item', async () => {
    const item = localStorageService.getItem('item4');
    expect(item).to.equal(undefined);
  });

  it('Get item without param', async () => {
    const item = localStorageService.getItem();
    expect(item).to.equal(undefined);
  });

  it('Get all items', async () => {
    const items = localStorageService.getAll();
    expect(items).to.have.length(3);
    expect(items).to.include.deep.members([{ key: 'item1', value: { myfield1: 't1' } }]);
  });

  it('Add item', async () => {
    const testObject = { test: 'success' };
    localStorageService.addItem('testitem1', testObject);
    expect(localStorageService.getItem('testitem1')).to.deep.equal(testObject);
  });
});
