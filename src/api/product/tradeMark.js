import request from '@/utils/brand-request';


// 获取品牌列表
export const reqTradeMark = (page, limit) => request({
    url: `/admin/product/baseTrademark/${page}/${limit}`,
    method: 'get',
});

// 添加或修改品牌列表
export const reqAddOrUpdateTradeMark = (tmForm) => {
    if (tmForm.id) {
        return request({
            url: '/admin/product/baseTrademark/update',
            method: 'put',
            data: tmForm,
        })
    } else {
        return request({
            url: '/admin/product/baseTrademark/save',
            method: 'post',
            data: tmForm,
        })
    }
}

// 删除品牌列表
export const reqDeleteTradeMark = (id) => request({
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: 'delete'
})