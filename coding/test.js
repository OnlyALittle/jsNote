var nums1 = [1,2,3,7, 0, 0, 0]
var nums2 = [2,5,6]
var merge = function(nums1, m, nums2, n) {
    let i = m - 1;
    let j = n - 1;
    let cur = nums1.length - 1;
    while(cur >= 0 && j >= 0) {
        if (nums1[i] > nums2[j]){
            nums1[cur] = nums1[i]
            i--;
        }
        else {
            nums1[cur] = nums2[j];
            j--;
        }
        cur--;
    }
};
merge(nums1, 4, nums2, 3)
console.log(nums1)