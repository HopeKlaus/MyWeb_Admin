import request from '@/utils/brand-request';

// 获取Spu列表
export const reqGetSpuList = (page, limit, category3Id) => request({
    url: `/admin/product/${page}/${limit}`,
    method: 'get',
    params: { category3Id }
});

// 获取Spu基本信息
export const reqGetSpuBaseById = (spuId) => request({
    url: `/admin/product/getSpuById/${spuId}`,
    method: 'get'
})

// 获取品牌信息
export const reqTradeMark = () => request({
    url: '/admin/product/baseTrademark/getTrademarkList',
    method: 'get'
})

// 获取图片信息
export const reqGetSpuImgList = (spuId) => request({
    url: `/admin/product/spuImageList/${spuId}`,
    method: 'get'
})

// 获取销售属性信息
export const reqGetSaleAttrList = () => request({
    url: '/admin/product/baseSaleAttrList',
    method: 'get'
})

// 修改或添加Spu
export const reqAddOrUpdateSpu = (spuInfo) => {
    if (spuInfo.id) {
        return request({
            url: '/admin/product/updateSpuInfo',
            data: spuInfo,
            method: 'post'
        })
    } else {
        return request({
            url: '/admin/product/saveSpuInfo',
            data: spuInfo,
            method: 'post'
        })
    }
};

// 删除Spu
export const reqDeleteSpu = (spuId) => request({
    url: `/admin/product/deleteSpu/${spuId}`,
    method: 'delete',
})