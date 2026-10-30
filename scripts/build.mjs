import {readFile,writeFile} from 'node:fs/promises';
const path='public/index.html';
let html=await readFile(path,'utf8');
const site=String(process.env.URL||'').trim().replace(/\/$/,'');
if(/^https:\/\/[-\w.]+(?::\d+)?$/.test(site)){
  html=html.replace(/<meta property="og:image" content="[^"]*">/,'<meta property="og:image" content="'+site+'/assets/share-card.png">');
  if(html.includes('property="og:url"'))html=html.replace(/<meta property="og:url" content="[^"]*">/,'<meta property="og:url" content="'+site+'">');
  else html=html.replace('<meta property="og:locale"', '<meta property="og:url" content="'+site+'"><meta property="og:locale"');
  await writeFile(path,html);
  console.log('Open Graph absolute URL configured for',site);
}else console.log('No public URL set; leaving relative Open Graph image for local preview.');
