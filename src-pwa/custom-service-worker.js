/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.conf > pwa > workboxPluginMode is set to "InjectManifest"
 */
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { NetworkFirst } from "workbox-strategies";
import { Queue } from "workbox-background-sync";

precacheAndRoute(self.__WB_MANIFEST);
let backgroundSyncSupport = 'sync' in self.registration? true:false;


let queueRegister = new Queue("myQueueRegisters", {
    onSync: async ({ queue }) => {
      let entry;
      while ((entry = await queue.shiftRequest())) {
        try {
          await fetch(entry.request);
          //  console.error('Replay successful for request', entry.request);
          const channel = new BroadcastChannel("sw-messages");
          channel.postMessage({ msg: "offline post uploaded" });
        } catch (error) {
          console.error("Replay failed for request", entry.request, error);

          // Put the entry back in the queue and re-throw the error:
          await queue.unshiftRequest(entry);
          throw error;
        }
      }
      console.log("Replay complete!");
    }
  });


registerRoute(
  ({ url }) => url.pathname.endsWith("/registers"),
  new NetworkFirst()
);

self.addEventListener("fetch", event => {
  if(event.request.url.endsWith('/new-time')){
    if(!self.navigator.onLine){
      const promiseChain = fetch(event.request.clone()).catch(err => {
        return queueRegister.pushRequest({ request: event.request });
      });
      event.waitUntil(promiseChain);
    }
  }
});
