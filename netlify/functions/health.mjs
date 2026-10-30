import {json,gatewayReady} from '../lib/shared.mjs';
export default async function handler(req){return req.method==='GET'?json({ready:gatewayReady(),provider:'netlify-ai-gateway',version:'2.1',limits:{analyze:2,chat:6,compare:2,windowSeconds:60}}):json({error:'Method not allowed'},405)}
