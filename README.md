# node-website-url-scraper
Simple website url scraper written in NodeJS

Returns basic reporting info of the given website:
```
{
  "workingPages": {
    "count": 11,
    "avgPageLoadTimeInMS": 213,
    "avgPageSizeInBytes": 7496,
    "avgLinksOnPage": 8,
    "totalExternalLinks": 39,
    "totalInternalLinks": 55
  },
  "failedPages": {
    "count": 3,
    "failedPagesResponseCodeHistogram": {
      "400": 2,
      "404": 1
    }
  },
  "percentageWorking": "72.73%"
}
```

# Usage
```
node main.js --url=http://example.com
```
Change variables in config.js to tweak the progress
