import {json} from '../lib/shared.mjs';
export default async function handler(req){if(req.method!=='GET')return json({error:'Method not allowed'},405);return json({ready:Boolean(process.env.OPENAI_API_KEY&&process.env.APP_ACCESS_CODE?.length>=12),modelConfigured:!!process.env.OPENAI_MODEL,version:'2.0'})}
