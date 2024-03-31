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

- [35. 搜索插入位置](https://leetcode.cn/problems/search-insert-position/description/)

- [34. 在排序数组中查找元素的第一个和最后一个位置](https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/description/)

- [69. x 的平方根 ](https://leetcode.cn/problems/sqrtx/description/)

- [367. 有效的完全平方数](https://leetcode.cn/problems/valid-perfect-square/description/)
  :::

### 移除元素
