// ==UserScript==
// @name         盯质检
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       WD
// @match        http://dws.300.cn/userManage/toMain
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    let _all_orders = [];
    const _headers = {
        "Accept": "text/html, */*; q=0.01",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Content-Length": "313",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Cookie": "SESSION_COOKIE=dws-web3; JSESSIONID=198A08951B387B62A05933A7926FF751",
        "Host": "dws.300.cn",
        "Origin": "http://dws.300.cn",
        "Pragma": "no-cache",
        "Referer":"http://dws.300.cn/userManage/toMain",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3438.3 Safari/537.36",
        "X-Requested-With": "XMLHttpRequest"
    };

    let dom = (()=>{
        let append_style = (s)=>{
            $("head").append("<style>" + s + "</styel>");
        };

        let find = (selector) => {
            return document.querySelector(selector);
        };

        let find_all = (selector) => {
            return document.querySelectorAll(selector);
        };

        return {
            append_style:append_style,
            find:find,
            find_all:find_all
        };
    })();

    let data_manager = (()=>{
        var set = (a,b)=>{
            localStorage.setItem(a, b);
        };
        var get = (a) =>{
            return localStorage.getItem(a);
        };
        var remove = (a)=>{
            localStorage.removeItem(a);
        };
        return {
            set:set,
            get:get,
            remove:remove
        };
    })();

    let ajax = (()=>{
        let get = (url, headers, callback)=>{
            fetch(url, headers).then(res=>{
                return res.text();
            }).then((res)=>{
                callback(res);
            }).catch(e=>{
                console.log("wd -- error -- " + e);
            });
        };
        let post = (url, headers, callback)=>{
            fetch(url, headers).then(res=>{
                return res.text();
            }).then((res)=>{
                callback(res);
            }).catch(e=>{
                console.log("wd -- error -- " + e);
            });
        };
        return {
            get:get,
            post:post
        };
    })();

    let order = (()=>{
        const get_customer_info = (order_id)=>{
            ajax.post("http://dws.300.cn/order/findCustInfoInOrder", {
                "credentials":"include",
                "headers":_headers,
                "referrer":"http://dws.300.cn/userManage/toMain",
                "referrerPolicy":"no-referrer-when-downgrade",
                "body":"orderId=" + order_id,
                "method":"POST",
                "mode":"cors"
            }, (res)=>{
                res = JSON.parse(res);
                res = res.result;
                let order = {};
                order[res.companyName + "_" + res.contractCode] = res;
                _all_orders.push(order);
            });
        };

        const get_making_orders = ()=>{
            ajax.get("http://dws.300.cn/order/listOrderProcessMaking", {
                "credentials":"include",
                "headers":_headers,
                "referrer":"http://dws.300.cn/userManage/toMain",
                "referrerPolicy":"no-referrer-when-downgrade",
                "body":null,
                "method":"GET",
                "mode":"cors"
            }, (res)=>{
                let list = $(res);
                list = list.find("#orderListTable > tbody > tr");
                list.each(function() {
                    let tds = $(this).find("td");
                    let ht_num = tds.eq(1).text();
                    let name = tds.eq(2).text();
                    var order_num = tds.eq(3).find("button").eq(1).attr("onclick").split("('")[1].split("'")[0];
                    console.log(ht_num + " " + name + " " + order_num);
                });
            });
        };

        const wait_publish = ()=> {
            ajax.get("http://dws.300.cn/order/listOrderWaitPublish", {
                "credentials":"include",
                "headers":_headers,
                "referrer":"http://dws.300.cn/userManage/toMain",
                "referrerPolicy":"no-referrer-when-downgrade",
                "body":null,
                "method":"GET",
                "mode":"cors"
            }, (res)=>{
                let list = $(res);
                list = list.find("#orderListTable tbody tr");
                list.each(function() {
                    let tds = $(this).find("td");
                    let ht_num = tds.eq(1).text();
                    let name = tds.eq(2).text();
                });
            });
        };

        return {
            get_customer_info:get_customer_info,
            get_making_orders:get_making_orders,
            wait_publish:wait_publish
        };
    })();

    order.get_customer_info("56988");
    order.get_making_orders();
    order.wait_publish();

    let timer = (fn, time)=>{
        return setInterval(fn, time);
    };

    timer(()=>{
        var a = $("#orderListTable > tbody > tr > td > button:contains('提交质检')");
        console.log(a.length);
    }, 1000);
})();
