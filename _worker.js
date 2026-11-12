// Cloudflare Pages worker: public GET /api/prices, password-protected PUT /api/prices
const A=['n','u','c','m','e'],S=['n','u','e','c','h','m'];
const num=v=>typeof v==='number'&&isFinite(v)&&v>=0&&v<1e6;
const day=v=>Number.isInteger(v)&&v>0&&v<1000;
function clean(d){
  if(!d||!d.air||!d.sea)return null;
  if(!A.every(k=>num(d.air[k]))||!S.every(k=>num(d.sea[k])))return null;
  if(![d.airMin,d.airMax,d.seaMin,d.seaMax].every(day)||d.airMin>d.airMax||d.seaMin>d.seaMax)return null;
  return{air:Object.fromEntries(A.map(k=>[k,d.air[k]])),sea:Object.fromEntries(S.map(k=>[k,d.sea[k]])),airMin:d.airMin,airMax:d.airMax,seaMin:d.seaMin,seaMax:d.seaMax};
}
const json=(b,s=200)=>new Response(b,{status:s,headers:{'content-type':'application/json','cache-control':'no-store'}});
export default{
  async fetch(req,env){
    const u=new URL(req.url);
    if(u.pathname!=='/api/prices')return env.ASSETS.fetch(req);
    if(req.method==='GET')return json((await env.PRICES.get('prices'))||'null');
    if(req.method==='PUT'){
      const pw=req.headers.get('x-admin-password')||'';
      if(!env.ADMIN_PASSWORD||pw!==env.ADMIN_PASSWORD)return json('{"error":"wrong password"}',401);
      let d;try{d=clean(await req.json())}catch{d=null}
      if(!d)return json('{"error":"invalid data"}',400);
      await env.PRICES.put('prices',JSON.stringify(d));
      return json('{"ok":true}');
    }
    return json('{"error":"method not allowed"}',405);
  }
};
