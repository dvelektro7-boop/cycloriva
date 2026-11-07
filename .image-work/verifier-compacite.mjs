import {chromium} from '@playwright/test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';import sharp from 'sharp';
const routes=['a-propos','conseils-guides','service-client','livraison','retours-remboursements','faq','garantie','paiements-securises','suivi-commande','politique-confidentialite','conditions-generales-vente','gestion-cookies','mentions-legales'];
const b=await chromium.launch({channel:'chrome',headless:true});await fs.mkdir('.image-work/information-compact',{recursive:true});
try{for(const width of [1440,1024,390,375]){const c=await b.newContext({viewport:{width,height:900}});const p=await c.newPage();
for(const route of routes){const errors=[];const handler=e=>errors.push(e.message);p.on('pageerror',handler);await p.goto('http://localhost:3000/fr/'+route,{waitUntil:'networkidle',timeout:120000});await p.locator('main.info-page').waitFor();assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,route+' overflow '+width);assert.deepEqual(errors,[],route);
if(width===1440 || width===375){const old=await sharp('.image-work/information/'+route+'-'+width+'.png').metadata();const height=await p.evaluate(()=>document.documentElement.scrollHeight);assert.ok(height<old.height,route+' page should be shorter: '+height+' vs '+old.height);await p.screenshot({path:'.image-work/information-compact/'+route+'-'+width+'.png',fullPage:true});console.log(width+' '+route+' : '+old.height+' -> '+height+' px');}
p.off('pageerror',handler);}await c.close();console.log(width+'px : 13 pages OK');}
}finally{await b.close();}
