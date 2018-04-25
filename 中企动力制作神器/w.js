// ==UserScript==
// @name         中企动力制作神器
// @namespace    http://www.dongua.cc
// @version      1.1
// @description  try to take over the world!
// @author       WD
// @match        http://192.168.1.25*
// @match        http://*.pool2-site.make.yun300.cn*
// @match        http://*.pool1-site.make.yun300.cn*
// @match        http://design.yun300.cn/*
// @match        http://192.168.1.23:100/data/changework.asp*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    let body;
    let _copy;
    let _legendary;

    function _$() {
        return document.querySelector(arguments[0]);
    }
    function _$$() {
        return document.querySelectorAll(arguments[0]);
    }
    window.onload = function() {
        body = _$("body");
        _copy = copy();
        _legendary = Legendary();
        let legendarys = [["制作声明", "<!--由中企动力科技集团股份有限公司成都分公司技术部设计制作<br>如果您有任何意见或建议请电邮dm-chengdu@300.cn -->"]];
        legendarys.push(["时间戳: " + new Date().getTime(), new Date().getTime(), 'w-timestamps']);
        legendarys.push(["网站建设：中企动力成都", '<a href="http://www.300.cn/transport/welcom" target="_blank" title="网站建设">网站建设：中企动力</a><a href="http://www.300.cn/transport/chengdu" target="_blank" title="成都">成都</a>']);
        legendarys.push(['300官网', 'http://www.300.cn/transport/welcom']);
        legendarys.push(['分公司链接', 'http://www.300.cn/transport/chengdu']);
        legendarys.push(['备案号链接', 'http://www.miitbeian.gov.cn']);
        legendarys.push(['QQ链接', '<a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=747691474&site=qq&menu=yes"><img border="0" src="http://wpa.qq.com/pa?p=2:747691474:53" alt="点击这里给我发消息" title="点击这里给我发消息"/></a>']);
        legendarys.push(['报单', '设计初稿\r\n商务代表：商务 / 几部\r\n客户名称：\r\n订单类型：\r\n初稿地址：\r\n下单时间：\r\n出稿时间：\r\n客户需求分析：\r\n\r\n设计确认\r\n客户名称：\r\n订单类型：\r\n确认地址：\r\n确认时间：\r\n'
                         + '尾款情况：\r\n备案情况：\r\n录入员：\r\n\r\n网站验收\r\n客户名称：\r\n订单类型：\r\n商务部门/商务代表：\r\n'
                         + '预览地址：\r\n验收时间：\r\n\r\n网站发布\r\n客户名称：\r\n订单类型：\r\n发布域名：\r\n发布时间：\r\n是否特批：\r\n']);
        legendarys.push(['报单-验收发布', '网站验收\r\n客户名称：\r\n订单类型：\r\n商务部门/商务代表：\r\n'
                         + '预览地址：\r\n验收时间：\r\n\r\n网站发布\r\n客户名称：\r\n订单类型：\r\n发布域名：\r\n发布时间：\r\n是否特批：\r\n']);
        legendarys.push(['jQuery骨架', '<script type="text/javascript">\r\n\t$(function() {\r\n\t\t\\\\开始你的表演\r\n\t});\r\n</script>']);
        legendarys.push(['获取OM平台客户数据', '', 'w-getOM-data', getOMData]);
        legendarys.push(['英文转大写', '', 'w-word-toUpperCase', wordToUpperCase]);

        legendarys.map(function(v,i) {
            _legendary.start(v[0], v[1], v[2]||"", v[3]||"");
        });

        timestamps();
        document.body.oncopy = function(e){
            //console.log(e);
            //console.log(e.target.nodeName);
            if(e.target.nodeName == "TEXTAREA") {
              return;
            }
            event.returnValue = false;
            var selection = document.getSelection();
            var text = selection.toString();
            console.log(text);
            _$(".w-word-toUpperCase").dataset.content = text;
            //.createRange().text;
            //console.log(txt_cr);
            //clipboardData.setData('Text',txt_cr);
        };
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
            start:function(title, content, className, beforeFn) {
                let d = document.createElement("div");
                if(className) {
                    d.classList.add(className);
                }
                d.innerText = title;
                d.dataset.content = content;
                div.appendChild(d);
                d.classList.add("w-item");
                d.addEventListener("click", function() {
                    if(beforeFn) {
                        beforeFn(this);
                    }
                    _copy.copy(this);
                });
            }
        };
    }

    function timestamps() {
        let a = _$(".w-timestamps");
        setInterval(function() {
            var time = new Date().getTime();
            a.innerText = "时间戳: " + time;
            a.dataset.content = time;
        }, 2500);
    }

    function appendStyle(css) {
        let s = document.createElement("style");
        s.type = "text/css";
        s.innerHTML = css;
        _$("head").appendChild(s);
    }

    function wordToUpperCase(_this) {
        var words = _this.dataset.content;
        words = words.toUpperCase();
        console.log(words);
        _this.dataset.content = words;
    }

    function getOMData(_this) {
        if(!$("input[name='cash1']").length) {
            alert('灵妹儿友情提醒，该功能需要进入下单详情页才能使用哟~~~');
            return;
        }
        a();
        function a() {
            //签单金额
            var w1 = $("input[name='cash1']").val() || 0;
            //到账金额
            var w2 = $("input[name='cash2']").val() || 0;
            //商务
            var w3 = $("input[name='swdb']").val() || "";
            //商务部门
            var w4 = $("#swbm option:selected").val();
            //企业名称
            var w5 = $("input[name='qymc']").val() || "";
            //域名
            var w6 = $("input[name='yuming']").val() || "";
            //公司地址
            var w7 = $("input[name='dizhi']").val() || "";
            //联系人
            var w8 = $("input[name='khlxr']").val() || "";
            //电话
            var w9 = $("input[name='khtel']").val() || "";
            //制作类型
            var w10 = $("input[name='zzlx'][checked]").val();
            //签单日期
            var w11 = $("input[name='qdsj']").val() || "";
            //下单日期
            var w12 = $("input[name='xdsj']").val() || "";
            //备注
            var w13 = $("textarea[name='beizhu']").val() || "";
            // 合同号
            var w14 = $("#htbh").val() || "";

            var text = "";
            text += "合同号：" + w14;
            text += "\r\n";
            text += "签单金额：" + w1;
            text += "\r\n";
            text += "到账金额：" + w2;
            text += "\r\n";
            text += "尾款：" + (w1 - w2);
            text += "\r\n";
            text += "商务：" + $.trim(w3);
            text += "\r\n";
            text += "商务部门：" + $.trim(w4);
            text += "\r\n";
            text += "域名：" + $.trim(w6);
            text += "\r\n";
            text += "企业名称：" + $.trim(w5);
            text += "\r\n";
            text += "公司地址：" + $.trim(w7);
            text += "\r\n";
            text += "联系人：" + $.trim(w8);
            text += "\r\n";
            text += "电话：" + $.trim(w9);
            text += "\r\n";
            text += "制作类型：" + w10;
            text += "\r\n";
            text += "签单日期：" + w11;
            text += "\r\n";
            text += "下单日期：" + w12;
            text += "\r\n";
            text += "备注：\r\n" + $.trim(w13);
            _this.dataset.content = text;
        }
    }
})();