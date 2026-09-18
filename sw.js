var CACHE='ra3dbet-shell-v144';
var SHELL=['./','./index.html'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(SHELL);}).then(function(){return self.skipWaiting();}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));
});
self.addEventListener('fetch',function(e){
  var req=e.request;
  if(req.method!=='GET')return;
  var url=new URL(req.url);
  if(url.origin!==self.location.origin)return;
  if(req.mode==='navigate'){
    e.respondWith(
      fetch(req).then(function(res){
        if(res&&res.status===200){var cp=res.clone();caches.open(CACHE).then(function(c){return c.put(req,cp);});return res;}
        throw new Error('bad-status');
      }).catch(function(){
        return caches.match(req).then(function(c){return c||caches.match('./index.html');});
      })
    );
    return;
  }
  e.respondWith(caches.match(req).then(function(c){
    return c||fetch(req).then(function(res){var cp=res.clone();caches.open(CACHE).then(function(cc){return cc.put(req,cp);});return res;});
  }));
});