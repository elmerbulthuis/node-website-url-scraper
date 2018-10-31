const { expect } = require('chai');
const { readFileSync } = require('fs');
const sinon = require('sinon');
const Page = require('../../models/Page');
const pageCrawlService = require('../../services/pageCrawlService');

const mockedHtmlPage = readFileSync('./src/test/mocks/htmlPageMock.txt');


describe('Page crawl service tests', async () => {
  before(() => {
    sinon.stub(pageCrawlService, 'getPage').callsFake(() => Promise.resolve({
      requestTime: 205,
      statusCode: 200,
      page: mockedHtmlPage
    }));
  });

  it('Get page size', async () => {
    const result = pageCrawlService.getPageSize(mockedHtmlPage);
    expect(result).to.equal(57304);
  });

  it('Get page as cheerio', async () => {
    const result = pageCrawlService.getCheerioPage(mockedHtmlPage);
    expect(result).to.have.property('root');
    expect(result).to.have.property('load');
    expect(result).to.have.property('text');
    expect(result).to.have.property('html');
  });

  it('Get links from page', async () => {
    const cheerioPage = pageCrawlService.getCheerioPage(mockedHtmlPage);
    const links = pageCrawlService.getLinksFromPage(cheerioPage);
    expect(links).to.have.length(340);
  });

  it('Crawl page', async () => {
    const page = await pageCrawlService.crawlPage('https://mymockedurl.com');
    expect(page).to.be.instanceOf(Page);
    expect(page.getLinks().length).to.equal(340);
    expect(page.getPageSize()).to.equal(57304);
    expect(page.getStatusCode()).to.equal(200);
    expect(page.getRequestTime()).to.equal(205);
  });
});
