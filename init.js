var options = {
    width: '100%',
    height: '100%',
    timenav_position: 'top',
    language: '/widgets/timeline-sy/timeline3/js/locale/zh-cn.json',
    font: '/widgets/timeline-sy/font.default.modified.css',
    default_bg_color: 'white',
    start_at_end: false,
    start_at_slide: 0,
    initial_zoom: 0
};

// 随思源主题自动切换主题
// https://ld246.com/article/1653294035002/comment/1653327149164?r=bgt#comments
if (window.top.siyuan&&window.top.siyuan.config.appearance.mode === 1) {
    var obj = document.getElementById("timelinetheme");
    obj.setAttribute("href", "timeline3/css/themes/timeline.theme.dark.css");
    options.default_bg_color = "#000000";
}

var id = ''

if (window.frameElement) {
    id = window.frameElement.parentElement.parentElement.dataset.nodeId;
}

else {
    const search = location.search
    const obj = new URLSearchParams(search);
    id = obj.get('blockid')
}
window.baseid = id
var dataobject = {
    "title": {
        "text": {
            "headline": "时间线",
            "text": ""
        }
    },
    "events": [
        {
            "start_date": {
                "year": "",
                "month": "",
                "day": ""
            },
            "text": {
                "headline": "创建了时间线",
                "text": ""
            },
            "unique_id": "create_timeline"
        }
    ],
}

$.ajax({
    type: "POST",
    url: "/api/attr/getBlockAttrs",
    data: JSON.stringify({
        "id": id
    }),
    success(res) {
        if (res.data["custom-dataobject"] == undefined) {
            var init_date = new Date();
            dataobject.events[0].start_date.year = init_date.getFullYear();
            dataobject.events[0].start_date.month = init_date.getMonth() + 1;
            dataobject.events[0].start_date.day = init_date.getDate();
        } else {
            //若有已保存的数据，读取数据
            var dataobj = res.data["custom-dataobject"].replaceAll("&quot;", "\"");
            var dataobj = dataobj.replaceAll("&lt;", "\<");
            var dataobj = dataobj.replaceAll("&gt;", "\>");
            dataobject = JSON.parse(dataobj);

            var dataevents = dataobject.events;
            var tmp;
            for (i = 0, len = dataevents.length; i < len; i++) {
                tmp = dataevents[i].start_date.data;
                delete dataevents[i].start_date.data;
                // delete tmp.date_obj;    // 删不删没区别
                // delete tmp.format;
                // delete tmp.format_short;
                dataevents[i].start_date = tmp;

                if (dataevents[i].end_date != undefined) {
                    tmp = dataevents[i].end_date.data;
                    delete dataevents[i].end_date.data;
                    dataevents[i].end_date = tmp;
                }
            }
            dataobject.events = dataevents;
        }
        timeline = new TL.Timeline('Timeline', dataobject, options);
    }
})