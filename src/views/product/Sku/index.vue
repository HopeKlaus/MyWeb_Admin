<template>
  <div>
    <el-table style="width: 100%"
              border
              :data="records">
      <el-table-column type="index"
                       label="序号"
                       width="80px"
                       align="center">
      </el-table-column>
      <el-table-column prop="skuName"
                       label="名称"
                       width="width">
      </el-table-column>
      <el-table-column prop="skuDesc"
                       label="描述"
                       width="width">
      </el-table-column>
      <el-table-column prop="prop"
                       label="默认图片"
                       width="120px"
                       align="center">
        <template slot-scope="{row}">
          <img :src="row.skuDefaultImg"
               style="width: 80px;height: 80px;">
        </template>
      </el-table-column>
      <el-table-column prop="weight"
                       label="重量(KG)"
                       width="width">
      </el-table-column>
      <el-table-column prop="price"
                       label="价格(元)"
                       width="75px"
                       align="center">
      </el-table-column>
      <el-table-column prop="prop"
                       label="操作"
                       width="width"
                       align="center">
        <template slot-scope="{row}">
          <el-button type="success"
                     icon="el-icon-sort-down"
                     size="mini"
                     v-if="row.isSale==0"
                     @click="upSale(row)"></el-button>
          <el-button type="success"
                     icon="el-icon-sort-up"
                     size="mini"
                     v-else
                     @click="downSale(row)"></el-button>
          <el-button type="primary"
                     icon="el-icon-edit"
                     size="mini"></el-button>
          <el-button type="info"
                     icon="el-icon-info"
                     size="mini"
                     @click="handlerDetailSku(row)"></el-button>
          <el-button type="danger"
                     icon="el-icon-delete"
                     size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--  -->
    <el-pagination :current-page="page"
                   :page-sizes="[5, 7, 10]"
                   :page-size="limit"
                   layout=" prev, pager, next, jumper,->,sizes,total "
                   :total="total"
                   style="text-align:center;margin-top:20px"
                   @size-change="handleSizeChange"
                   @current-change="getData">
    </el-pagination>

    <el-drawer :visible.sync="drawer"
               :withHeader="false"
               size="50%"
               :show-close="false">
      <el-row>
        <el-col :span="6">
          名称
        </el-col>
        <el-col :span="16">
          {{skuDetailList.skuName}}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          描述
        </el-col>
        <el-col :span="16">
          {{skuDetailList.skuDesc}}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          价格
        </el-col>
        <el-col :span="16">
          {{skuDetailList.price}}元
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          平台属性
        </el-col>
        <el-col :span="16">
          <el-tag type="success"
                  v-for="attrValue in skuDetailList.skuAttrValueList"
                  style="margin-right :20px;"
                  :key="attrValue.id">{{attrValue.valueName}}</el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          商品图片
        </el-col>
        <el-col :span="16">
          <el-carousel :interval="1000"
                       arrow="always"
                       height="300px">
            <el-carousel-item v-for="item in skuDetailList.skuImageList"
                              :key="item.id">
              <img :src="item.imgUrl"
                   alt=""
                   style="height: 300px;">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'Sku',
  data () {
    return {
      page: 1,
      limit: 5,
      total: 0,
      records: [],
      drawer: false,
      skuDetailList: {}
    }
  },
  mounted () {
    this.getData();
  },
  methods: {
    async getData (pager = 1) {
      this.page = pager;
      const { page, limit } = this;
      let results = await this.$API.sku.reqIndexList({ page, limit });
      if (results.code == 200) {
        console.log(results);
        this.records = results.data.records;
        this.total = results.data.total;
      }
    },
    handleSizeChange (limit) {
      this.limit = limit;
      this.getData()
    },
    // 上架
    async upSale (row) {
      let results = await this.$API.sku.reqUpSale(row.id);
      if (results.code == 200) {
        row.isSale = 1;
        this.$message({
          type: 'success',
          message: '上架成功！'
        });
      } else {
        this.$message({
          type: 'error',
          message: '上架失败！'
        });
      }
    },
    // 下架
    async downSale (row) {
      let results = await this.$API.sku.reqDownSale(row.id);
      if (results.code == 200) {
        row.isSale = 0;
        this.$message({
          type: 'success',
          message: '下架成功！'
        });
      } else {
        this.$message({
          type: 'error',
          message: '下架失败！'
        });
      }
    },
    async handlerDetailSku (row) {
      this.drawer = true;
      let results = await this.$API.sku.reqSkuDetail(row.id);
      if (results.code == 200) {
        console.log(results);
        this.skuDetailList = results.data;
      }
    }
  }
}
</script>

<style scoped>
.el-col-6 {
  margin-right: 20px;
  text-align: right;
}
.el-col {
  margin: 20px 10px;
}
.el-col-16 {
  font-size: 15px;
}
</style>