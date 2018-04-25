// ==UserScript==
// @name         中企动力制作神器
// @namespace    http://www.dongua.cc
// @version      1.1
// @description  try to take over the world!
// @author       WD
// @match        http*://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    let body;
    let _copy;
    let _legendary;

    function $() {
        return document.querySelector(arguments[0]);
    }
    function $$() {
        return document.querySelectorAll(arguments[1]);
    }
    window.onload = function() {
        body = $("body");
        _copy = copy();
        _legendary = Legendary();
        let legendarys = [["制作声明", "<!--由中企动力科技集团股份有限公司成都分公司技术部设计制作<br>如果您有任何意见或建议请电邮dm-chengdu@300.cn -->"]];
        legendarys.push(["时间戳: " + new Date().getTime(), new Date().getTime(), 'w-timestamps']);
        legendarys.push(["网站建设：中企动力成都", '<a href="http://www.300.cn/transport/welcom" target="_blank" title="网站建设">网站建设：中企动力</a><a href="http://www.300.cn/transport/chengdu" target="_blank" title="成都">成都</a>']);
        legendarys.push(['300官网', 'http://www.300.cn/transport/welcom']);
        legendarys.push(['分公司链接', 'http://www.300.cn/transport/chengdu']);
        legendarys.push(['备案号链接', 'http://www.miitbeian.gov.cn']);
        legendarys.push(['QQ链接', '<a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=747691474&site=qq&menu=yes"><img border="0" src="http://wpa.qq.com/pa?p=2:747691474:53" alt="点击这里给我发消息" title="点击这里给我发消息"/></a>']);

        legendarys.map(function(v,i) {
            _legendary.start(v[0], v[1], v[2]?v[2]:"");
        });

        timestamps();
    };

    function copy() {
        var t = document.createElement("textarea");
        t.classList.add("w-copy-textarea");
        appendStyle('.w-copy-textarea{position:fixed;top:-1100px;left:-1100px;z-index:1000;}');
        body.appendChild(t);
        return {
            copy:function(target) {
                t.value = target.dataset.content;
                t.select();
                document.execCommand("Copy");
            }
        };
    }

    function Legendary() {
        let div = document.createElement("div");
        div.classList.add("w-legendary");
        body.appendChild(div);
        let css = '.w-legendary {position:fixed;top:0px;right:0px;z-index:999999;}';
        css += '.w-legendary .w-item {text-align:center;position:relative;width:auto;line-height:20px;font-size:12px;color:#fff;background-image: -webkit-linear-gradient(180deg, #bd30ff 0%, rgb(114,36,255) 100%);border-radius:50px;padding:8px 20px;margin-top:3px !important;user-select:none;cursor:pointer;}';
        css += '.w-legendary .w-item:before {content:"";display:block;width:100%;height:100%;position:absolute;top:0px;left:0px;z-index:10;}';
        appendStyle(css);

        return {
            start:function(title, content, className) {
                let d = document.createElement("div");
                if(className) {
                    d.classList.add(className);
                }
                d.innerText = title;
                d.dataset.content = content;
                div.appendChild(d);
                d.classList.add("w-item");
                d.addEventListener("click", function() {
                    _copy.copy(this);
                });
            }
        };
    }

    function timestamps() {
        let a = $(".w-timestamps");
        setInterval(function() {
            var time = new Date().getTime();
            a.innerText = "时间戳: " + time;
            a.dataset.content = time;
        }, 500);
    }

    function appendStyle(css) {
        let s = document.createElement("style");
        s.type = "text/css";
        s.innerHTML = css;
        $("head").appendChild(s);
    }
})();