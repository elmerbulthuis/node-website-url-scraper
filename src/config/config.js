module.exports = {
  REQUEST_TIMEOUT: process.env.REQUEST_TIMEOUT || 10000,
  BATCH_SIZE: process.env.BATCH_SIZE || 25,
  IGNORE_ROBOTS: process.env.IGNORE_ROBOTS || false,
  FILE_DOWNLOAD_URL_REGEX: /(pdf|jpeg|txt|mp4|mp3|mkv|jpg|png|zip|7z|exe|css|js|gif|csv|tar|doc|docx|bmp|rar)$/gmi
};
