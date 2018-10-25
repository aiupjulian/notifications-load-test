const puppeteer = require('puppeteer');
const { Cluster } = require('puppeteer-cluster');

function delay(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

const browsersQuantity = 15;

(async () => {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: browsersQuantity,
  });

  await cluster.task(async ({ page, data: url }) => {
    let userId = 0;
    await page.goto(url);
    page.on('response', res => {
      if (res.url().endsWith("login")) {
        res.json().then(json => {
          if (json.userId) {
            userId = json.userId;
          }
        });
      }
    });
    await delay(2000);
    await page.screenshot({ path: `puppeteer/test-${userId}.png` });
  });
  for (var i = 0; i < browsersQuantity; i++) {
    await cluster.queue('http://localhost:4200');
  }
  await cluster.idle();
  await cluster.close();
})();
