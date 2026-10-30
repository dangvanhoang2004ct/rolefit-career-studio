import OpenAI from 'openai';
const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store, private','X-Content-Type-Options':'nosniff'};
export const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
export const gatewayReady=()=>Boolean(process.env.OPENAI_API_KEY&&process.env.OPENAI_BASE_URL);
export function allow(req){
 if(req.method!=='POST')return json({error:'Chỉ hỗ trợ POST.'},405);
 if(!(req.headers.get('content-type')||'').includes('application/json'))return json({error:'Yêu cầu phải ở dạng JSON.'},415);
 const origin=req.headers.get('origin');
 if(origin&&origin!==new URL(req.url).origin)return json({error:'Nguồn yêu cầu không hợp lệ.'},403);
 if(Number(req.headers.get('content-length')||0)>4000000)return json({error:'Dữ liệu vượt 4 MB.'},413);
 if(!gatewayReady())return json({error:'AI Gateway chưa được bật cho dự án. Bạn không cần nhập API key; quản trị viên cần kiểm tra AI Features và credits trên Netlify.'},503);
 return null;
}
export async function readBody(req){
 const reader=req.body?.getReader(); if(!reader)throw Error('Thiếu nội dung');
 let size=0;const chunks=[];
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>4000000){await reader.cancel();throw Error('Dữ liệu vượt 4 MB')}chunks.push(value)}
 const bytes=new Uint8Array(size);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length}return JSON.parse(new TextDecoder().decode(bytes));
}
export async function askOpenAI({instructions,input,limit=5000,schema}){
 const payload={model:process.env.OPENAI_MODEL||'gpt-4.1-mini',instructions,input,store:false,max_output_tokens:Math.min(limit,6500)};
 if(schema)payload.text={format:{type:'json_schema',name:'rolefit_report',strict:true,schema}};
 try{
  const client=new OpenAI({maxRetries:0,timeout:45000});
  const data=await client.responses.create(payload);
  if(data.status==='incomplete')return {error:'Báo cáo vượt giới hạn đầu ra. Hãy rút ngắn hồ sơ và thử lại.',status:502};
  const output=data.output_text||(data.output||[]).filter(x=>x.type==='message').flatMap(x=>(x.content||[]).filter(c=>c.type==='output_text').map(c=>c.text)).join('\n');
  if(!output)return {error:'AI chưa trả kết quả hoàn chỉnh.',status:502};
  return {text:output};
 }catch(e){return {error:e.status===429?'Đã đạt giới hạn AI hoặc credits. Hãy thử lại sau.':e.status===401?'Gateway chưa xác thực được. Quản trị viên cần kiểm tra AI Features.':'AI tạm thời không phản hồi. Hãy thử tài liệu ngắn hơn.',status:e.status===429?429:503}}
}
