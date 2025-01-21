---
title: 油猴脚本示例
description: 使用油猴脚本自动登陆指定站点.
---

使用油猴脚本自动登陆指定站点

```js
// ==UserScript==
// @name         minio-auto-login
// @namespace    http://tampermonkey.net/
// @version      2024-06-20
// @description  try to take over the world!
// @author       You
// @match        http://minio-us.xxx.com:9001/login
// @match        http://minio-eu.xxx.com:9001/login
// @match        http://minio-sg.xxx.com:9001/login
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xxx.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const username = 'admin';
    const password = 'password';

    // Selectors for the username and password fields
    const usernameSelector = '#accessKey';  // Change this to the actual selector
    const passwordSelector = '#secretKey';  // Change this to the actual selector
    const loginButtonSelector = '#do-login';  // Change this to the actual selector

    const event = document.createEvent('HTMLEvents')
    event.initEvent('input', false, true)
    event.eventType="message"

    // Wait for the DOM to fully load
    window.addEventListener('load', function() {
        // Fill in the username and password
        changeReactInputValue(document.querySelector(usernameSelector), username)
        changeReactInputValue(document.querySelector(passwordSelector), password)

        // Optionally, submit the form
        document.querySelector(loginButtonSelector).click();
    });
    //调用下面这个函数可以给框架包装过的input框赋值
function changeReactInputValue(inputDom,newText){
    let lastValue = inputDom.value;
    inputDom.value = newText;
    let event = new Event('input', { bubbles: true });
    event.simulated = true;
    let tracker = inputDom._valueTracker;
    if (tracker) {
      tracker.setValue(lastValue);
    }
    inputDom.dispatchEvent(event);
}
})();
```
