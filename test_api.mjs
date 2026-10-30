import assert from 'node:assert/strict';
import analyze from './netlify/functions/analyze.mjs';
import chat from './netlify/functions/chat.mjs';
import compare from './netlify/functions/compare.mjs';
import health from './netlify/functions/health.mjs';
const okCode='local-test-access-1234';
process.env.OPENAI_API_KEY='mock-test-key';process.env.OPENAI_BASE_URL='https://gateway.test/v1';
const mock={job:{title:'FP&A Analyst',company:'Example',objective:'Phân tích ngân sách',mandatory:[],preferred:[],roleVerdict:'stretch',reason:'Chỉ đáp ứng một phần',mainBarrier:'Thiếu minh chứng'},requirements:[{requirement:'Excel',mandatory:true,source:'jd',evidence:'Có Pivot',status:'partial',gap:'Chưa có dashboard',nextAction:'Làm bài thực hành'}],cv_markdown:'# Ứng viên\n## Kinh nghiệm\n- Báo cáo dữ liệu',omissions:[],experienceBridge:[],learning:[],notes:['Nội dung mẫu']};
const requests=[];
const oldFetch=global.fetch;
global.fetch=async (url,opts)=>{
 const body=JSON.parse(opts.body);requests.push(body);
 const output=body.text?.format?.type==='json_schema'?JSON.stringify(mock):'Phản hồi từ AI giả lập để kiểm thử.';
 return new Response(JSON.stringify({status:'completed',output:[{type:'message',content:[{type:'output_text',text:output}]}]}),{status:200,headers:{'content-type':'application/json'}});
};
const post=payload=>new Request('https://testing.local',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
try{
 const healthR=await health(new Request('https://testing.local'));
 assert.equal((await healthR.json()).ready,true);
 assert.equal((await analyze(new Request('https://testing.local',{method:'POST',headers:{'content-type':'application/json',origin:'https://evil.test'},body:'{}'}))).status,403);
 assert.equal((await analyze(post({code:okCode,jd:'too short',cv:'too short'}))).status,400);
 const result=await analyze(post({code:okCode,jd:'j'.repeat(100),cv:'c'.repeat(100)}));
 assert.equal(result.status,200);assert.equal((await result.json()).result.job.title,'FP&A Analyst');
 assert.equal(requests[0].store,false);
 assert.equal(requests[0].text.format.type,'json_schema');assert.equal(requests[0].text.format.strict,true);
 assert.equal((await chat(post({code:okCode,question:'Tôi nên học Excel như thế nào?',context:{}}))).status,200);
 assert.equal((await compare(post({code:okCode,reports:[{title:'A',requirements:[],learning:[]},{title:'B',requirements:[],learning:[]}]}))).status,200);
 assert.equal((await compare(post({code:okCode,reports:[{title:'A'}]}))).status,400);
 assert.equal((await analyze(new Request('https://testing.local',{method:'GET'}))).status,405);
 assert.equal((await analyze(post({jd:'j'.repeat(16001),cv:'c'.repeat(100)}))).status,413);
 delete process.env.OPENAI_BASE_URL;assert.equal((await health(new Request('https://testing.local'))).status,200);assert.equal((await analyze(post({jd:'j'.repeat(100),cv:'c'.repeat(100)}))).status,503);
 console.log('PASS — SDK mock, request validation, no shared code, output schema, size limits and unavailable Gateway. Not a live AI test.');
}finally{global.fetch=oldFetch}
