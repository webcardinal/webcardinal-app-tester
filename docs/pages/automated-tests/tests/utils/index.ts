import { E2EPage, newE2EPage } from '@stencil/core/testing';
import { NewE2EPageOptions } from '@stencil/core/testing/puppeteer/puppeteer-declarations';

// interfaces
interface TestOptions {
  pageOptions?: NewE2EPageOptions;
}

// constants
export const HYDRATED_CLASS = 'hydrated';

// exported functions

export async function initTest(environment, options?: TestOptions) {
  const page = await newE2EPage(options?.pageOptions);
  await page.setContent(environment.content);
  environment.page = page;
}

export async function getWindow(page: E2EPage) {
  const handle = await page.evaluateHandle(() => ({ window }));
  const properties = await handle.getProperties();
  const windowHandle = properties.get('window');
  return [handle, windowHandle, await page.evaluate(win => win, windowHandle)];

  // At the end
  // await handle.dispose();
}

/**
 * For debugging inside dev tools use: page.evaluate(() => { debugger })
 * where page is page has the E2EPage type
 */