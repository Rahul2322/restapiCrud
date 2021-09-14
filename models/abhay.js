function matrixSum(arr) {
  let leftSum = 0,rightSum=0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      if (i === j) {
        // console.log(i, j)
        leftSum += arr[i][j]
      }
    }
  }
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      if (i+ + j  == arr.length - 1 ) {
        // console.log(i, j)
        rightSum += arr[i][j]
      }
    }
  }
  // console.log(leftSum);
  // console.log(rightSum)
      return Math.abs(leftSum - rightSum)
  }

  console.log(matrixSum([[11,2,4],[4,5,6],[10,8,-12]]))
  console.log(matrixSum([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]]))

  // function matrixSum(arr) {
  //   let sum = 0;
  //   for (let i = 0; i < arr.length; i++) {
  //     for (let j = 0; j < arr.length; j++) {
  //       if (i == arr.length - 1 - j) {
  //         console.log(i, j)
  //         sum += arr[i][j]
  //       }
  //     }
  //   }
  //   return sum
  // }
  // console.log(matrixSum([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]]))