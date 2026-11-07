import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
for(const width of [1920,1440,1024,390,375]) {
 const context=await browser.newContext({viewport:{width,height:900}});
 await context.addInitScript(()=>localStorage.setItem('cycloriva-cart-v1',JSON.stringify([{productId:'818',quantity:1}])));
 await context.route('https://ipapi.co/json/',route=>route.fulfill({json:{country_code:'DE'}}));
 const page=await context.newPage();await page.goto('http://localhost:3000/es/commande',{waitUntil:'networkidle',timeout:120000});
 const country=page.locator('select[name="country"]:visible');await country.waitFor();
 await page.waitForFunction(()=>document.querySelector('select[name="country"]')?.value==='DE');
 assert.equal(await page.locator('select[name="phoneCountry"]').inputValue(),'DE');
 assert.match(await page.locator('select[name="phoneCountry"] option:checked').innerText(),/49/);
 const section=await page.locator('main[data-page="checkout"] > section').boundingBox();assert.ok(section.width>=width-2,'full width '+width);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await country.selectOption('IT');assert.equal(await page.locator('select[name="phoneCountry"]').inputValue(),'DE');
 await context.close();console.log('Pays et pleine largeur '+width+'px : OK');
}
for(const scenario of ['manual','unsupported','failure']) {
 const context=await browser.newContext({viewport:{width:390,height:844}});
 await context.addInitScript(()=>localStorage.setItem('cycloriva-cart-v1',JSON.stringify([{productId:'818',quantity:1}])));
 let release;const wait=new Promise(r=>release=r);
 await context.route('https://ipapi.co/json/',async route=>{await wait;if(scenario==='failure')return route.abort();await route.fulfill({json:{country_code:scenario==='unsupported'?'US':'FR'}});});
 const page=await context.newPage();await page.goto('http://localhost:3000/fr/commande',{waitUntil:'domcontentloaded'});
 const country=page.locator('select[name="country"]:visible');await country.waitFor();await page.waitForFunction(()=>document.querySelector('select[name="country"]:not([disabled])'));
 if(scenario==='manual'){await country.selectOption('IT');await page.locator('select[name="phoneCountry"]').selectOption('BE');}
 release();await page.waitForLoadState('networkidle');
 assert.equal(await country.inputValue(),scenario==='manual'?'IT':'');
 assert.equal(await page.locator('select[name="phoneCountry"]').inputValue(),scenario==='manual'?'BE':'');
 assert.equal(await country.isEnabled(),true);await context.close();console.log('Repli '+scenario+' : OK');
}
}finally{await browser.close();}
