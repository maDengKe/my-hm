<template>
  <!-- import { log } from 'util'; -->
  <!-- import { log } from 'util'; -->
  <!-- <div class="hm-input">
    <input
      :type="type"
      :placeholder="placeholder"
      :value="value"
      @input="inputFn"
      :class="{ success: status === 'success', error: status === 'error' }"
    >
    <div class="tips" v-show="status === 'error'">{{ message }}</div>
  </div>-->
  <!-- 
    今日目标：1表单组件的封装 2后台数据的交互
  -->
  <!-- 注意：局部组件封装原则  自身不可以写死属性数据 靠宿主也就是父组件动态属性数据-->
  <div class="hm-input">
    <!-- 注意为了让宿主绑定v-model 组件被动获取value值 通过事件触发父元素修改数据 -->
    <input
      :type="type"
      :placeholder="placeholder"
      :value="value"
      @input="inputFn"
      :class="{success:status==='success'?true:false,error:status==='error'?true:false}"
    >
    <div class="tips" v-show="status==='error'?true:false">{{message}}</div>
  </div>
  <!-- 心得：
  1 对于组件，自身不可以写死属性数据 靠宿主也就是父组件动态属性数据
  2 动态类名的写法多看看，注意引号
  
  
  -->
</template>

<script>
// export default {
//   // 用于接收父组件传递过来的数据
//   // props: ['type', 'placeholder']
//   props: {
//     // 接收type属性
//     type: {
//       type: String,
//       default: 'text'
//     },
//     placeholder: {
//       type: String,
//       default: '请输入...'
//     },
//     value: String,
//     // 传入正则表达式
//     rule: RegExp,
//     message: String
//   },
//   data() {
//     return {
//       // 记录表单的校验状态的
//       status: ''
//     }
//   },
//   methods: {
//     // 需要把input框的值传给父组件
//     inputFn(e) {
//       // e.target能够获取到触发事件的元素
//       // 怎么通过事件对象获取到值
//       // console.log(e.target.value)
//       let value = e.target.value
//       this.$emit('input', value)

//       // 添加表单校验
//       if (this.rule) {
//         // 判断value值是否符合传入 的正则
//         if (this.rule.test(value)) {
//           this.status = 'success'
//         } else {

//     }
//   }
// }
//

export default {
  // 这里需要说明组件需要获取到的属性数据
  props: {
    type: {
      type: String,
      required: true,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
    value: {
      type: [String, Number]
    },
    rule: RegExp,
    message: String
  },

  data() {
    return {
      status: ''
    }
  },
  methods: {
    // 这里需要传给父元素表单的值
    validated(value) {
      if (this.rule) {
        if (this.rule.test(value)) {
          this.status = 'success'
          return true
        } else {
          this.status = 'error'
          return false
        }
        console.log(this.status)
      }
    },
    inputFn(e) {
      // 这里是底层的通过dom获取到的值
      let value = e.target.value

      this.$emit('input', value)

      this.validated(value)
    }
  }
}
// 心得： 父组件传来的数据  和自身的数据
</script>

 <style lang="less" scoped>
// .hm-input {
//   height: 50px;
//   margin: 0 10px;
//   input {
//     height: 30px;
//     line-height: 30px;
//     outline: none;
//     border: none;
//     border-bottom: 1px solid #ccc;
//     width: 100%;
//     font-size: 16px;
//     color: #666;

//     &.success {
//       border-color: green;
//     }

//     &.error {
//       border-color: red;
//     }
//   }

//   .tips {
//     color: red;
//     font-size: 12px;
//     height: 20px;
//     line-height: 20px;
//   }
// }
//
.hm-input {
  height: 50px;
  margin: 0 20px;
  input {
    height: 30px;
    line-height: 30px;
    width: 100%;
    border: none;
    outline: none;
    font-size: 20px;
    border-bottom: 1px solid #666;
    &.success {
      border-bottom: 1px solid green;
    }
    &.error {
      border-bottom: 1px solid red;
    }
  }
  .tips {
    font-size: 12px;
    color: red;
    height: 20px;
    line-height: 20px;
  }
}
</style>
