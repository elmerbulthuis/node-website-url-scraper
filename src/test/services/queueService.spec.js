const {expect} = require('chai');
const Task = require('../../models/Task');
const queueService = require('../../services/queueService');

describe('Queue Service tests', async () => {
  before(() => {
    queueService.addTask(new Task('https://testurl-1.com'));
    queueService.addTask(new Task('https://testurl-2.com'));
    queueService.addTask(new Task('https://testurl-3.com'));
  });

  it('Get queue length', async () => {
    const queueLength = queueService.getQueueLength();
    expect(queueLength).to.equal(3);
  });

  it('Add task', async () => {
    const task = new Task('https://custom-url-1.com');
    queueService.addTask(task);
    const insertedTask = queueService.findTask(task);
    const queueLength = queueService.getQueueLength();
    expect(insertedTask).to.be.instanceOf(Task);
    expect(insertedTask).to.equal(task);
    expect(queueLength).to.equal(4);
  });

  it('Find task', async () => {
    const task = new Task('https://custom-url-2.com');
    queueService.addTask(task);
    const insertedTask = queueService.findTask(task);
    expect(insertedTask).to.be.instanceOf(Task);
    expect(insertedTask).to.equal(task);
  });

  it('Get default amount of tasks from queue (1)', async () => {
    const tasks = queueService.getTasks();
    expect(tasks).to.be.instanceOf(Array);
    expect(tasks).to.have.length(1);
    const newQueueLength = queueService.getQueueLength();
    expect(newQueueLength).to.equal(4);
  });

  it('Get 4 tasks from queue', async () => {
    const tasks = queueService.getTasks(4);
    expect(tasks).to.be.instanceOf(Array);
    expect(tasks).to.have.length(4);
    const newQueueLength = queueService.getQueueLength();
    expect(newQueueLength).to.equal(0);
  });

  it('Get 0 tasks from empty queue', async () => {
    const tasks = queueService.getTasks(10);
    expect(tasks).to.be.instanceOf(Array);
    expect(tasks).to.have.length(0);
    const newQueueLength = queueService.getQueueLength();
    expect(newQueueLength).to.equal(0);
  });


});
