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

## benchmark
a simple benchmark is provided that reports the performance
of many links on a page that all refer to eachother. This data
is provided as csv for easy processing.

run is with
```
node node src/benchmarks/lot-of-links.spec.js
```

three random runs of this benchmark can be found [here](https://docs.google.com/spreadsheets/d/e/2PACX-1vRfxMjugLCP2cN1ZJ74QC7MU_tNBr_8Ql_3evsO5WN9nsktP69VpdFiTw6n_5OD2a4H0vqhmmMCj6GD/pubhtml).