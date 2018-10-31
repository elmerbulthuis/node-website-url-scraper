const {expect} = require('chai');

const Page = require('../../models/Page');
const reportingService = require('../../services/reportingService');

const mockedPages = require('../mocks/pagesMock');
const mockedPagesReportingResult = require('../mocks/pagesMockReportingResult');

const mockedPagesAsPagesArray = mockedPages.map(({value: page}) => Page.createNewPageFromObject(page));
const workingPages = reportingService.getWorkingPages(mockedPagesAsPagesArray);
const failedPages = reportingService.getFailedPages(mockedPagesAsPagesArray);

describe('Reporting service tests', async () => {
  it('Get report', async () => {
    const reportingResult = reportingService.getReport(mockedPages);
    expect(reportingResult).to.deep.equal(mockedPagesReportingResult);
  });

  it('Get working page percentage', async () => {
    const percentage = reportingService.getWorkingPercentage(100, 10);
    expect(typeof percentage).to.equal('number');
    expect(percentage).to.equal(90);
  });

  it('Get working page percentage 2', async () => {
    const percentage = reportingService.getWorkingPercentage(123, 13);
    expect(typeof percentage).to.equal('number');
    expect(percentage).to.equal(89.43);
  });

  it('Get working pages', async () => {
    const workingPagesArray = reportingService.getWorkingPages(mockedPagesAsPagesArray);
    expect(workingPagesArray).to.be.instanceOf(Array);
    expect(workingPagesArray).to.have.length(11);
  });

  it('Get failed pages', async () => {
    const failedPagesArray = reportingService.getFailedPages(mockedPagesAsPagesArray);
    expect(failedPagesArray).to.be.instanceOf(Array);
    expect(failedPagesArray).to.have.length(3);
  });

  it('Get avg load times of pages', async () => {
    const avgLoadTime = reportingService.getAverageLoadTime(workingPages);
    expect(typeof avgLoadTime).to.equal('number');
    expect(avgLoadTime).to.equal(213);
  });

  it('Get avg size of pages', async () => {
    const avgPageSize = reportingService.getAveragePageSize(workingPages);
    expect(typeof avgPageSize).to.equal('number');
    expect(avgPageSize).to.equal(7496);
  });

  it('Get avg links on pages', async () => {
    const avgLinks = reportingService.getAverageLinksOnPage(workingPages);
    expect(typeof avgLinks).to.equal('number');
    expect(avgLinks).to.equal(8);
  });

  it('Get total external links', async () => {
    const totalExternalLinks = reportingService.getTotalExternalLinks(workingPages);
    expect(typeof totalExternalLinks).to.equal('number');
    expect(totalExternalLinks).to.equal(39);
  });

  it('Get total internal links', async () => {
    const totalInternalLinks = reportingService.getTotalInternalLinks(workingPages);
    expect(typeof totalInternalLinks).to.equal('number');
    expect(totalInternalLinks).to.equal(55);
  });

  it('Get failed pages histogram', async () => {
    const failedPagesHistogram = reportingService.getFailedPagesStatusCodes(failedPages);
    expect(typeof failedPagesHistogram).to.equal('object');
    expect(failedPagesHistogram).to.deep.equal({
      400: 2,
      404: 1
    });
  });

  it('Test avg function', async () => {
    const avg = reportingService.getAvg(100, 2);
    expect(typeof avg).to.equal('number');
    expect(avg).to.deep.equal(50);
  });

  it('Test avg function 2', async () => {
    const avg = reportingService.getAvg(12345, 123.5);
    expect(typeof avg).to.equal('number');
    expect(avg).to.deep.equal(99);
  });

  it('Test failed pages filter function', async () => {
    const filterFailedPagesArray = mockedPagesAsPagesArray.filter(reportingService.failedPagesFilter);
    expect(filterFailedPagesArray).to.be.instanceOf(Array);
    expect(filterFailedPagesArray).to.have.length(3);
  });

  it('Test working pages filter function', async () => {
    const workingPagesArray = mockedPagesAsPagesArray.filter(reportingService.workingPagesFilter);
    expect(workingPagesArray).to.be.instanceOf(Array);
    expect(workingPagesArray).to.have.length(11);
  });
});
