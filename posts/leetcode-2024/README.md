---
date: 2024-03-30
category: Frontend
tags:
  - Network
  - Vue
  - Node.js
spot: 巷寓
location: 深圳，海滨社区
outline: deep
draft: true
---

# 算法回忆录

之前在[《labuladong 的算法笔记》](https://labuladong.online/algo/) 刷过一遍

本次跟着[《代码随想录》](https://programmercarl.com/)刷一遍，希望有更多收获。

## 数组

### 二分查找

[704. 二分查找](https://leetcode.cn/problems/binary-search/)

::: details 思路
这道题目的前提是**数组为有序数组，同时题目还强调数组中无重复元素**，因为一旦有**重复元素**，使用二分查找法返回的元素下标可能不是唯一的.
因此核心在于找到边界条件，一般采用**左闭右闭即[left, right]**
:::

```js
var search = function (nums, target) {
  let left = 0,
    right = nums.length - 1;
  while (left <= right) {
    let mid = ((left + right) / 2) | 0;
    if (nums[mid] < target) {
      left = mid + 1;
    } else if (nums[mid] > target) {
      right = mid - 1;
    } else {
      // 当重复元素存在时寻找
      // 左区间: right = mid - 1
      // 右区间: left = mid + 1
      return mid;
    }
  }
  // 左区间: if (nums[left] === target && left >= 0) return left
  // 右区间：if (nums[right] === target && right <= nums.length) return right
  return -1;
};
```

- 时间复杂度：O(log n)
- 空间复杂度：O(1)

::: info 相关题目推荐

- [34. 在排序数组中查找元素的第一个和最后一个位置](https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/description/)

- [69. x 的平方根 ](https://leetcode.cn/problems/sqrtx/description/)

:::

### 移除元素

[27. 移除元素](https://leetcode.cn/problems/remove-element/description/)
:::details 思路
双指针法（快慢指针法）： 通过一个快指针和慢指针在一个 for 循环下完成两个 for 循环的工作。

定义快慢指针

快指针：寻找新数组的元素 ，新数组就是不含有目标元素的数组
慢指针：指向更新 新数组下标的位置
![](https://code-thinking.cdn.bcebos.com/gifs/27.%E7%A7%BB%E9%99%A4%E5%85%83%E7%B4%A0-%E5%8F%8C%E6%8C%87%E9%92%88%E6%B3%95.gif)
:::

```js
var removeElement = function (nums, val) {
  let i = (j = 0);
  while (j < nums.length) {
    if (nums[j] !== val) {
      nums[i++] = nums[j];
    }
    j++;
  }
  return i;
};
```

- 时间复杂度：O(n)
- 空间复杂度：O(1)

::: info 相关题目推荐

- [283. 移动零](https://leetcode.cn/problems/move-zeroes/description/)

- [844. 比较含退格的字符串](https://leetcode.cn/problems/backspace-string-compare/description/)

- [977. 有序数组的平方](https://leetcode.cn/problems/squares-of-a-sorted-array/description/)
  :::
