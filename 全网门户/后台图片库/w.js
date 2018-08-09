// ==UserScript==
// @name         图片库
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       WD
// @match        http://1806291006.pool2-site.make.yun300.cn/manager/imageRepository/image_index.do
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function() {
        $(".zzd_list_02 .zzd_td .zzd_td_list .text_cont img").each((i,v) =>{
            var _ = $(v);
            var img = _.attr("src");
            var c = img.split("_260x160");
            c.length >= 2 && c[1] != "" && _.attr("src", c[0]);
        });
    }, 100);
})();
