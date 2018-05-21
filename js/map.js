(function () {
  window.Mapp = function (medium) {
    this.medium = medium; //中介者medium
    var self = this;
    //表格意义
    this.code = (function () {  
      var arr = [];
      for (var i = 0; i < self.medium.rows; i++) {
        arr[i] = [];
        for (var j = 0; j < self.medium.columns; j++) {
          arr[i].push(0);
        }
      }
      return arr;
    })()
    //表格状态
    this.mineStatus = (function () {  //表格是否被揭开的一个显示状态  后期置为1的表示当前格已揭开
      var arr = [];
      for(var i=0;i<self.code.length;i++) {
        arr[i] = self.code[i].map(function(item) {
          return item
        })
      }
      return arr;
    })()
    //雷的位置
    this.mineCode = (function () {
      var arr = [];
      for (var i = 0; i < self.medium.mineNum; i++) {
        var row = Math.ceil((self.medium.rows * Math.random())) - 1;
        var col = Math.ceil((self.medium.columns * Math.random())) - 1;
        arr.push({
          row: row,
          col: col
        });
      }
      //雷去重
      for (var i = 0; i < arr.length; i++) {
        for (var j = i + 1; j < arr.length; j++) {
          if (arr[i].row === arr[j].row && arr[i].col === arr[j].col) {
            var row = 0,col=0;
            do {
              row  = Math.ceil(self.medium.rows * Math.random()) - 1;
              col = Math.ceil(self.medium.columns * Math.random()) - 1;
            } while(row == arr[i].row && col == arr[j].col)
            arr.splice(j,1,{row:row,col:col});
          }
        }
      }
      return arr;
    })()
    this.renderMine();
  }
  //设置雷
  Mapp.prototype.renderMine = function () {
    var len = this.mineCode.length;
    for (var i = 0; i < len; i++) {
      this.code[this.mineCode[i].row][this.mineCode[i].col] = -1;
    }
    this.renderNum();
  }
  //判断周围是否有雷
  Mapp.prototype.renderNum = function () {
    for (var i = 0; i < this.medium.rows; i++) {
      for (var j = 0; j < this.medium.columns; j++) {
        if (this.code[i][j] === -1) continue;
        //if (this.check(i,j))
        var num = 0;
        //上
        if (this.check(i - 1, j) && this.code[i - 1][j] === -1) {
          num++
        }
        //左上
        if (this.check(i - 1, j - 1) && this.code[i - 1][j - 1] === -1) {
          num++;
        }
        //右上
        if (this.check(i - 1, j + 1) && this.code[i - 1][j + 1] === -1) {
          num++;
        }
        //左
        if (this.check(i, j - 1) && this.code[i][j - 1] === -1) {
          num++;
        }
        //右
        if (this.check(i, j + 1) && this.code[i][j + 1] === -1) {
          num++;
        }
        //右下
        if (this.check(i + 1, j + 1) && this.code[i + 1][j + 1] === -1) {
          num++;
        }
        //下
        if (this.check(i + 1, j) && this.code[i + 1][j] === -1) {
          num++;
        }
        //左下
        if (this.check(i + 1, j - 1) && this.code[i + 1][j - 1] === -1) {
          num++;
        }
        if (num > 0) this.code[i][j] = num;
      }
    }
    console.log(this.code);
  }
  //检测行列是否在范围之内
  Mapp.prototype.check = function (row, col) {
    var ret = true;
    if (row < 0 || row > this.medium.rows - 1) ret = false;
    if (col < 0 || col > this.medium.columns - 1) ret = false;
    return ret;
  }
})()