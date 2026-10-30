import assert from 'node:assert/strict';
import analyze from './netlify/functions/analyze.mjs';
import chat from './netlify/functions/chat.mjs';
import compare from './netlify/functions/compare.mjs';
import health from './netlify/functions/health.mjs';
const okCode='local-test-access-1234';
process.env.OPENAI_API_KEY='mock-test-key';process.env.APP_ACCESS_CODE=okCode;
const mock={job:{title:'FP&A Analyst',company:'Example',objective:'Phân tích ngân sách',mandatory:[],preferred:[],roleVerdict:'stretch',reason:'Chỉ đáp ứng một phần',mainBarrier:'Thiếu minh chứng'},requirements:[{requirement:'Excel',mandatory:true,source:'jd',evidence:'Có Pivot',status:'partial',gap:'Chưa có dashboard',nextAction:'Làm bài thực hành'}],cv_markdown:'# Ứng viên\n## Kinh nghiệm\n- Báo cáo dữ liệu',omissions:[],experienceBridge:[],learning:[],notes:['Nội dung mẫu']};
const requests=[];
const oldFetch=global.fetch;
global.fetch=async (url,opts)=>{
 const body=JSON.parse(opts.body);requests.push(body);
 const output=body.text?.format?.type==='json_schema'?JSON.stringify(mock):'Phản hồi từ AI giả lập để kiểm thử.';
 return {ok:true,status:200,json:async()=>({output:[{type:'message',content:[{type:'output_text',text:output}]}]})};
};
const post=payload=>new Request('https://testing.local',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
try{
 const healthR=await health(new Request('https://testing.local'));
 assert.equal((await healthR.json()).ready,true);
 assert.equal((await analyze(post({code:'wrong',jd:'j'.repeat(100),cv:'c'.repeat(100)}))).status,401);
 assert.equal((await analyze(post({code:okCode,jd:'too short',cv:'too short'}))).status,400);
 const result=await analyze(post({code:okCode,jd:'j'.repeat(100),cv:'c'.repeat(100)}));
 assert.equal(result.status,200);assert.equal((await result.json()).result.job.title,'FP&A Analyst');
 assert.equal(requests[0].store,false);
 assert.equal(requests[0].text.format.type,'json_schema');assert.equal(requests[0].text.format.strict,true);
 assert.equal((await chat(post({code:okCode,question:'Tôi nên học Excel như thế nào?',context:{}}))).status,200);
 assert.equal((await compare(post({code:okCode,reports:[{title:'A',requirements:[],learning:[]},{title:'B',requirements:[],learning:[]}]}))).status,200);
 assert.equal((await compare(post({code:okCode,reports:[{title:'A'}]}))).status,400);
 assert.equal((await analyze(new Request('https://testing.local',{method:'GET'}))).status,405);
 console.log('PASS — 9 backend checks; OpenAI requests are MOCK, no real API costs:',requests.length);
}finally{global.fetch=oldFetch}
