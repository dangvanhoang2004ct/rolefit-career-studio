import {timingSafeEqual} from 'node:crypto';
const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store, private','X-Content-Type-Options':'nosniff'};
export const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
export function allow(req){
 if(req.method!=='POST')return json({error:'Chỉ hỗ trợ POST.'},405);
 if(!(req.headers.get('content-type')||'').includes('application/json'))return json({error:'Yêu cầu phải ở dạng JSON.'},415);
 const size=Number(req.headers.get('content-length')||'0');
 if(size>6500000)return json({error:'Dữ liệu gửi vượt giới hạn. Hãy giảm ảnh hoặc văn bản.'},413);
 if(!process.env.OPENAI_API_KEY)return json({error:'Cần cấu hình OPENAI_API_KEY trên Netlify.'},503);
 if(!process.env.APP_ACCESS_CODE || process.env.APP_ACCESS_CODE.length<12)return json({error:'Chủ website cần đặt APP_ACCESS_CODE dài tối thiểu 12 ký tự để bảo vệ việc gọi AI.'},503);
 return null;
}
export function auth(value){
 if(typeof value!=='string')return false;
 const a=Buffer.from(value),b=Buffer.from(process.env.APP_ACCESS_CODE||'');
 return a.length===b.length&&timingSafeEqual(a,b);
}
export async function askOpenAI({instructions,input,limit=5000,schema}){
 const payload={model:process.env.OPENAI_MODEL||'gpt-4.1-mini',instructions,input,store:false,max_output_tokens:limit};
 if(schema)payload.text={format:{type:'json_schema',name:'rolefit_report',strict:true,schema}};
 const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),53000);
 try{
  const res=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{Authorization:`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify(payload),signal:ctrl.signal});
  const data=await res.json().catch(()=>({}));
  if(!res.ok){
   const status=res.status;
   if(status===429)return {error:'AI đang giới hạn lượt gọi hoặc hạn mức tài khoản API. Vui lòng thử lại sau.',status:503};
   if(status===401)return {error:'OPENAI_API_KEY không hợp lệ. Chủ website cần kiểm tra trong Netlify.',status:503};
   return {error:`Dịch vụ AI trả lỗi (${status}). Kiểm tra model, ngân sách và cấu hình API.`,status:502};
  }
  if(data.status==='incomplete')return {error:'AI chưa hoàn tất báo cáo do giới hạn đầu ra. Hãy rút ngắn tài liệu hoặc thử lại.',status:502};
  const output=(data.output||[]).filter(x=>x.type==='message').flatMap(x=>(x.content||[]).filter(c=>c.type==='output_text').map(c=>c.text)).join('\n');
  if(!output)return {error:'Không nhận được kết quả AI hoàn chỉnh. Hãy thử lại.',status:502};
  return {text:output};
 }catch(e){return {error:e?.name==='AbortError'?'Yêu cầu AI vượt thời gian xử lý. Hãy rút ngắn CV/JD.':'Không kết nối được dịch vụ AI.',status:502}}
 finally{clearTimeout(timer)}
}
