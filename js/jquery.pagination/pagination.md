������
��jQuery���ΪAjax��ҳ�����һ���Լ��أ��ʷ�ҳ�л�ʱ��ˢ�����ӳ٣�����������ϴ󲻽����ô˷�������Ϊ���ػ�Ƚ�����
ԭ���CSS��̫����ʹ�ø��������޷�����ʵ�����ҷ���Ķ�λ����δ����������������޸İ����Ҷ���������Ż���ʹ��֧��text-align�Ķ�λ��
ʹ�÷���
��һ���jQuery���һ�����˲��ʹ��Ҳ�ܼ򵥱�ݡ�������pagination������$("#page").pagination(100);
����
������	����	����ֵ
maxentries	����Ŀ��	��ѡ����������
items_per_page	ÿҳ��ʾ����Ŀ��	��ѡ������Ĭ����10
num_display_entries	������ҳ���岿����ʾ�ķ�ҳ��Ŀ��	��ѡ������Ĭ����10
current_page	��ǰѡ�е�ҳ��	��ѡ������Ĭ����0����ʾ��1ҳ
num_edge_entries	������ʾ����β��ҳ����Ŀ��	��ѡ������Ĭ����0
link_to	��ҳ������	�ַ�������ѡ������Ĭ����"#"
prev_text	��ǰһҳ����ҳ��ť����ʾ������	�ַ�����������ѡ��Ĭ����"Prev"
next_text	����һҳ����ҳ��ť����ʾ������	�ַ�����������ѡ��Ĭ����"Next"
ellipse_text	ʡ�Ե�ҳ����ʲô���ֱ�ʾ	��ѡ�ַ���������Ĭ����"..."
prev_show_always	�Ƿ���ʾ��ǰһҳ����ҳ��ť	�����ͣ���ѡ������Ĭ��Ϊtrue������ʾ��ǰһҳ����ť
next_show_always	�Ƿ���ʾ����һҳ����ҳ��ť	�����ͣ���ѡ������Ĭ��Ϊtrue������ʾ����һҳ����ť
callback	�ص�����	Ĭ����ִ��Ч��
����
���������ʹ�ô��룺
$("#Pagination").pagination(56, {
    num_edge_entries: 2,
    num_display_entries: 4,
    callback: pageselectCallback,
    items_per_page:1
});
��δ����ʾ�ĺ����ǣ��ܹ���56(maxentries)���б����β�����ҳ��ʾ2(num_edge_entries)����
������ҳ������Ŀ��ʾ4(num_display_entries)����
�ص�����ΪpageselectCallback(callback)��ÿҳ��ʾ���б���Ϊ1(items_per_page)����

http://www.zhangxinxu.com/jq/pagination_zh/