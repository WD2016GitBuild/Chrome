// ==UserScript==
// @name         全网门户防止后台自动退出
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       WD
// @match        http://*.make.yun300.cn/manager/?TOKEN=*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var calced = false;
    var time = 10; // 多少分钟刷新一次
    var current = 0;
    var all = time* 60;
    var count_down_time = (time - 1) * 60;
    var body = $("body");
    body.append("<div class='w-tip'>60</div>");
    $("head").append('<style>.w-tip{width:70px;height:70px;border-radius:50%;box-shadow:1px 1px 10px #333;background-color:#e33;background-image:linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);line-height:70px;text-align:center;color:#fff;font-size:26px;position:fixed;top:20px;right:20px;z-index:9999;cursor:pointer;display:none;}.w-tip.w{display:block;}</style>');
    var tip = $(".w-tip");
    tip.click(function() {
        tip.removeClass("w");
        calced = true;
        current = 0;
    });
    setInterval(function() {
        current++;
        if(current >= count_down_time && current < all) {
            if(!tip.hasClass("w")) {
                tip.addClass("w");
            }
            var a = all - current;
            if(a < 10) {
                a = "0" + a;
            }
            tip.text(a);
        } else if (current == all) {
            if(calced) {
                current = 0;
                calced = false;
            } else {
                location.href = location.href;
            }
        }
    }, 1000);
})();