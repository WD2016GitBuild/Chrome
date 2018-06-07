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
    // 所有请求次数，当为0时，渲染结果
    let all_request_num = 0;

    // 制作中
    let _make_orders = {};
    // 打回
    let _dahiu_order = {};
    // 质检待领取
    let zjdlq_orders = {};
    // 质检中
    let zjz_orders = {};
    // 待发布
    let wait_publish_orders = {};

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

    dom.append_style('.w-inspection .status{display:inline-block;padding:10px 20px;background-image:linear-gradient(120deg,#e0c3fc 0,#8ec5fc 100%);font-size:14px;color:#fff;font-size:14px;border-radius:50px;box-shadow:1px 1px 5px #ddd;position:fixed;bottom:10px;right:10px;z-index:999}.w-inspection .status span{font-size:14px;vertical-align:middle}.w-inspection .status .switch{width:40px;height:20px;border:1px solid #fff;border-radius:50px;display:inline-block;vertical-align:middle;position:relative;overflow:hidden;cursor:pointer;transition:1s;margin-left:5px}.w-inspection .status .switch b{width:16px;height:16px;background-color:#fff;border-radius:50%;display:block;position:absolute;top:1px;left:2px;transition:1s}.w-inspection .status .switch.on{border-color:#ff0}.w-inspection .status .switch.on b{left:calc(100% - 16px - 2px);background-color:#ff0}.w-inspection .list{position:fixed;top:126px;right:-100vw;z-index:999;transition:1s}.w-inspection .list.show{right:10px}.w-inspection .list div.a{margin-bottom:0;transition:1s}.w-inspection .list div.a:after{content:"";display:block;clear:both}.w-inspection .list div.a .item{display:inline-block;background-image:linear-gradient(135deg,#667eea 0,#764ba2 100%);padding:10px 35px;color:#fff;font-size:14px;border-radius:50px;margin-bottom:5px;float:right}.w-inspection .list div.a .item b{font-weight:400;background-color:#fff;border-radius:50px;color:#333;padding-left:10px;padding-right:10px;overflow:hidden;position:relative;vertical-align:middle;margin-left:5px}.w-inspection .list div.a .item b:before{content:"";display:inline-block;background-color:#333;width:14px;height:5px;border-radius:150px;vertical-align:middle;margin-right:5px;position:relative;top:-1px}.w-inspection .list div.a .item b.make:before{background-image:linear-gradient(to right,#f77062 0,#fe5196 100%);color:#fff}.w-inspection .list div.a .item b.publish:before{background-image:linear-gradient(to left,#0fd850 0,#f9f047 100%);color:#333}');

    let data_manager = (()=>{
        let set = (a,b)=>{
            localStorage.setItem(a, b);
        };
        let get = (a) =>{
            return localStorage.getItem(a);
        };
        let remove = (a)=>{
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
        // 获取客户数据
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
                console.log(res.orderStatusName);
                if(res.orderStatusName == "制作中") {
                    _make_orders[res.contractCode + "-" + res.memberName] = res;
                } else if(res.orderStatusName == "质检待领取") {
                    zjdlq_orders[res.contractCode + "-" + res.memberName] = res;
                } else if(res.orderStatusName == "质检中") {
                    zjz_orders[res.contractCode + "-" + res.memberName] = res;
                    // 将质检中的订单存入打回订单中
                    // 如果制作订单和打回订单都存在这个订单信息，那就是被打回了
                    _dahiu_order[res.contractCode + "-" + res.memberName] = res;
                }
                console.log(_make_orders);
                all_request_num--;
                console.log(all_request_num);
                if(all_request_num === 0) {
                    rendering_result();
                }
            });
        };

        // 制作中的客户
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
                // 所有请求次数
                all_request_num = list.length + 1;
                console.log(all_request_num);
                list.each(function() {
                    let tds = $(this).find("td");
                    let ht_num = tds.eq(1).text();
                    let name = tds.eq(2).text();
                    let order_num = tds.eq(3).find("button").eq(1).attr("onclick").split("('")[1].split("'")[0];
                    get_customer_info(order_num);
                });
                wait_publish();
            });
        };

        // 待发布的客户
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
                    let ht_num_name = ht_num + "-" + name;
                    wait_publish_orders[ht_num_name] = {
                        companyName:name,
                        orderStatusName:"待发布"
                    };
                    if(!data_manager.get(ht_num_name)) {
                        delete _dahiu_order[ht_num_name];
                        data_manager.set(ht_num + "-" + name, "已发布");
                        alert("订单：" + ht_num + "\n名称：" + name + "\n质检过啦~~~~~");
                    }
                });
                all_request_num--;
                if(all_request_num === 0) {
                    rendering_result();
                }
            });
        };

        // 构建基本的html结构
        const build_base_html = ()=> {
            let h = '<div class="w-inspection"><div class="status"><span>质检</span><div class="switch"><b></b></div></div><div class="list"><div class="a"></div></div></div>';
            $("body").append(h);
            let w = $(".w-inspection");
            let status = w.find(".status");
            let list = w.find(".list");
            let list_a = list.find(".a");
            let b = w.find(".switch");
            if(data_manager.get("switch") == 1) {
                b.addClass("on");
                list.addClass("show");
            }
            b.click(()=>{
                b.toggleClass("on");
                list.toggleClass("show");
                if(b.hasClass("on")) {
                    data_manager.set("switch", 1);
                } else {
                    data_manager.set("switch", 0);
                }
            });
            return {
                w:w,
                status:status,
                list:list,
                empty:()=>{
                    list_a.empty();
                },
                add:(name, status_class, status_text)=>{
                    let h = '<div class="item"><span>#name#</span><b class="#status_class">#status_text#</b></div><div class="clear"></div>';
                    h = h.replace("#name#", name);
                    h = h.replace("#status_class#", status_class);
                    h = h.replace("#status_text#", status_text);
                    list_a.append(h);
                }
            };
        };
        let _build_base_html = build_base_html();

        // 渲染结果
        const rendering_result = ()=> {
            for(let a in zjdlq_orders) {
                _build_base_html.add(zjdlq_orders[a].companyName, "wait-inspecte", zjdlq_orders[a].orderStatusName);
            }
            for(let a in zjz_orders) {
                _build_base_html.add(zjz_orders[a].companyName, "inspecting", zjz_orders[a].orderStatusName);
            }
            for(let a in _dahiu_order) {
                let result = false;
                for(let b in _make_orders) {
                    if(b[a]) {
                        result = true;
                    }
                }
                if(result) {
                    _build_base_html.add(_dahiu_order[a].companyName, "fail-inspecte", _dahiu_order[a].orderStatusName);
                }
            }
            for(let a in wait_publish_orders) {
                _build_base_html.add(wait_publish_orders[a].companyName, "wait-publish", wait_publish_orders[a].orderStatusName);
            }
        };

        // 重置对象，删除所有属性
        const reset_object = (obj)=> {
            for(let a in obj) {
                delete obj[a];
            }
        };

        // 清除所有状态订单
        // 除了打回数据项
        const clear_all_orders = ()=> {
            reset_object(_make_orders);
            reset_object(_dahiu_order);
            reset_object(zjdlq_orders);
            reset_object(wait_publish_orders);
        };

        return {
            get_customer_info:get_customer_info,
            get_making_orders:get_making_orders,
            wait_publish:wait_publish
        };
    })();

    order.get_making_orders();

    let timer = (fn, time)=>{
        return setInterval(fn, time);
    };

    timer(()=>{
        let a = $("#orderListTable > tbody > tr > td > button:contains('提交质检')");
        //console.log(a.length);
    }, 1000);
})();