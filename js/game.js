(function () {
  window.Game = function () {
    this.rows = 10; //行
    this.columns = 10; //列
    this.mineNum = 10; //雷的个数
    this.init();
    this.map = new Mapp(this);
    this.bindEvent();
    this.markNum = document.getElementById('markNum');
    this.markNum.innerText = this.mineNum;
    this.numColor = ['#7676e4', '#748c42', '#60c5a2', '#da9c39', '#bd3204', '#b43ef9', '#cc47ad', '#fd007c'];
    this.openNum = this.rows * this.columns;
    this.fail = true;
  }
  //渲染表格
  Game.prototype.init = function () {
    this.table = document.getElementById('table');
    this.table.innerHTML = '';
    for (var i = 0; i < this.rows; i++) {
      var tr = document.createElement('tr');
      for (var j = 0; j < this.columns; j++) {
        var td = document.createElement('td');
        td.setAttribute('data-row', i);
        td.setAttribute('data-col', j);
        var span = document.createElement('span');
        td.appendChild(span);
        tr.appendChild(td);
      }
      this.table.appendChild(tr);
    }
    document.body.appendChild(this.table);
  }
  //点击事件 并赋值
  Game.prototype.bindEvent = function () {
    var self = this;
    //点击显示td
    this.table.onclick = function (e) {
      var target = e.target || e.srcElement;
      if (target.tagName.toLowerCase() === 'span') {
        var parent = target.parentNode;
        var row = ~~parent.getAttribute('data-row'); //行数
        var col = ~~parent.getAttribute('data-col'); //个数
        if (self.map.code[row][col] === 0) { //0代表空白
          self.openBlanks(row, col);
        } else if (self.map.code[row][col] === -1) { //-1代表雷
          parent.innerText = '雷';
          parent.style.color = 'red';
          self.fail = false;
          self.gameSwitch();
        } else { //其余代表数字
          var code = self.map.code[row][col];
          self.setText(parent, code);
        }
      }
    }
    //选择游戏难易程度
    var select = document.getElementById('level');
    select.onchange = function (e) {
      switch (select.value) {
        case '1':
          reset(10, 10, 10)
          break;
        case '2':
          reset(15, 15, 20)
          break;
        case '3':
          reset(15, 15, 30)
          break;
      }
      //重新设置表格行  列  地雷数
      function reset(row, col, mine) {
        self.rows = row;
        self.columns = col;
        self.mineNum = mine;
        self.openNum = self.rows * self.columns;
        self.map = new Mapp(self);
        self.markNum.innerText = self.mineNum;
        self.init();
      }
    }
  }
  //打开空白连接区域
  Game.prototype.openBlanks = function (i, j) {
    if (!this.map.check(i, j)) return; //判断i,j是否在表格内
    if (this.map.code[i][j] === 0) { //当前格是空白
      this.table.getElementsByTagName('tr')[i].getElementsByTagName('td')[j].innerText = '';
      if (this.map.mineStatus[i][j] === 1) return; //判断是当前格是否有揭开
      this.map.mineStatus[i][j] = 1; //设置揭开标志
      if (this.map.code[i][j] !== 0) return; //如果当前格不是空白  不执行下面的8个方向递归查询
      //检测剩余雷数
      this.openNum--;
      this.checkWin();
      //递归循环查找空白
      this.openBlanks(i - 1, j - 1);
      this.openBlanks(i - 1, j);
      this.openBlanks(i - 1, j + 1);
      this.openBlanks(i, j - 1);
      this.openBlanks(i, j + 1);
      this.openBlanks(i + 1, j - 1);
      this.openBlanks(i + 1, j);
      this.openBlanks(i + 1, j + 1);
    } else {
      if (this.map.mineStatus[i][j] === 1) return; //判断是当前格是否有揭开
      this.map.mineStatus[i][j] = 1; //设置揭开标志
      var code = this.map.code[i][j];
      var target = this.table.getElementsByTagName('tr')[i].getElementsByTagName('td')[j];
      //设置当前格字数
      this.setText(target, code);
    }
  }
  //设置当前格是表示雷的个数方法
  Game.prototype.setText = function (target, code) {
    target.innerText = code;
    target.style.backgroundColor = '#ccc';
    target.style.color = this.numColor[code - 1];
    this.openNum--;
    this.checkWin();
  }
  //检测否扫雷成功
  Game.prototype.checkWin = function () {
    // console.log(this.openNum);
    if (this.openNum == this.mineNum && this.fail) {
      alert('恭喜你扫雷成功');
      this.showMine();
    }
  }
  //踩到雷 重新游戏/查看雷
  Game.prototype.gameSwitch = function () {
    var self = this;
    document.onclick = function (e) { //表格一直在变  有未来元素  用事件委托
      var target = e.target || e.srcElement;
      document.getElementById('shade').style.display = 'block';
      if (target.tagName.toLowerCase() === 'button') {
        var id = target.getAttribute('id');
        if (id === 'gameover') {
          document.getElementById('shade').style.display = 'none';
          document.onclick = null;
          self.showMine();
        } else {
          window.location.reload();
        }
      }
    }
  }
  //显示雷
  Game.prototype.showMine = function () {
    var self = this;
    for (var i = 0; i < self.rows; i++) {
      for (var j = 0; j < self.columns; j++) {
        if (self.map.code[i][j] === -1) {
          var target = self.table.getElementsByTagName('tr')[i].getElementsByTagName('td')[j]
          target.innerText = '雷';
          target.style.color = 'red';
        }
      }
    }
  }
})()