import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
await fs.mkdir('.image-work/cart',{recursive:true});
try {
for(const width of [1440,1024,390,375]) {
 const context=await browser.newContext({viewport:{width,height:900}});
 await context.addInitScript(()=>{if(!localStorage.getItem('cycloriva:cart:v1'))localStorage.setItem('cycloriva-cart-v1',JSON.stringify([{productId:'826',quantity:2},{productId:'818',quantity:1}]));});
 const page=await context.newPage(); const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://localhost:3000/fr/panier',{waitUntil:'networkidle',timeout:120000});
 const rows=page.locator('[data-component="cart-product-row"]');await rows.first().waitFor();
 assert.equal(await rows.count(),2);
 const summary=page.locator('[data-component="cart-summary"]');
 assert.match(await summary.innerText(),/2\s?377,45/);assert.match(await summary.innerText(),/Gratuite/);
 assert.equal(await page.locator('[data-component="site-main-footer"]').isVisible(),false);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 const price=rows.first().locator('strong:visible');assert.equal(await price.evaluate(e=>getComputedStyle(e).color),'rgb(185, 28, 28)');
 await page.screenshot({path:`.image-work/cart/cart-${width}.png`,fullPage:true});
 await rows.first().getByRole('button',{name:/Augmenter/}).filter({visible:true}).click();
 assert.match(await summary.innerText(),/3\s?099,10/);
 await rows.first().getByRole('button',{name:/Diminuer/}).filter({visible:true}).click();
 await page.reload({waitUntil:'networkidle'});assert.match(await summary.innerText(),/2\s?377,45/);
 await summary.getByRole('link').click();await page.waitForURL('**/fr/commande');await page.locator('[name="firstName"]').waitFor();
 assert.equal(await page.locator('[data-component="site-main-footer"]').isVisible(),false);
 await page.goto('http://localhost:3000/fr/panier',{waitUntil:'networkidle'});
 await rows.first().getByRole('button',{name:/Supprimer/}).filter({visible:true}).click();assert.equal(await rows.count(),1);
 await rows.first().getByRole('button',{name:/Supprimer/}).filter({visible:true}).click();assert.equal(await rows.count(),0);assert.equal(await summary.getByRole('button').isDisabled(),true);
 assert.deepEqual(errors,[]);await context.close();console.log(`Panier ${width}px : OK`);
}
for (const [locale,,shipping] of [['fr','Mon panier','Gratuite'],['en','My cart','Free'],['de','Mein Warenkorb','Kostenlos'],['it','Il mio carrello','Gratuita'],['es','Mi carrito','Gratis']]) {
 const context=await browser.newContext({viewport:{width:390,height:844}});
 await context.addInitScript(()=>localStorage.setItem('cycloriva-cart-v1',JSON.stringify([{productId:'818',quantity:1}])));
 const page=await context.newPage();await page.goto('http://localhost:3000/'+locale+'/panier',{waitUntil:'networkidle'});
 await page.locator('[data-component="cart-product-row"]').waitFor();
 assert.ok((await page.locator('h1').last().innerText()).length>0);
 assert.match(await page.locator('[data-component="cart-summary"]').innerText(),new RegExp(shipping));
 await context.close(); console.log('Langue '+locale+' : OK');
}
}finally{await browser.close();}
