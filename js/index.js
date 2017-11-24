/**
 * Created by createc on 2017/7/17.
 */

var swiperV = new Swiper('.swiper-container-v', {
    pagination: '.swiper-pagination-v',
    noSwipingClass : 'stop-swiping',
    effect : 'fade',
});
//获取URL参数函数
function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
var Request = new Object();
Request = GetRequest();
var score2 = Request['score'];
var rec2 = Request['rec'];

//通过分享进来的显示朋友最后的测试结果页面
var showShare = function () {
    if(score2){
        swiperV.slideTo(6, 0, true);
        result(score2,rec2);
    }
};

//检测是否测试过
var test = function () {
    if(!score2){
        if(window.localStorage.score && window.localStorage.rec == "undefined"){
            swiperV.slideTo(6, 0, true);
            var score3 = window.localStorage.score;
            result(score3,null);
            integralAdd2();
        }else if(window.localStorage.score && window.localStorage.rec){
            swiperV.slideTo(6, 0, true);
            var score3 = window.localStorage.score;
            var rec3 = window.localStorage.rec;
            result(score3,rec3);
            integralAdd2();
        }else{
            integralAdd();
        }
    }
}

//提示完成测试加积分
function integralAdd() {
    var M = {}
    // 判断是否已存在，如果已存在则直接显示
    if(M.dialog2){
        return M.dialog2.show();
    }
    M.dialog2 = jqueryAlert({
        'content' : '完成测试可获得20积分',
        'modal'   : true,
        'buttons' :{
            '确定' : function(){
                M.dialog2.close();
            }
        }
    })
}

//再次进来H5提示已经加个积分了
function integralAdd2() {
    var M = {}
    // 判断是否已存在，如果已存在则直接显示
    if(M.dialog2){
        return M.dialog2.show();
    }
    M.dialog2 = jqueryAlert({
        'content' : '您已获得积分，不再增加！',
        'modal'   : true,
        'buttons' :{
            '确定' : function(){
                M.dialog2.close();
            }
        }
    })
}

//获取积分接口
var apiUrl = 'http://nivea.sweetmartmarketing.com/crmSrv/transaction/saveTransactionOnline.do';
//获取时间
function CurentTime() {
    var now = new Date();
    var year = now.getFullYear();       //年
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日
    var hh = now.getHours();            //时
    var mm = now.getMinutes();          //分
    var ss = now.getSeconds();           //秒
    var clock = year + "-";
    if(month < 10)
        clock += "0";
    clock += month + "-";
    if(day < 10)
        clock += "0";
    clock += day + " ";
    if(hh < 10)
        clock += "0";
    clock += hh + ":";
    if (mm < 10) clock += '0';
    clock += mm + ":";
    if (ss < 10) clock += '0';
    clock += ss;
    return(clock);
}

//获取url参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if ( r != null ){
        return decodeURI(r[2]);
    }else{
        return null;
    }
}

//获取sign,参数对象,密匙
function signKey(obj,key) {
    var keys = Object.keys(obj);
    var newKeys = keys.sort();
    var newObjectArray = [];
    for(x in newKeys){
        var attr = newKeys[x];
        console.log(attr);
        if(obj[attr] === '' || obj[attr] === null || obj[attr] === undefined || obj[attr] === 'sign'){
            continue;
        }
        var val = attr + '=' +obj[attr];
        newObjectArray.push(val);
    }
    var str = newObjectArray.join('&');
    str += key;
    str = md5(str).toUpperCase();
    return str;
}

var myDate = new Date();

var memberFlag = false;
function member() {
    var obj = {};
    obj.openid = getQueryString('openid');
    // obj.member_uni_id = 'o3o4zxPMqVE6v1U-ewf5S2Y22eYI';
    obj.timestamp = myDate.getTime();
    obj.appid = getQueryString('appId');
    obj.state = 'wx';
    obj.sign = signKey(obj,'2AF0D0FD2B0640A3849684AB544265B9');
    $.ajax({
        url: 'http://nivea.sweetmartmarketing.com/crmSrv/member/checkMemberInfoByWMC.do',
        type: 'POST',
        data: obj,
//        dataType: "json",
        success: function (data) {
            var D = JSON.parse(data);
            if(D['status'] == '2'){
                memberFlag = true;
            }
            if(D['status'] == '1'){
                memberFlag = false;
            }
        }
    })
}

member()//查询是否是会员

//获取积分参数
function getIntegral(url,num,rem,flag) {
    var obj = {};
    obj.member_uni_id = getQueryString('openid');
    // obj.member_uni_id = 'o3o4zxPMqVE6v1U-eazXn5S2YeYI';
    obj.timestamp = myDate.getTime();
    obj.transaction_type_id = num;
    obj.transaction_time = CurentTime();
    obj.channel = '2';
    obj.remark = rem;
    obj.sign = signKey(obj,'2AF0D0FD2B0640A3849684AB544265B9');
    $.ajax({
        url:url,
        type:'POST',
        data:obj,
        success:function(data){
            var M = {};
            if(M.dialog3){
                return M.dialog1.show();
            }

            var D = JSON.parse(data);
            if(memberFlag){
                var jsonAlert= {
                    'content' : '',
                    'modal'   : true,
                    'buttons' :{
                        '确定' : function(){
                            M.dialog3.close();
                        },
                        '会员中心' : function(){
                            window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx36310fe660ca89bd&redirect_uri=http%3A%2F%2Fnivea.sweetmartmarketing.com%2FcrmSrv%2Fwx%2FzexWxNvy%3fappid%3dwx36310fe660ca89bd&response_type=code&scope=snsapi_userinfo&state=wx&component_appid=wx757dd6d09794aee2#wechat_redirect';
                        }
                    }
                }
            }else{
                var jsonAlert= {
                    'content' : '',
                    'modal'   : true,
                    'buttons' :{
                        '确定' : function(){
                            M.dialog3.close();
                        },
                        '加入会员' : function(){
                            window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx36310fe660ca89bd&redirect_uri=http%3A%2F%2Fnivea.sweetmartmarketing.com%2FcrmSrv%2Fwx%2FzexWxNvy%3fappid%3dwx36310fe660ca89bd&response_type=code&scope=snsapi_userinfo&state=wx&component_appid=wx757dd6d09794aee2#wechat_redirect';
                        }
                    }
                }
            }
            if(D['code'] == '40027'){
                if(flag == 1){
                    jsonAlert.content = '您已获得积分，不再增加！';
                    M.dialog3 = jqueryAlert(jsonAlert);
                }
                if(flag == 2){
                    jsonAlert.content = '您已获得分享积分，每日限1次！';
                    M.dialog3 = jqueryAlert(jsonAlert);
                }
            }
            //区别是否是会员的文案
            function content() {
                if(memberFlag){
                    if(flag == 1){
                        jsonAlert.content = '获得20积分，点击查看！';
                        M.dialog3 = jqueryAlert(jsonAlert);
                    }
                    if(flag == 2){
                        jsonAlert.content = '分享获得积分30积分，点击查看！';
                        M.dialog3 = jqueryAlert(jsonAlert);
                    }
                }else{
                    if(flag == 1){
                        jsonAlert.content = '获得20积分，加入会员查看！';
                        M.dialog3 = jqueryAlert(jsonAlert);
                    }
                    if(flag == 2){
                        jsonAlert.content = '分享获得积分30积分，加入会员查看！';
                        M.dialog3 = jqueryAlert(jsonAlert);
                    }
                }
            }
            if(D['code'] == '40029'){
                content();
            }
            if(D['code'] == '200'){
                content();
            }
        }
    })
}



//完成测试后,显示测试结果和推荐的产品
var result = function (score,rec) {
    if(score<5 || score==5){
        if(rec){
            if(rec == 'hb'){var oDiv = $(" <a href='https://item.jd.com/4868968.html'><img onclick='statistics(1)' class='hb' src='img/page7/hb.png' alt=''></a>"); var oImg = $("<img class='score' src='img/page7/p1.png' alt=''>");}
            if(rec == 'hl'){var oDiv = $(" <a href='https://item.jd.com/1060483.html'><img onclick='statistics(2)' class='hl' src='img/page7/hl.png' alt=''></a>"); var oImg = $("<img class='score' src='img/page7/p1.png' alt=''>");}
            if(rec == 'sa'){var oDiv = $(" <a href='https://item.jd.com/4323374.html'><img onclick='statistics(3)' class='sa' src='img/page7/sa.png' alt=''></a>"); var oImg = $("<img class='score' src='img/page7/p1.png' alt=''>");}
        }else {
            var oDiv = $(" <a href='https://item.jd.com/1322829.html'><img onclick='statistics(4)' class='bs' src='img/page7/bs.png' alt=''></a>");
            var oImg = $("<img class='score' src='img/page7/p1.png' alt=''>");
        }
        $(".page7").append(oImg);
        $(".page7").append(oDiv);
    }else if( (score>5&&score<10) || score==10){
        if(rec){
            if(rec == 'hb'){var oDiv = $(" <a href='https://item.jd.com/4868968.html'><img onclick='statistics(1)' class='hb' src='img/page7/hb.png' alt=''></a>"); var oImg = $("<img class='score' src='img/page7/p2.png' alt=''>");}
            if(rec == 'hl'){var oDiv = $(" <a href='https://item.jd.com/1060483.html'><img onclick='statistics(2)' class='hl' src='img/page7/hl.png' alt=''></a>"); var oImg = $("<img class='score' src='img/page7/p2.png' alt=''>");}
            if(rec == 'sa'){var oDiv = $(" <a href='https://item.jd.com/4323374.html'><img onclick='statistics(3)' class='sa' src='img/page7/sa.png' alt=''></a>"); var oImg = $("<img class='score' src='img/page7/p5.png' alt=''>");}
        }else {
            var oDiv = $(" <a href='https://item.jd.com/1060483.html'><img onclick='statistics(2)' class='hl' src='img/page7/hl.png' alt=''></a>");
            var oImg = $("<img class='score' src='img/page7/p2.png' alt=''>");
        }
        $(".page7").append(oDiv);
        $(".page7").append(oImg);
    }else if((score>10&&score<15) || score==15){
        if(rec){
            if(rec == 'hb'){var oDiv = $(" <a href='https://item.jd.com/4868968.html'><img onclick='statistics(1)' class='hb' src='img/page7/hb.png' alt=''></a>"); var oImg = $("<img class='score' src='img/page7/p3.png' alt=''>");}
            if(rec == 'hl'){var oDiv = $(" <a href='https://item.jd.com/1060483.html'><img onclick='statistics(2)' class='hl' src='img/page7/hl.png' alt=''></a>"); var oImg = $("<img class='score' src='img/page7/p3.png' alt=''>");}
            if(rec == 'sa'){var oDiv = $(" <a href='https://item.jd.com/4323374.html'><img onclick='statistics(3)' class='sa' src='img/page7/sa.png' alt=''></a>"); var oImg = $("<img class='score' src='img/page7/p3.png' alt=''>");}
        }else {
            var oImg = $("<img style='width:53%;top:25%;left:15%' class='score' src='img/page7/p3.png' alt=''>");
            var oDiv = $(" <a href='https://item.jd.com/1711633.html'><img onclick='statistics(5)' class='ky' src='img/page7/ky.png' alt=''></a>");
        }
        $(".page7").append(oImg);
        $(".page7").append(oDiv);
    }else {
        if(rec){
            if(rec == 'hb'){var oDiv = $(" <a href='https://item.jd.com/4868968.html'><img onclick='statistics(1)' class='hb' src='img/page7/hb.png' alt=''></a>"); var oImg = $("<img class='score' src='img/page7/p4.png' alt=''>");}
            if(rec == 'hl'){var oDiv = $(" <a href='https://item.jd.com/1060483.html'><img onclick='statistics(2)' class='hl' src='img/page7/hl.png' alt=''></a>"); var oImg = $("<img class='score' src='img/page7/p4.png' alt=''>");}
            if(rec == 'sa'){var oDiv = $(" <a href='https://item.jd.com/4323374.html'><img onclick='statistics(3)' class='sa' src='img/page7/sa.png' alt=''></a>"); var oImg = $("<img class='score' src='img/page7/p4.png' alt=''>");}
        }else {
            var oImg = $("<img class='score' src='img/page7/p4.png' alt=''>");
            var oDiv = $(" <a href='https://item.jd.com/4033371.html'><img onclick='statistics(6)' class='slj' src='img/page7/slj.png' alt=''></a>");
        }
        $(".page7").append(oImg);
        $(".page7").append(oDiv);
    }

    //微信分享,接受参数传值
    wx.ready(function () {
        wx.onMenuShareTimeline({
            title: 'NIVEA MEN', // 分享标题
            link: "http://niveamen.watchinga.net/pfcscs/share.html?score="+score+"&res="+rec+"", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'http://niveamen.watchinga.net/pfcs/img/logo.png', // 分享图标
            success: function () {
                _hmt.push(['_trackEvent', '分享', '朋友圈', 'literature']);
                getIntegral(apiUrl,'11052','内容分享获取积分',2);
            }
        });
        wx.onMenuShareAppMessage({
            title: 'NIVEA MEN', // 分享标题
            desc: 'NIVEA MEN', // 分享描述
            link: "http://niveamen.watchinga.net/pfcscs/share.html?score="+score+"&res="+rec+"", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'http://niveamen.watchinga.net/pfcs/img/logo.png', // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                _hmt.push(['_trackEvent', '分享', '朋友', 'literature']);
                getIntegral(apiUrl,'11052','内容分享获取积分',2);
            }
        });
    })
}
showShare();//分享页进来的
test();

//问题数据
var qusAry = [];
//首页随机数
setInterval(function () {
    var num = Math.round(Math.random()*100);
    var num2 = Math.round(Math.random()*100);
    $("#num1").text(num);
    $("#num2").text(num2);
},100);
//随机出现文字
setInterval(function () {
    var ary = ['','干燥','出油','黑头','敏感','暗哑','痘痘'];
    var num1 = Math.floor(Math.random()*6 + 1);
    var num2 = Math.floor(Math.random()*6 + 1);
    $(".random1").text(ary[num1]);
    $(".random2").text(ary[num2]);
    $(".random3").text(ary[num1]);

},1000);

//点击选择年龄
$(".age").click(function () {
    var index = $(".age").index($(this));
    $(".age1").css("display","none");
    $(".age").css("display","block");
    $(this).css("display","none");
    $(".age1").eq(index).css("display","block");
})
//点击选择性别
$(".sex").click(function () {
    var index = $(".sex").index($(this));
    $(".sex1").css("display","none");
    $(".sex").css("display","block");
    $(this).css("display","none");
    $(".sex1").eq(index).css("display","block");
})

//点击第一个开始测试跳出浮层
$("#btn-begin").click(function () {
    $(".mask,.xinxi,#btn-begin2").fadeIn(500);
});

//点击第二个开始测试
$("#btn-begin2").click(function () {
    var flag1 = false;
    var flag2 = false;
    var ageNum;
    var sexNum;
    var M = {};
    if(M.dialog1){
        return M.dialog1.show();
    }
    for(var i=0;i<$(".age1").length;i++){
        if($(".age1").eq(i).css("display") == "block"){
            flag1 = true;
            ageNum = i;
        }
    }
    for(var i = 0;i<$(".sex1").length;i++){
        if($(".sex1").eq(i).css("display") == "block"){
            flag2 = true;
            sexNum = i;
        }
    }
    if(!flag1&&!flag2){
        M.dialog1 = jqueryAlert({
            'content' : '请选择年龄和性别!',
            'closeTime' : 2000
        })
    }else if(flag1&&!flag2){
        M.dialog1 = jqueryAlert({
            'content' : '请选择性别!',
            'closeTime' : 2000
        })
    }else if(!flag1&&flag2){
        M.dialog1 = jqueryAlert({
            'content' : '请选择年龄!',
            'closeTime' : 2000
        })
    }else {
        if(ageNum ==0 ){ageNum = '18-24'}
        if(ageNum ==1 ){ageNum = '25-29'}
        if(ageNum ==2 ){ageNum = '30-34'}
        if(ageNum ==3 ){ageNum = '35up'}
        var qus1 = "{'field_code':'Q01','field_name':'您的性别?','optionList':[{'option_code':'1','option_name':'"+sexNum+"','channel':'2','remark':'test','add_time':'"+CurentTime()+"'}]}";
        var qus2 = "{'field_code':'Q02','field_name':'您的年纪?','optionList':[{'option_code':'1','option_name':"+ageNum+",'channel':'2','remark':'test','add_time':'"+CurentTime()+"'}]}";
        $.ajax({
            url:'sql.php',
            type:'POST',
            async: false,
            data:{sex:sexNum,age:ageNum},
            dataType: "json",
            success:function(data){
        
            }
        })
        qusAry.push(qus1,qus2);
        console.log(qusAry);
        console.log(qusAry.toString());
        $(".anm1,.anm2,.anm3").css("display","block");
        swiperV.slideTo(1, 1000, true);
        $("#myCanvas").fadeIn();
        gif = setInterval(animation,30);
    }
});
var score = 0;//分数
var rec;
var qusNum = 2;
//点击继续答题的函数
var answerFun = function (num) {
    if(num == 1){var quse = '日常每天洗脸几次?';}
    if(num == 2){var quse = '每次洗完脸后最大的感受是?';}
    if(num == 3){var quse = '如果想改变自己的皮肤，最想改变的地方是?';}
    if(num == 4){var quse = '一年四季，你如何使用护肤品';}
    if(num == 5){var quse = '使用完护肤品最好的体验感受是?';}
    var flag = 1;
    var ans = $("#question"+num+" div");
    for(var i=0;i<ans.length;i++){
        if(ans.eq(i).html() != ""){
            flag = 0;
            var s = ans.eq(i).attr('score');
            score = score + parseInt(s);
            var r = ans.eq(i).attr('rec');
            qusNum++;
            var Qdata = "{'field_code':'Q0"+qusNum+"','field_name':'"+quse+"','optionList':[{'option_code':'1','option_name':'"+ans.eq(i).attr('ans')+"','channel':'2','remark':'test','add_time':'"+CurentTime()+"'}]}";
            qusAry.push(Qdata);
            if(!rec){
                rec = r;
            }
            swiperV.slideTo(num+1, 1000, true);
            $("#myCanvas").fadeIn();
            gif = setInterval(animation,30);
        }
    }
    if(flag==1){
        var M = {};
        if(M.dialog1){
            return M.dialog1.show();
        }
        M.dialog1 = jqueryAlert({
            'content' : '请选择答案!',
            'closeTime' : 2000
        })
    }
    if(num ==5 ){
        $(".anm2").css("top","65%");
        localStorage.score = score;
        localStorage.rec = rec;
        result(score,rec);
        _hmt.push(['_trackEvent', 'Q5', '完成测试', 'literature']);

        //完成测试获得积分
        getIntegral(apiUrl,'11051','打开活动链接获取积分',1);
        //发送答案数据
        var obj2 = {};
        obj2.member_uni_id = getQueryString('openid');
        // obj2.member_uni_id = 'o3o4zxPMqVE6v1U-eazXn5S2YeYI';
        obj2.timestamp = myDate.getTime();
        obj2.memberExList = "["+qusAry.toString()+"]";
        obj2.sign = signKey(obj2,'2AF0D0FD2B0640A3849684AB544265B9');
        console.log(obj2.memberExList);
        $.ajax({
            url:'http://nivea.sweetmartmarketing.com/crmSrv/member/saveMemberEx.do',
            type:'POST',
            data:obj2,
//        dataType: "json",
            success:function(data){

            }
        })
        
        
    }
}

//点击答案出现小圆圈
$(".answerBox div,.answerBox2 div").click(function () {
    var oImg = $("<img class='answer-quan' src='img/public/dian.png' alt=''>");
    $(".answerBox div,.answerBox2 div").html("");
    $(this).append(oImg);
})

//再玩一次
$("#again").click(function () {
    _hmt.push(['_trackEvent', '再玩一次', '次数', 'literature']);
    qusAry = [];
    localStorage.removeItem("score");
    localStorage.removeItem("rec");
    window.location.href="http://niveamen.watchinga.net/pfcscs/share.html";
});

//控制canvas的宽高
var WH = function () {
    var w = window.innerWidth * 0.51;
    var h = window.innerHeight * 0.24;
    var canvas = document.getElementById("myCanvas");
    canvas.height = h;
    canvas.width = w;
}
WH();

//统计函数
function statistics(num) {
    if(num==1){_hmt.push(['_trackEvent', '产品系列', '焕白', 'literature'])};
    if(num==2){_hmt.push(['_trackEvent', '产品系列', '活力', 'literature'])};
    if(num==3){_hmt.push(['_trackEvent', '产品系列', '舒安', 'literature'])};
    if(num==4){_hmt.push(['_trackEvent', '产品系列', '保湿', 'literature'])};
    if(num==5){_hmt.push(['_trackEvent', '产品系列', '控油', 'literature'])};
    if(num==6){_hmt.push(['_trackEvent', '产品系列', '水龙卷', 'literature'])};
}

//播放帧动画
var a = 0;
var b = 0;
var animation = function () {
    var canvas = document.getElementById('myCanvas');
    var h = canvas.height;
    var w = canvas.width;
    var ctx=canvas.getContext('2d');
    var image = new Image();
    image.src = "img/public/dsxg.png";
    b++;
    if(b>5){
        b=0;
        a++;
    }
    if(b==5&&a==3){
        a=0;
        b=0;
        clearInterval(gif);
        $("#myCanvas").fadeOut(500);
    }
    ctx.drawImage(image,a*202,b*167,202,167,0,0,w,h);
};
var gif = setInterval(animation,30);
//控制音乐
$("#music").click(function () {
    var x = document.getElementById("media");
    $("#musicBg").toggleClass("rotate"); //控制音乐图标 自转或暂停
    //控制背景音乐 播放或暂停
    // if($("#musicBg").hasClass("rotate")){
    //     x.play();
    // }else {
    //     x.pause();
    // }
});

//点击分享出现浮层
$("#share").click(function () {
    $(".mask2").fadeIn(500);
    $(".fx").fadeIn(500);
    $(".random3").fadeIn(500);
    $("#musicBg,#music").fadeOut(500);
});

//点击浮层消失
$(".mask2").click(function () {
    $(".mask2").fadeOut(500);
    $(".fx").fadeOut(500);
    $(".random3").fadeOut(500);
    $("#musicBg,#music").fadeIn(500);
});

//微信ios音乐控制
function audioAutoPlay(id){
    var audio = document.getElementById(id),
        play = function(){
            audio.play();
            document.removeEventListener("touchstart",play, false);
        };
    audio.play();
    document.addEventListener("WeixinJSBridgeReady", function () {
        play();
    }, false);
    document.addEventListener('YixinJSBridgeReady', function() {
        play();
    }, false);
    document.addEventListener("touchstart",play, false);
}
// audioAutoPlay('media');

//微信禁止下拉显示
var eventlistener_handler = function(e){
    e.preventDefault();     // 阻止浏览器默认动作(网页滚动)
};
var touchInit = function(){
    document.body.addEventListener("touchmove",eventlistener_handler, false);
};
touchInit();

//微信api操作
var url = window.location.href;
var appid;
var timestamp;
var nonceStr;
var signature;
$.ajax({
    url:'http://niveamen.watchinga.net/rm/web/jsticket',
    type:'POST',
    async: false,
    data:{url:url},
    dataType: "json",
    success:function(data){
        appid = data['appId'];
        timestamp = data['timestamp'];
        nonceStr = data['nonceStr'];
        signature = data['signature'];
    }
})

wx.config({
    debug: false,
    appId: appid,
    timestamp: timestamp,
    nonceStr: nonceStr,
    signature: signature,
    jsApiList: [
        // 所有要调用的 API 都要加到这个列表中,,,,,
        "onMenuShareTimeline",
        "onMenuShareAppMessage",
        "checkJsApi",
        "chooseImage",
        "uploadImage",
    ]
});

//微信分享,接受参数传值
wx.ready(function () {
    wx.onMenuShareTimeline({
        title: 'NIVEA MEN', // 分享标题
        link: "http://niveamen.watchinga.net/pfcscs/share.html", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: 'http://niveamen.watchinga.net/pfcs/img/logo.png', // 分享图标
        success: function () {
            _hmt.push(['_trackEvent', '分享', '朋友圈', 'literature']);
            getIntegral(apiUrl,'11052','内容分享获取积分',2);
        }
    });
    wx.onMenuShareAppMessage({
        title: 'NIVEA MEN', // 分享标题
        desc: 'NIVEA MEN', // 分享描述
        link: "http://niveamen.watchinga.net/pfcscs/share.html", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: 'http://niveamen.watchinga.net/pfcs/img/logo.png', // 分享图标
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
            _hmt.push(['_trackEvent', '分享', '朋友', 'literature']);
            getIntegral(apiUrl,'11052','内容分享获取积分',2);
        },
        cancel: function () {

        }
    });
})
