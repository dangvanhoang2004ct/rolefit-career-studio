// OpenAI Responses API structured output contract. No personal data is stored here.
const str={type:'string'};
const stringList={type:'array',items:str};
const obj=properties=>({type:'object',properties,required:Object.keys(properties),additionalProperties:false});
const selection=(...values)=>({type:'string',enum:values});
export const REPORT_SCHEMA=obj({
  job:obj({
    title:str,company:str,objective:str,mandatory:stringList,preferred:stringList,
    roleVerdict:selection('apply_now','stretch','prepare_first'),reason:str,mainBarrier:str
  }),
  requirements:{type:'array',items:obj({
    requirement:str,mandatory:{type:'boolean'},source:selection('jd','inference'),
    evidence:str,status:selection('good','partial','not_shown','not_met'),gap:str,nextAction:str
  })},
  cv_markdown:str,omissions:stringList,experienceBridge:stringList,
  learning:{type:'array',items:obj({
    skill:str,reason:str,exercise:str,artifact:str,successCriteria:str,hours:str,
    phase:selection('before_apply','before_interview','later')
  })},
  notes:stringList
});
export function normalizeReport(x){
  if(!x || typeof x!=='object' || !x.job || typeof x.job!=='object' || !Array.isArray(x.requirements) || typeof x.cv_markdown!=='string' || !Array.isArray(x.learning))throw Error('Sai cấu trúc báo cáo');
  const allowed=new Set(['good','partial','not_shown','not_met']);
  const rq=x.requirements.slice(0,25).map(q=>{
    if(!q || typeof q.requirement!=='string' || !allowed.has(q.status) || !['jd','inference'].includes(q.source))throw Error('Dữ liệu ma trận không hợp lệ');
    return {...q,requirement:q.requirement.slice(0,1200),evidence:String(q.evidence||'').slice(0,2000),gap:String(q.gap||'').slice(0,1200),nextAction:String(q.nextAction||'').slice(0,1500)};
  });
  return {...x,requirements:rq,learning:x.learning.slice(0,3),cv_markdown:x.cv_markdown.slice(0,55000),notes:Array.isArray(x.notes)?x.notes.slice(0,25):[],experienceBridge:Array.isArray(x.experienceBridge)?x.experienceBridge.slice(0,15):[],omissions:Array.isArray(x.omissions)?x.omissions.slice(0,15):[]};
}
