<template>
  <div>
    <el-form ref="form"
             label-width="80px">
      <el-form-item label="Spu名称">
        <el-input placeholder="请输入Spu名称"
                  v-model="spuBaseList.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌"
                   v-model="spuBaseList.tmId">
          <el-option :label="tradeMark.tmName"
                     :value="tradeMark.id"
                     v-for="tradeMark in tradeMarkList"
                     :key="tradeMark.id">{{tradeMark.tmName}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Spu描述">
        <el-input type="textarea"
                  rows="4"
                  placeholder="请输入Spu描述"
                  v-model="spuBaseList.description"></el-input>
      </el-form-item>
      <el-form-item label="Spu图片">
        <el-upload action="/brand-api/admin/product/fileUpload"
                   list-type="picture-card"
                   :on-preview="handlePictureCardPreview"
                   :on-remove="handleRemove"
                   :file-list="spuImgList"
                   :on-success="handlerSuccess">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%"
               :src="dialogImageUrl"
               alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select v-model="remainderSaleAttrIdAndName"
                   :placeholder="`还有${remainderSaleAttr.length}未选择`">
          <el-option :label="remainder.name"
                     :value="`${remainder.id}:${remainder.name}`"
                     v-for="remainder in remainderSaleAttr"
                     :key="remainder.id"></el-option>
        </el-select>
        <el-button type="primary"
                   icon="el-icon-plus"
                   :disabled="!remainderSaleAttrIdAndName"
                   @click="addSaleAttr">添加销售属性</el-button>
        <el-table style="width: 100%"
                  border
                  :data="spuBaseList.spuSaleAttrList">
          <el-table-column type="index"
                           label="序号"
                           width="80px"
                           align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName"
                           label="属性名"
                           width="width">
          </el-table-column>
          <el-table-column prop="prop"
                           label="属性值名称列表"
                           width="width">
            <template slot-scope="{row,$index}">
              <el-tag :key="tag.id"
                      v-for="(tag,index) in row.spuSaleAttrValueList"
                      closable
                      :disable-transitions="false"
                      @close="row.spuSaleAttrValueList.splice(index,1)">
                {{tag.saleAttrValueName}}
              </el-tag>
              <!-- 实现input和button之间的切换 -->
              <el-input class="input-new-tag"
                        v-if="row.inputVisible"
                        v-model="row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm"
                        @blur="handleInputConfirm(row)">
              </el-input>
              <el-button v-else
                         class="button-new-tag"
                         size="small"
                         @click="addSaleAttrValue(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop"
                           label="操作"
                           width="width">
            <template slot-scope="{row,$index}">
              <el-button type="danger"
                         icon="el-icon-delete"
                         @click="spuBaseList.spuSaleAttrList.splice($index,1)"></el-button>
            </template>
          </el-table-column>
        </el-table>

      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      // spu信息
      spuBaseList: {
        // 三级分类ID
        category3Id: 0,
        // spu描述
        description: "",
        // spu名称
        spuName: "",
        // 品牌ID
        tmId: '',
        // 图片列表
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0
          // }
        ],
        // 销售属性列表
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0
          //     }
          //   ]
          // }
        ],

      },
      // 全部品牌列表
      tradeMarkList: [],
      // 图片列表
      spuImgList: [],
      // 全部销售属性列表
      saleAttrList: [],
      remainderSaleAttrIdAndName: '',
    };
  },
  methods: {
    // 删除回调
    handleRemove (file, fileList) {
      this.spuImgList = fileList;
    },
    // 成功回调
    handlerSuccess (response, file, fileList) {
      this.spuImgList = fileList;
    },
    // 预览回调
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    async initSpuData (row) {
      // 获取Spu基本信息
      let spuResults = await this.$API.spu.reqGetSpuBaseById(row.id);
      if (spuResults.code == 200) {
        this.spuBaseList = spuResults.data;
      };
      // 获取品牌信息
      let tmResults = await this.$API.spu.reqTradeMark();
      if (tmResults.code == 200) {
        this.tradeMarkList = tmResults.data;
      };
      // 获取图片信息
      let imgResults = await this.$API.spu.reqGetSpuImgList(row.id);
      if (imgResults.code == 200) {
        // 需要整理服务器返回的参数字段名，因为在UI中upload组件的file-list属性值要求是数组
        // 且数组里的对象字段名要求是 name 和  url 
        let imgArr = imgResults.data
        imgArr.forEach(item => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        })
        this.spuImgList = imgArr;
      };
      // 获取销售属性信息
      let saleResults = await this.$API.spu.reqGetSaleAttrList();
      if (saleResults.code == 200) {
        this.saleAttrList = saleResults.data;
      }
    },
    // 添加销售属性的按钮
    addSaleAttr () {
      // 解构出收集到的数组
      const [baseSaleAttrId, saleAttrName] = this.remainderSaleAttrIdAndName.split(':');
      // 整理一个新的销售属性列表的对象
      let newSpuSaleAttrList = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] };
      // 往销售属性列表这个数组里添加一个新的对象
      this.spuBaseList.spuSaleAttrList.push(newSpuSaleAttrList);
      // 清空数据
      this.remainderSaleAttrIdAndName = '';
    },
    // 添加销售属性值的按钮
    addSaleAttrValue (row) {
      this.$set(row, 'inputVisible', true);
      this.$set(row, 'inputValue', '');
    },
    // 添加属性值input框失去焦点回调事件
    handleInputConfirm (row) {
      const { baseSaleAttrId, inputValue } = row;
      if (inputValue.trim() == '') {
        this.$message({
          type: 'error',
          message: '属性值不能为空！'
        });
        return;
      }
      let isRepeat = row.spuSaleAttrValueList.some(item => item.saleAttrValueName === inputValue);
      if (isRepeat) {
        this.$message({
          type: 'error',
          message: '不能添加已有属性值！'
        });
        return;
      };
      let newSpuSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue };
      row.spuSaleAttrValueList.push(newSpuSaleAttrValue);
      row.inputVisible = false;
    },
    // 保存按钮回调
    async addOrUpdateSpu () {
      // 整理图片参数赋给spu
      this.spuBaseList.spuImageList = this.spuImgList.map(item => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.imgUrl
        }
      });

      // 发请求
      let results = await this.$API.spu.reqAddOrUpdateSpu(this.spuBaseList);
      if (results.code == 200) {
        this.$message({
          type: 'success',
          message: '保存成功！'
        });
        // 跳转页面
        this.$emit('changeScene', { scene: 0, flag: this.spuBaseList.id ? '修改' : '添加' });
      }
      // 清理数据
      Object.assign(this._data, this.$options.data());
    },
    // 点击添加按钮发请求的函数
    async addSpuData (category3Id) {
      this.spuBaseList.category3Id = category3Id;
      // 获取品牌信息
      let tmResults = await this.$API.spu.reqTradeMark();
      if (tmResults.code == 200) {
        this.tradeMarkList = tmResults.data;
      };
      // 获取销售属性信息
      let saleResults = await this.$API.spu.reqGetSaleAttrList();
      if (saleResults.code == 200) {
        this.saleAttrList = saleResults.data;
      }
    },
    // 取消按钮
    cancel () {
      // 切换页面
      this.$emit('changeScene', { scene: 0, flag: '取消' })
      // 清理数据
      Object.assign(this._data, this.$options.data());
    }
  },
  computed: {
    // 剩余销售属性
    remainderSaleAttr () {
      let result = this.saleAttrList.filter(item => {
        return this.spuBaseList.spuSaleAttrList.every(item1 => {
          return item.name != item1.saleAttrName;
        })
      })
      return result;
    }
  }
}
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>