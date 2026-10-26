import { afterEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/member/subscription/billing/[[...path]]/route';
import { ACCESS_COOKIE } from '@/lib/auth/cookies';
import { parseBillingStatus, parseOperation } from '@/lib/subscription-checkout';
import { analyticsPage } from '@/lib/analytics';
const origin='http://127.0.0.1:3210';
const id='e459829c-fb2f-48ed-b425-18b8e2287859';
const operation={id,kind:'SUBSCRIBE',status:'PENDING',amount:99900,provider_payment_key:'private-provider-key',quote:{private:true}};
function mock(role='OWNER'){
  const fetcher=vi.fn(async(input:string,init:RequestInit)=>{
    const url=new URL(input);
    if(url.pathname==='/v1/auth/me')return Response.json({userId:id,email:'fixture@example.invalid',role,emailVerified:true,customerStatus:'ACTIVE'});
    if(url.pathname==='/v1/auth/profile')return Response.json({display_name:'회원'});
    if(url.pathname==='/v1/subscriptions/current')return Response.json({active:false,planName:null,maxActiveSlots:0,expiresAt:null});
    if(url.pathname==='/v1/subscriptions/billing/setup')return Response.json({clientKey:'test_ck_public',customerKey:id,sessionId:id,successUrl:origin+'/payments/billing/callback/',failUrl:origin+'/payments/billing/callback/?failed=1',billingKey:'must-not-leak'});
    if(url.pathname==='/v1/subscriptions/billing/authorizations')return Response.json({registered:true,billingKey:'must-not-leak'});
    if(url.pathname==='/v1/subscriptions/billing')return Response.json({enabled:true,cardRegistered:true,cardLabel:'등록된 카드 · 5678',renewalEnabled:false,nextBillingAt:null,latestOperation:operation,billing_key_envelope:{private:true}});
    return Response.json(operation,{status:init.method==='POST'?202:200});
  });vi.stubGlobal('fetch',fetcher);return fetcher;
}
function request(path:string,body?:unknown,requestOrigin=origin,cookie=true){return new NextRequest(origin+'/api/member/subscription/billing/'+path,{method:body===undefined?'GET':'POST',headers:{host:'127.0.0.1:3210',origin:requestOrigin,...(cookie?{cookie:`${ACCESS_COOKIE}=local-test-token-only`}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})});}
const context=(path:string)=>({params:Promise.resolve({path:path.split('/').filter(Boolean)})});
afterEach(()=>{vi.unstubAllGlobals();vi.unstubAllEnvs();});
describe('subscription billing BFF',()=>{
  it('rejects cross-origin mutations, unknown routes and guests before a provider request',async()=>{
    const fetcher=mock();expect((await POST(request('orders/',{},'https://other.invalid'),context('orders'))).status).toBe(403);
    expect((await POST(request('unexpected/',{}),context('unexpected'))).status).toBe(404);
    expect((await POST(request('orders/',{},origin,false),context('orders'))).status).toBe(401);expect(fetcher).not.toHaveBeenCalled();
  });
  it('only allows an authenticated, verified account owner',async()=>{const fetcher=mock('OPERATOR');expect((await POST(request('orders/',{}),context('orders'))).status).toBe(403);expect(fetcher.mock.calls.some(([url])=>url.includes('/billing'))).toBe(false);});
  it('proxies idempotent order requests server-side and strips private provider data',async()=>{
    const fetcher=mock();const input={idempotencyKey:id,quoteToken:'q'.repeat(43)};
    const response=await POST(request('orders/',input),context('orders'));expect(response.status).toBe(202);expect(await response.json()).toEqual(parseOperation(operation));expect(response.headers.get('cache-control')).toContain('no-store');
    const call=fetcher.mock.calls.find(([url])=>url.endsWith('/billing/orders'))!;expect(JSON.parse(call[1].body as string)).toEqual(input);expect(call[1].headers).toMatchObject({Authorization:'Bearer local-test-token-only'});
  });
  it('returns only public setup fields and a registration result',async()=>{mock();const setup=await POST(request('setup/',{}),context('setup'));expect(await setup.text()).not.toContain('must-not-leak');const auth=await POST(request('authorizations/',{}),context('authorizations'));expect(await auth.json()).toEqual({registered:true});});
  it('reads only safe billing state and operation fields',async()=>{mock();const state=await GET(request(''),context(''));expect(await state.text()).not.toContain('private');const result=await GET(request(`operations/${id}/`),context(`operations/${id}`));expect(await result.json()).toEqual(parseOperation(operation));});
  it('never includes billing callback credentials in analytics, even after the URL is cleaned',()=>{
    const titles={'/payments/':'구독 관리','/payments/checkout/':'구독 결제'};
    expect(analyticsPage(origin+'/payments/billing/callback/?authKey=secret&customerKey=private',titles,'')).toBeNull();
    expect(analyticsPage(origin+'/payments/billing/callback/',titles,'')).toBeNull();
    expect(analyticsPage(origin+'/payments/?authKey=secret',titles,'')).toBeNull();
    expect(parseBillingStatus({enabled:true,cardRegistered:false,renewalEnabled:false,latestOperation:null})?.cardRegistered).toBe(false);
  });
});
