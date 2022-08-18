<template>
  <div>
    <el-card style="margin-bottom:20px">
      <CategorySelect @getCategoryListId="getCategoryListId"
                      :show="scene!=0"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="scene===0">
        <el-button type="primary"
                   icon="el-icon-plus"
                   @click="addSpu">添加SPU</el-button>
        <el-table border
                  style="width: 100%"
                  :data="records">
          <el-table-column type="index"
                           label="序号"
                           width="80px">
          </el-table-column>
          <el-table-column prop="spuName"
                           label="SPU名称"
                           width="width">
          </el-table-column>
          <el-table-column prop="description"
                           label="SPU描述"
                           width="width">
          </el-table-column>
          <el-table-column prop="prop"
                           label="操作"
                           width="width">
            <template slot-scope="{row,$index}">
              <el-button type="success"
                         icon="el-icon-plus"
                         size="mini"
                         title="添加Sku"
                         @click="addSku(CategoryListId1, CategoryListId2,row)"></el-button>
              <el-button type="warning"
                         icon="el-icon-edit"
                         size="mini"
                         title="修改Spu"
                         @click="updateSpuForm(row)"></el-button>
              <el-button type="info"
                         icon="el-icon-info"
                         size="mini"
                         title="查看当前Spu全部Sku列表"
                         @click="showSkuList(row)"></el-button>
              <el-popconfirm :title="`确定删除${row.spuName}吗？`"
                             @onConfirm="deleteSpu(row)">
                <el-button type="danger"
                           icon="el-icon-delete"
                           size="mini"
                           title="删除Spu"
                           slot="reference"
                           style="margin:0 0 0 10px"></el-button>
              </el-popconfirm>

            </template>
          </el-table-column>
        </el-table>
        <el-pagination style="text-align:center;margin:20px 0;"
                       :current-page="page"
                       :page-sizes="[3, 5, 7]"
                       :page-size="limit"
                       layout=" prev, pager, next, jumper,->,sizes,total"
                       :total="total"
                       :pager-count="9"
                       @current-change="getSpuList"
                       @size-change="handleSizeChange">
        </el-pagination>
      </div>
      <SpuForm v-show="scene===1"
               @changeScene="changeScene"
               ref="SpuForm"></SpuForm>
      <SkuForm v-show="scene===2"
               @changeScene="changeScene"
               @changeScene2="changeScene2"
               ref="SkuForm"></SkuForm>
    </el-card>
    <el-dialog :title="`${spu.spuName}的SKU列表`"
               :visible.sync="dialogTableVisible"
               :before-close="close">
      <el-table :data="skuList"
                border
                v-loading="loading">
        <el-table-column align="center"
                         prop="skuName"
                         label="名称">
        </el-table-column>
        <el-table-column align="center"
                         prop="price"
                         label="价格">
        </el-table-column>
        <el-table-column align="center"
                         prop="weight"
                         label="重量">
        </el-table-column>
        <el-table-column align="center"
                         label="默认图片">
          <template slot-scope="{row}">
            <img :src="row.skuDefaultImg"
                 alt=""
                 style="width: 100px;height: 100px;">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from './SpuForm';
import SkuForm from './SkuForm';
export default {
  name: 'Spu',
  components: {
    SpuForm,
    SkuForm
  },
  data () {
    return {
      CategoryListId1: '',
      CategoryListId2: '',
      CategoryListId3: '',
      records: [],
      page: 1,
      limit: 5,
      total: 0,
      scene: 0,
      dialogTableVisible: false,
      spu: [],
      skuList: [],
      loading: true,
    }
  },
  methods: {
    getCategoryListId ({ CategoryListId, level }) {
      if (level == 1) {
        this.CategoryListId1 = CategoryListId;
        this.CategoryListId2 = '';
        this.CategoryListId3 = '';
      } else if (level == 2) {
        this.CategoryListId2 = CategoryListId;
        this.CategoryListId3 = '';
      } else if (level == 3) {
        this.CategoryListId3 = CategoryListId;
        this.getSpuList();
      }
    },
    async getSpuList (pager = 1) {
      this.page = pager;
      const { page, limit, CategoryListId3 } = this;
      let results = await this.$API.spu.reqGetSpuList(page, limit, CategoryListId3);
      if (results.code == 200) {
        this.records = results.data.records;
        this.total = results.data.total;
      }
    },
    // 分页器一页显示多少数据处理函数
    handleSizeChange (limit) {
      this.limit = limit;
      this.getSpuList();
    },
    // 页面切换
    changeScene ({ scene, flag }) {
      this.scene = scene;
      // 切换页面的时候刷新页面数据
      if (flag == '修改' || flag == '取消') {
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }

    },
    // sku的保存后页面切换
    changeScene2 (scene) {
      this.scene = scene;
    },
    // 修改Spu
    updateSpuForm (row) {
      this.scene = 1;
      this.$refs.SpuForm.initSpuData(row);
    },
    // 添加Spu
    addSpu () {
      this.scene = 1;
      // 发品牌和销售属性请求
      this.$refs.SpuForm.addSpuData(this.CategoryListId3);
    },
    // 删除Spu
    async deleteSpu (row) {
      let results = await this.$API.spu.reqDeleteSpu(row.id);
      if (results.code == 200) {
        this.$message({
          type: 'success',
          message: '删除成功！'
        });
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
      }
    },
    // 添加Sku
    addSku (CategoryListId1, CategoryListId2, row) {
      // 切换页面
      this.scene = 2;
      // 通知子组件发请求
      this.$refs.SkuForm.getData(CategoryListId1, CategoryListId2, row);
    },
    // 展示SKU列表按钮的回调函数
    async showSkuList (row) {
      // 弹出列表
      this.dialogTableVisible = true;

      this.spu = row;
      let results = await this.$API.sku.reqGetSkuList(row.id);
      if (results.code == 200) {
        this.skuList = results.data;
        this.loading = false;
      }
    },
    // 关闭sku列表前的回调函数
    close (done) {
      this.loading = true;
      // 清除数据
      this.skuList = [];
      done();
    }
  }
}
</script>

<style>
</style>