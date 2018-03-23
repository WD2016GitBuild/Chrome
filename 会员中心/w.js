// ==UserScript==
// @name         会员中心-登录
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       WD
// @match        https://account.300.cn/CAS/login
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var body = document.body;


    function daily_bg() {
        body.classList.add("w-daily-bg");
        var bg = document.createElement("div");
        bg.setAttribute("class", "w-bg");
        document.body.appendChild(bg);
    }

    function DOM(tag, class_name, id) {
        this.tag = tag;
        this.class_name = class_name||'';
        this.id = id||'';
        this.init = function() {
            var tag = document.createElement(tag);
            if(class_name) tag.setAttribute("class", class_name);
            if(id) tag.setAttribute("id", id);
        };
    }
    DOM.prototype.attr = function(_attribute, _attribute_value) {
        if(!_attribute) return;
        if(!_attribute_value) return;
        this.setAttribute(_attribute, _attribute_value);
    };
    DOM.prototype.addClass = function() {
    
    };

    var account = $("#username");
    var password = $("#passwd");
    var loginBtn = $("#login > div:nth-child(4) > button");

    function clear() {
        account.val("");
        password.val("");
    }

    function login(a, p) {
        var _a = a.split("");
        var _p = p.split("");
        autoTypeIn(_a, account);
        autoTypeIn(_p, password);

    }
    var autoTypeDownSign = 1;

    function autoTypeIn(text, target, fn) {
        var n = text.length;
        var i = 0;
        var t = "";
        clearInterval(s);
        var s = setInterval(function(){
            t += text[i];
            target.val("");
            target.val(t);
            i++;
            if(i > n -1 ) {
                clearInterval(s);
                autoTypeDownSign++;
                if(autoTypeDownSign > 2) {
                    loginBtn.trigger("click");
                    autoTypeDownSign = 1;
                    accountBtnClick = false;
                }
                return true;
            }
        }, 100);
    }

    var accountBtnClick = false;
    function Account(account, password, name) {
        this.account = account;
        this.password = password;
        this.name = name;

        this.init = function() {
            var _t = this;
            var div = document.createElement("div");
            var a = document.createElement("a");
            a.setAttribute("href", "javascript:");
            a.innerText = this.name;
            div.appendChild(a);
            loginBtnDiv.appendChild(div);
            a.addEventListener("click", function() {
                if(!accountBtnClick) {
                    accountBtnClick = true;
                    _t.login();}
            });
        };

        this.login = function() {
            login(this.account, this.password);
        };
    }
    var loginBtnDiv = document.createElement("div");
    loginBtnDiv.setAttribute("id", "login-btn");
    document.querySelector("body").appendChild(loginBtnDiv);

    var _b = document.querySelector("body");
    _b.classList.add("loaded");
    // Your code here...
})();