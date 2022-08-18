<template>
  <div>
    <el-form ref="form"
             label-width="80px">
      <el-form-item label="SPU名称">
        {{spu.spuName}}
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称"
                  v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)"
                  v-model="skuInfo.price"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)"
                  v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea"
                  placeholder="规格描述"
                  rows="4"
                  v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true"
                 ref="form"
                 label-width="80px">
          <el-form-item :label="attrInfo.attrName"
                        v-for="attrInfo in AttrInfoList"
                        :key="attrInfo.id">
            <el-select placeholder="请选择"
                       v-model="attrInfo.attrIdAndValueId">
              <el-option :label="attrValue.valueName"
                         :value="`${attrInfo.id}:${attrValue.id}`"
                         v-for="attrValue in attrInfo.attrValueList"
                         :key="attrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true"
                 ref="form"
                 label-width="80px">
          <el-form-item :label="saleAttr.saleAttrName"
                        v-for="saleAttr in SpuSaleAttr"
                        :key="saleAttr.id">
            <el-select placeholder="请选择"
                       v-model="saleAttr.saleAttrIdAndValueId">
              <el-option :label="saleAttrValue.saleAttrValueName"
                         :value="`${saleAttr.id}:${saleAttrValue.id}`"
                         v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
                         :key="saleAttrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table style="width: 100%"
                  border
                  :data="SpuImgList"
                  @selection-change="handleSelectionChange">
          <el-table-column type="selection"
                           prop="prop"
                           label="label"
                           width="80px"
                           align="center">
          </el-table-column>
          <el-table-column prop="prop"
                           label="图片"
                           width="width">
            <template slot-scope="{row}">
              <img :src="row.imgUrl"
                   style="width: 100px;height: 100px;">
            </template>
          </el-table-column>
          <el-table-column prop="prop"
                           label="名称"
                           width="width">
            <template slot-scope="{row}">
              <div>
                {{row.imgName}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="prop"
                           label="操作"
                           width="width">
            <template slot-scope="{row}">
              <el-button type="primary"
                         v-if="row.isDefault==0"
                         @click="setDefault(row)">设置默认</el-button>
              <el-button type="info"
                         size="mini"
                         v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SkuForm',
  data () {
    return {
      SpuImgList: [],
      SpuSaleAttr: [],
      AttrInfoList: [],
      spu: {},
      skuInfo: {
        // 父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,

        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // }
        ],
        skuDefaultImg: "",

        skuImageList: [
          // {
          //   "imgName": "string",
          //   "imgUrl": "string",
          //   "isDefault": "string",
          //   "spuImgId": 0
          // }
        ],

        skuSaleAttrValueList: [
          // {
          //   "saleAttrId": 0,
          //   "saleAttrValueId": 0,
          // }
        ],

      },
      imageList: []
    }
  },
  methods: {
    async getData (CategoryListId1, CategoryListId2, row) {
      // 收集父组件的数据
      this.skuInfo.category3Id = row.category3Id;
      this.skuInfo.tmId = row.tmId;
      this.skuInfo.id = row.id;
      this.spu = row;
      console.log(row);
      let results1 = await this.$API.sku.reqGetSpuImgList(row.id)
      if (results1.code == 200) {
        let list = results1.data;
        list.forEach(item => {
          item.isDefault = 0;
        })
        this.SpuImgList = list;
      };
      let results2 = await this.$API.sku.reqGetSpuSaleAttrById(row.id)
      if (results2.code == 200) {
        this.SpuSaleAttr = results2.data;
      };
      let results3 = await this.$API.sku.reqGetAttrInfoList(CategoryListId1, CategoryListId2, row.category3Id)
      if (results3.code == 200) {
        this.AttrInfoList = results3.data;
      }
    },
    // 图片列表
    handleSelectionChange (params) {
      this.imageList = params;
    },
    // 设置默认按钮
    setDefault (row) {
      this.SpuImgList.forEach(item => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
      // 收集数据
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    // 取消按钮
    cancel () {
      this.$emit('changeScene', { scene: 0, flag: '取消' });
      Object.assign(this._data, this.$options.data());
    },
    async save () {
      // 整理参数
      const { AttrInfoList, SpuSaleAttr, imageList, skuInfo } = this;
      // 平台属性
      skuInfo.skuAttrValueList = AttrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(':');
          prev.push({ attrId, valueId });
        };
        return prev;
      }, []);
      // 销售属性
      skuInfo.skuSaleAttrValueList = SpuSaleAttr.reduce((prev, item) => {
        if (item.saleAttrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.saleAttrIdAndValueId.split(':');
          prev.push({ saleAttrId, saleAttrValueId });
        };
        return prev;
      }, []);
      // 图片
      skuInfo.skuImageList = imageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        };
      });
      // 发请求
      let results = await this.$API.sku.reqSaveSkuInfo(skuInfo);
      if (results.code == 200) {
        this.$message({
          type: 'success',
          message: '保存成功！'
        });
        Object.assign(this._data, this.$options.data());
        this.$emit('changeScene2', 0);
      } else {
        this.$message({
          type: 'error',
          message: '保存失败！'
        });
      }
    }
  }
}
</script>

<style>
</style>