// ==UserScript==
// @name         699滚动加载数据
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://699pic.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var s = document.createElement("script");
    document.querySelector("head").appendChild(s);
    var step = 1;
    var container;
    s.onload = function() {
        $(".RightNav").hide();
        if($(".imgshow .list").length == 0) {
            return;
        }
        if($(".pager-linkPage a").length < 1) {
            return;
        }
        $(".pagelist").hide();
        $("head").append('<style>.imgshow .list{width: calc((100% - 4px*8*2)/8) !important;height:300px !important;}</style>');
        $("head").append('<style>.imgshow .list img{height:100%;object-fit:cover;}</style>');
        container = $(".swipeboxEx");
        $(window).scroll(function() {
            if($(window).height() + $(window).scrollTop() > $("#footer").offset().top - 200) {
                load();
            }
        });
    };
    s.src = "http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js";
    function load() {
        var current = $(".pager-linkPage .current");
        var next = current.next().attr("href");
        $.get(next, function(r) {
            var s = $(r);
            if(next.length == 0) {
                return;
            }
            container.append(s.find("div.list").each(function() {
                $(this).find("img").attr("src", $(this).find("img").attr("data-original"));
            }));
            $(".pager-linkPage").empty().append(s.find(".pager-linkPage").children());
            current++;
            step--;
            if(step > 0) {
                load();
            } else {
                step = 1;
            }
        });
    }
})();