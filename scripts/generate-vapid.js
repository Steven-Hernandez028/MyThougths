import webPush from 'web-push';

const keys = webPush.generateVAPIDKeys();
console.log(keys);
