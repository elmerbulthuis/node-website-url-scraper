const { expect } = require('chai');
const URL = require('url');
const Task = require('../../models/Task');
const taskService = require('../../services/taskService');

describe('Task Service tests', async () => {
  it('Create new task, without parent url', async () => {
    const url = 'https://my-test-url.com/';
    const task = taskService.createNewTask(null, url);
    expect(task).to.be.instanceOf(Task);
    expect(task.getUrl()).to.equal(url);
  });

  it('Create new task, with parent url', async () => {
    const url = 'https://my-test-url.com/my/page';
    const task = taskService.createNewTask('https://my-test-url.com', url);
    expect(task).to.be.instanceOf(Task);
    expect(task.getUrl()).to.equal(url);
  });

  it('Create task with url without domain, it should return the url with parent domain', async () => {
    const url = '/my/page';
    const task = taskService.createNewTask('https://my-test-url.com', url);
    expect(task).to.be.instanceOf(Task);
    expect(task.getUrl()).to.equal('https://my-test-url.com/my/page');
  });

  it('Complete an url', async () => {
    const parentUrl = 'https://my-test-url.com';
    const taskUrl = '/my/url?test';
    const completeUrl = taskService.getCompleteTaskUrl(parentUrl, taskUrl);
    expect(completeUrl).to.have.property('host').to.equal('my-test-url.com');
    expect(completeUrl).to.have.property('path').to.equal('/my/url?test');
    expect(completeUrl).to.have.property('protocol').to.equal('https:');
  });

  it('Ensure URL object (input string)', async () => {
    const url = 'https://my-test-url.com';
    const urlObject = taskService.ensureUrlObject(url);
    expect(urlObject).to.have.property('host').to.equal('my-test-url.com');
    expect(urlObject).to.have.property('protocol').to.equal('https:');
  });

  it('Ensure URL object (input parsed URL object)', async () => {
    const url = 'https://my-test-url.com';
    const urlObject = taskService.ensureUrlObject(URL.parse(url));
    expect(urlObject).to.have.property('host').to.equal('my-test-url.com');
    expect(urlObject).to.have.property('protocol').to.equal('https:');
  });

  it('Check for download urls', async () => {
    const task = new Task('https://my-test-url.com/my/site.html');
    const isDownloadLink = taskService.checkForDownloadUrls(task);
    expect(typeof isDownloadLink).to.equal('boolean');
    expect(isDownloadLink).to.equal(false);
  });

  it('Check for download urls 2', async () => {
    const task = new Task('https://my-test-url.com/my/site.asp');
    const isDownloadLink = taskService.checkForDownloadUrls(task);
    expect(typeof isDownloadLink).to.equal('boolean');
    expect(isDownloadLink).to.equal(false);
  });

  it('Check for download urls 3', async () => {
    const task = new Task('https://my-test-url.com/my/site.pdf');
    const isDownloadLink = taskService.checkForDownloadUrls(task);
    expect(typeof isDownloadLink).to.equal('boolean');
    expect(isDownloadLink).to.equal(true);
  });

  it('Check for download urls 4', async () => {
    const task = new Task('https://my-test-url.com/my/site.mp4');
    const isDownloadLink = taskService.checkForDownloadUrls(task);
    expect(typeof isDownloadLink).to.equal('boolean');
    expect(isDownloadLink).to.equal(true);
  });

  it('Check for download urls 5', async () => {
    const task = new Task('https://my-test-url.com/my/site.zip');
    const isDownloadLink = taskService.checkForDownloadUrls(task);
    expect(typeof isDownloadLink).to.equal('boolean');
    expect(isDownloadLink).to.equal(true);
  });

  it('Check for download urls 6', async () => {
    const task = new Task('https://my-test-url.com/my/site.rar');
    const isDownloadLink = taskService.checkForDownloadUrls(task);
    expect(typeof isDownloadLink).to.equal('boolean');
    expect(isDownloadLink).to.equal(true);
  });

  it('Ensure tasks have same domain', async () => {
    const parentUrl = 'https://mydomain.com/my/path';
    const taskUrl = 'https://myd-omain.com/my/path2';
    const sameDomain = taskService.ensureSameDomain(parentUrl, taskUrl);
    expect(typeof sameDomain).to.equal('boolean');
    expect(sameDomain).to.equal(false);
  });

  it('Ensure tasks have same domain 2', async () => {
    const parentUrl = 'https://mydomain.com/my/path';
    const taskUrl = 'https://www.mydomain.com/my/path2/test';
    const sameDomain = taskService.ensureSameDomain(parentUrl, taskUrl);
    expect(typeof sameDomain).to.equal('boolean');
    expect(sameDomain).to.equal(true);
  });
});
