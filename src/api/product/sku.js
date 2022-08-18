import request from '@/utils/brand-request';

// 获取图片信息
export const reqGetSpuImgList = (spuId) => request({
    url: `/admin/product/spuImageList/${spuId}`,
    method: 'get'
});

// 获取销售属性信息
export const reqGetSpuSaleAttrById = (spuId) => request({
    url: `/admin/product/spuSaleAttrList/${spuId}`,
    method: 'get'
})

// 获取平台属性
export const reqGetAttrInfoList = (category1Id, category2Id, category3Id) => request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: 'get'
})

// 保存
export const reqSaveSkuInfo = (data) => request({
    url: '/admin/product/saveSkuInfo',
    data,
    method: 'post',
})

// 显示sku列表
export const reqGetSkuList = (spuId) => request({
    url: `/admin/product/findBySpuId/${spuId}`,
    method: 'get'
})

// Sku管理首页数据
export const reqIndexList = ({ page, limit }) => request({
    url: `/admin/product/list/${page}/${limit}`,
    method: 'get'
})

// 上架
export const reqUpSale = (skuId) => request({
    url: `/admin/product/onSale/${skuId}`,
    method: 'get'
})

// 下架
export const reqDownSale = (skuId) => request({
    url: `/admin/product/cancelSale/${skuId}`,
    method: 'get'
})

// 获取Sku详情信息
export const reqSkuDetail = (skuId) => request({
    url: `/admin/product/getSkuById/${skuId}`,
    method: 'get'
})