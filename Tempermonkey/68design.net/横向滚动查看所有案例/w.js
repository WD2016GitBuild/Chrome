var w = document.querySelector("#w");
if (!w) {
    w = document.createElement("div");
    w.setAttribute("id", "w");
    document.body.appendChild(w);
    var container = document.createElement("div");
    container.setAttribute("class", "container");
    w.appendChild(container);
    var ul = document.createElement("ul");
    container.appendChild(ul);
}

var head = document.querySelector("head");
var style = head.querySelector("w-style");
if (!style) {
    style = document.createElement("style");
    let s = "#w {background-color:#fff;width:100vw;height:100vh;overflow:hidden;box-sizing:border-box;position:fixed;top:0px;left:0px;z-index:9999;padding:20px;}";
    s += "#w .container {position:absolute;top:20px;left:20px;width:calc(100% - 20px);height:calc(100% - 20px);overflow:hidden;}";
    s += "#w ul {width:1000vw;position:relative;cursor:move;transition:1.2s;}"
    s += "#w img {width:500px;float:left;margin-left:30px;box-shadow:0px 0px 25px #aaa;position:relative;top:25px;}";
    s += "#w img:last-child{margin-left:0px;}"
    style.innerHTML = s;
    head.appendChild(style);
}

var imgs = document.querySelectorAll(".picview img");
var imgs_num = imgs.length;
for (let x of imgs) {
    let src = x.getAttribute("org");
    console.log(src);
    let img = document.createElement("img");
    img.src = src;
    ul.appendChild(img);
}

var ul_width = imgs_num * (500 + 30);
var ul_scroll = ul_width - window.innerWidth;
ul.style.width = ul_width + "px";
var mouse_down = false;
var mouse_down_x = 0;
var offset_x = 0;

document.onmousedown = function(e) {
    var x = e.pageX;
    console.log(e);
    console.log("mousedown: " + x);
    mouse_down_x = x;
    mouse_down = true;

    document.onmousemove = function(e) {
        var x = e.pageX;
        if (mouse_down) {
            offset_x = x - mouse_down_x;
            offset_x /= 12;
            var left = ul.style.left;
            if (left == "") {
                left = "0px";
            }
            left = parseInt(left.split("px")[0]) + offset_x;
            if (left > 0) {
                left = 0;
            }
            if (Math.abs(left) > ul_scroll) {
                left = -ul_scroll;
            }
            ul.style.left = left + "px";
        }
    }


    document.onmouseup = function(e) {
        document.onmousemove = document.onmouseup = null;
        mouse_down = false;
    }

    return false;
}
