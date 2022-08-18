import request from '@/utils/brand-request';

// 获取一级分类接口
export const reqCategoryList1 = () => request({
    url: '/admin/product/getCategory1',
    method: "get"
})

// 获取二级分类接口
export const reqCategoryList2 = (category1Id) => request({
    url: `/admin/product/getCategory2/${category1Id}`,
    method: 'get'
})

// 获取三级分类接口
export const reqCategoryList3 = (category2Id) => request({
    url: `/admin/product/getCategory3/${category2Id}`,
    method: 'get'
})

// 根据ID获取商品属性列表
export const reqGetAttrList = (category1Id, category2Id, category3Id) => request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: 'get',
})

// 添加||修改属性和属性值
export const reqAddOrUpdateAttrInfo = (data) => request({
    url: '/admin/product/saveAttrInfo',
    method: 'post',
    data
})

// 删除属性
export const reqDeleteAttr = (attrId) => request({
    url: `/admin/product/deleteAttr/${attrId}`,
    method: 'delete'
})