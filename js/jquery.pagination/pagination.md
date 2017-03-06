插件简介
此jQuery插件为Ajax分页插件，一次性加载，故分页切换时无刷新与延迟，如果数据量较大不建议用此方法，因为加载会比较慢。
原插件CSS不太合理，使用浮动，故无法方便实现左右方向的定位，且未清除浮动，在中文修改版中我对其进行了优化，使其支持text-align的定位。
使用方法
跟一般的jQuery插件一样，此插件使用也很简单便捷。方法是pagination，例如$("#page").pagination(100);
参数
参数名	描述	参数值
maxentries	总条目数	必选参数，整数
items_per_page	每页显示的条目数	可选参数，默认是10
num_display_entries	连续分页主体部分显示的分页条目数	可选参数，默认是10
current_page	当前选中的页面	可选参数，默认是0，表示第1页
num_edge_entries	两侧显示的首尾分页的条目数	可选参数，默认是0
link_to	分页的链接	字符串，可选参数，默认是"#"
prev_text	“前一页”分页按钮上显示的文字	字符串参数，可选，默认是"Prev"
next_text	“下一页”分页按钮上显示的文字	字符串参数，可选，默认是"Next"
ellipse_text	省略的页数用什么文字表示	可选字符串参数，默认是"..."
prev_show_always	是否显示“前一页”分页按钮	布尔型，可选参数，默认为true，即显示“前一页”按钮
next_show_always	是否显示“下一页”分页按钮	布尔型，可选参数，默认为true，即显示“下一页”按钮
callback	回调函数	默认无执行效果
举例
例如下面的使用代码：
$("#Pagination").pagination(56, {
    num_edge_entries: 2,
    num_display_entries: 4,
    callback: pageselectCallback,
    items_per_page:1
});
这段代码表示的含义是：总共有56(maxentries)个列表项，首尾两侧分页显示2(num_edge_entries)个，
连续分页主体数目显示4(num_display_entries)个，
回调函数为pageselectCallback(callback)，每页显示的列表项为1(items_per_page)个。

http://www.zhangxinxu.com/jq/pagination_zh/