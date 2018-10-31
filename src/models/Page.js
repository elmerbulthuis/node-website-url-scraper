class Page {
  constructor(pageErr, url, statusCode, requestTime, links, pageSize) {
    this.statusCode = statusCode;
    this.pageErr = pageErr;
    this.url = url;
    this.requestTime = requestTime;
    this.links = links || [];
    this.pageSize = pageSize;
  }

  getUrl() {
    return this.url;
  }

  getStatusCode() {
    return this.statusCode;
  }

  getPageSize() {
    return this.pageSize;
  }

  getRequestTime() {
    return this.requestTime;
  }

  getLinks() {
    return this.links;
  }

  static createNewPageFromObject({
    pageErr, url, statusCode, requestTime, links, pageSize
  }) {
    return new Page(pageErr, url, statusCode, requestTime, links, pageSize);
  }
}

module.exports = Page;
