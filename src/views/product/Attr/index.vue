<template>
  <div>
    <el-card style="margin-bottom:20px">
      <CategorySelect @getCategoryListId="getCategoryListId"
                      :show="!isShowTable"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button type="primary"
                   icon="el-icon-plus"
                   :disabled="!CategoryListId3"
                   @click="addAttr">添加属性</el-button>
        <el-table style="width: 100%"
                  :data="AttrList"
                  border>
          <el-table-column label="序号"
                           width="80px"
                           type="index"
                           align="center">
          </el-table-column>
          <el-table-column prop="attrName"
                           label="属性名称"
                           width="150px">
          </el-table-column>
          <el-table-column prop="prop"
                           label="属性值列表"
                           width="width">
            <template slot-scope="{row}">
              <el-tag type="info"
                      v-for="attr in row.attrValueList"
                      :key="attr.id"
                      style="margin:0 10px">{{attr.valueName}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop"
                           label="操作"
                           width="150px">
            <template slot-scope="{row}">
              <el-button type="warning"
                         icon="el-icon-edit"
                         size="mini"
                         @click="updateAttr(row)"></el-button>
              <el-button type="danger"
                         icon="el-icon-delete"
                         size="mini"
                         @click="deleteAttr(row)"></el-button>
            </template>

          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowTable">
        <el-form :inline="true"
                 ref="form"
                 label-width="60px"
                 :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名"
                      v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary"
                   icon="el-icon-plus"
                   :disabled="!attrInfo.attrName"
                   @click="addAttrValue">添加</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
        <el-table style="width: 100%;margin:20px 0"
                  border
                  :data="attrInfo.attrValueList">
          <el-table-column prop="prop"
                           label="序号"
                           type="index"
                           width="80px"
                           align="center">
          </el-table-column>
          <el-table-column prop="prop"
                           label="属性值名称"
                           width="width">
            <template slot-scope="{row,$index}">
              <el-input v-model="row.valueName"
                        placeholder="请输入属性值名称"
                        size="mini"
                        v-if="row.flag"
                        @blur="triggerInput(row)"
                        @keyup.native.enter="triggerInput(row)"
                        :ref="$index"></el-input>
              <span v-else
                    @click="triggerSpan(row,$index)"
                    style="display: block;">{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prop"
                           label="操作"
                           width="width">

            <template slot-scope="{row,$index}">
              <el-popconfirm icon="el-icon-info"
                             icon-color="red"
                             :title="`确认删除此条信息‘${row.valueName}’吗？`"
                             @onConfirm="deleteAttrValue($index)">
                <el-button type="danger"
                           icon="el-icon-delete"
                           size="mini"
                           slot="reference"></el-button>
              </el-popconfirm>
            </template>

          </el-table-column>
        </el-table>
        <el-button type="primary"
                   @click="addOrUpdateAttr"
                   :disabled="attrInfo.attrValueList.length<1">保存</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
export default {
  name: 'Attr',
  data () {
    return {
      CategoryListId1: '',
      CategoryListId2: '',
      CategoryListId3: '',
      AttrList: [],
      isShowTable: true,
      attrInfo: {
        attrName: "",
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3,
      }
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
        this.getAttrList();
      }
    },
    async getAttrList () {
      const { CategoryListId1, CategoryListId2, CategoryListId3 } = this;
      let results = await this.$API.attr.reqGetAttrList(CategoryListId1, CategoryListId2, CategoryListId3);
      if (results.code == 200) {
        this.AttrList = results.data;
      }
    },
    addAttrValue () {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: '',
        flag: true,
      });
      // 新增的表单自动聚焦
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      })
    },
    // 添加属性回调
    addAttr () {
      // 隐藏表格显示添加属性表单内容
      this.isShowTable = false;
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        // 在这里获取三级分类的ID
        categoryId: this.CategoryListId3,
        categoryLevel: 3,
      };

    },
    // 修改属性按钮
    updateAttr (row) {
      this.isShowTable = false;
      // 这里要用到深拷贝
      this.attrInfo = cloneDeep(row);

      // 在修改属性按钮点击的时候给每一个属性身上添加一个flag作为标识，可以进行编辑
      this.attrInfo.attrValueList.forEach(item => {
        // 这种写法添加的是普通的property
        // item.flag = false;
        this.$set(item, 'flag', false);
      })
    },
    // 失去焦点事件回调
    triggerInput (row) {
      // 判断输入值是否是空值
      if (row.valueName.trim() == "") {
        this.$message({
          type: 'error',
          message: '不能输入空值，请重新输入！'
        })
        return;
      }
      let isRepeat = this.attrInfo.attrValueList.some(item => {
        // 这个if是为了row不跟自身判断，而是跟除了row自身的其他item判断
        if (item !== row) {
          return row.valueName == item.valueName;
        };
      });
      // 如果重复就结束程序
      if (isRepeat) {
        this.$message({
          type: 'error',
          message: '请勿输入重复值！'
        })
        return;
      }
      row.flag = false;
    },
    // span点击事件
    triggerSpan (row, index) {
      row.flag = true;
      // 切换为表单时自动聚焦
      this.$nextTick(() => {
        this.$refs[index].focus();
      })
    },
    // 删除属性值
    deleteAttrValue (index) {
      this.attrInfo.attrValueList.splice(index, 1);
    },
    // 添加或修改属性值
    async addOrUpdateAttr () {
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        if (item.valueNam !== '') {
          delete item.flag;
          return true;
        }
      });
      try {
        await this.$API.attr.reqAddOrUpdateAttrInfo(this.attrInfo);
        this.isShowTable = true;
        this.$message({
          type: 'success',
          message: '保存成功！'
        });
        this.getAttrList();
      } catch (error) {
        this.$message({
          type: 'error',
          message: '保存失败！'
        });
      }


    },
    // 删除属性
    async deleteAttr (row) {
      try {
        await this.$API.attr.reqDeleteAttr(row.id);
        this.$message({
          type: 'success',
          message: '删除成功！'
        });
        this.getAttrList();
      } catch (error) {
        this.$message({
          type: 'error',
          message: '删除失败！'
        });
      }
    }
  }
}
</script>

<style>
</style>