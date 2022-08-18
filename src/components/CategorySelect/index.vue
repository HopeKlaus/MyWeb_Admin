<template>
  <el-form :inline="true"
           class="demo-form-inline"
           :model="IdList">
    <el-form-item label="一级分类">
      <el-select placeholder="请选择"
                 v-model="IdList.CategoryListId1"
                 @change="handler1"
                 :disabled="show">
        <el-option :label="c1.name"
                   :value="c1.id"
                   v-for="c1 in CategoryList1"
                   :key="c1.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="二级分类">
      <el-select placeholder="请选择"
                 v-model="IdList.CategoryListId2"
                 @change="handler2"
                 :disabled="show">
        <el-option :label="c2.name"
                   :value="c2.id"
                   v-for="c2 in CategoryList2"
                   :key="c2.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="三级分类">
      <el-select placeholder="请选择"
                 v-model="IdList.CategoryListId3"
                 @change="handler3"
                 :disabled="show">
        <el-option :label="c3.name"
                   :value="c3.id"
                   v-for="c3 in CategoryList3"
                   :key="c3.id"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'CategorySelect',
  props: ['show'],
  data () {
    return {
      CategoryList1: {},
      CategoryList2: {},
      CategoryList3: {},
      IdList: {
        CategoryListId1: '',
        CategoryListId2: '',
        CategoryListId3: '',
      }
    }
  },
  async mounted () {
    let results = await this.$API.attr.reqCategoryList1();
    if (results.code == 200) {
      this.CategoryList1 = results.data;
    }
  },
  methods: {
    async handler1 () {
      // 当切换一二级分类时，后面的分类要清空
      this.CategoryList2 = {};
      this.CategoryList3 = {};
      this.IdList.CategoryListId2 = '';
      this.IdList.CategoryListId3 = '';
      const { CategoryListId1 } = this.IdList;
      // 当获得ID后把ID传给父组件
      this.$emit('getCategoryListId', { CategoryListId: CategoryListId1, level: 1 });
      let results = await this.$API.attr.reqCategoryList2(CategoryListId1);
      if (results.code == 200) {
        this.CategoryList2 = results.data;
      }
    },
    async handler2 () {
      this.CategoryList3 = {};
      this.IdList.CategoryListId3 = '';
      const { CategoryListId2 } = this.IdList;
      // 当获得ID后把ID传给父组件
      this.$emit('getCategoryListId', { CategoryListId: CategoryListId2, level: 2 });
      let results = await this.$API.attr.reqCategoryList3(CategoryListId2);
      if (results.code == 200) {
        this.CategoryList3 = results.data;
      }
    },
    handler3 () {
      const { CategoryListId3 } = this.IdList;
      // 当获得ID后把ID传给父组件
      this.$emit('getCategoryListId', { CategoryListId: CategoryListId3, level: 3 });
    }
  }
}
</script>

<style>
</style>