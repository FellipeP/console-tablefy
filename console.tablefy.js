console.tablefy = (...list) => {

  const colors = {
    default:       "\x1b[39m",
    black:         "\x1b[30m",
    red:           "\x1b[31m",
    green:         "\x1b[32m",
    yellow:        "\x1b[33m",
    blue:          "\x1b[34m",
    magenta:       "\x1b[35m",
    cyan:          "\x1b[36m",
    light_gray:    "\x1b[37m",
    dark_ray:      "\x1b[90m",
    light_red:     "\x1b[91m",
    light_green:   "\x1b[92m",
    light_yellow:  "\x1b[93m",
    light_blue:    "\x1b[94m",
    light_magenta: "\x1b[95m",
    light_cyan:    "\x1b[96m",
    default_White: "\x1b[97m"
  };

  const styles = {
    honeywell: {
      topBody: `═`,
      topJoin: `╤`,
      topLeft: `╔`,
      topRight: `╗`,

      bottomBody: `═`,
      bottomJoin: `╧`,
      bottomLeft: `╚`,
      bottomRight: `╝`,

      bodyLeft: `║`,
      bodyRight: `║`,
      bodyJoin: `│`,

      joinBody: `─`,
      joinLeft: `╟`,
      joinRight: `╢`,
      joinJoin: `┼`
    },
    norc: {
      topBody: `─`,
      topJoin: `┬`,
      topLeft: `┌`,
      topRight: `┐`,

      bottomBody: `─`,
      bottomJoin: `┴`,
      bottomLeft: `└`,
      bottomRight: `┘`,

      bodyLeft: `│`,
      bodyRight: `│`,
      bodyJoin: `│`,

      joinBody: `─`,
      joinLeft: `├`,
      joinRight: `┤`,
      joinJoin: `┼`
    },
    ramac: {
      topBody: `-`,
      topJoin: `+`,
      topLeft: `+`,
      topRight: `+`,

      bottomBody: `-`,
      bottomJoin: `+`,
      bottomLeft: `+`,
      bottomRight: `+`,

      bodyLeft: `|`,
      bodyRight: `|`,
      bodyJoin: `|`,

      joinBody: `-`,
      joinLeft: `|`,
      joinRight: `|`,
      joinJoin: `|`
    },
    void: {
      topBody: ``,
      topJoin: ``,
      topLeft: ``,
      topRight: ``,

      bottomBody: ``,
      bottomJoin: ``,
      bottomLeft: ``,
      bottomRight: ``,

      bodyLeft: ``,
      bodyRight: ``,
      bodyJoin: ``,

      joinBody: ``,
      joinLeft: ``,
      joinRight: ``,
      joinJoin: ``
    }
  }

  var defaults = {
    cell_pos: 'right',
    window_pos: 'right',
    head_color: 'cyan',
    style: 'honeywell',
    // title: '',
    orientation: 'horizontal',
    responsive: false,
    log: true,
    // custom: {
    //   topBody: `═`,
    //   topJoin: `╤`,
    //   topLeft: `╔`,
    //   topRight: `╗`,
    //
    //   bottomBody: `═`,
    //   bottomJoin: `╧`,
    //   bottomLeft: `╚`,
    //   bottomRight: `╝`,
    //
    //   bodyLeft: `║`,
    //   bodyRight: `║`,
    //   bodyJoin: `│`,
    //
    //   joinBody: `─`,
    //   joinLeft: `╟`,
    //   joinRight: `╢`,
    //   joinJoin: `┼`
    // }
  };

  if(list.length > 1 && !Array.isArray(list.slice(-1)[0]) && typeof list.slice(-1)[0] === 'object') {
    let CONFIG = list.slice(-1)[0];
    Object.keys(CONFIG).forEach(k => defaults[k] = CONFIG[k]);
    list.pop();
  }

  let cl_str = (s) => s.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
  let strD = (s, i) => ({
    l:  typeof s === 'string' ? cl_str(s).split('\n').map(l => l.length).reduce((a, b) => b > a ? + b : a, 0) : 0,
    w:  typeof s === 'string' ? cl_str(s).split('\n').length : 0,
    ln: typeof s === 'string' ? cl_str(s).split('\n')[i] ? s.split('\n')[i] : '' : ''
  });
  let strCr = (s, m) => {
    var sb = typeof s === 'string' ?
    strD(cl_str(s)).l > m ?
    m < 3 ? '.'.repeat(m) :
    cl_str(s).substr(0, m - 3) + '...' : s : s;
    return sb;
  }
  let h_style = h => `\x1b[1m${colors[defaults.head_color] ? colors[defaults.head_color] : defaults.head_color}` + h + '\x1b[0m';
  let strfy = s => JSON.stringify(s, null, 2);
  let obj_list = obj => Object.keys(obj).map(k => obj[k]);

  // process.stdout.rows
  // process.stdout.columns
  // process.stdout.write(string + '\n');
  // readline = require('readline');
  // readline.clearLine(process.stdout, 0);
  // readline.cursorTo(process.stdout, 0, 5);
  // readline.moveCursor(process.stdout, 0, -1);
  // process.stdout.write('[2K[1G');

  var win_length = process.stdout.rows;
  var win_width  = process.stdout.columns;

  var style = styles[defaults.style] ? styles[defaults.style] : styles.honeywell;
  style = defaults.custom ? Object.assign(styles.honeywell, defaults.custom) : style;

  let just_pos = (s, d) => {
    if(d < 0) d = 0;
    return defaults.cell_pos === 'right'  ? s + ' '.repeat(d) :
    defaults.cell_pos === 'left'   ? ' '.repeat(d) + s :
    defaults.cell_pos === 'center' ? d % 2 > 0 ?
    ' '.repeat(d / 2) + s + ' '.repeat((d / 2) + 1) :
    ' '.repeat(d / 2) + s + ' '.repeat(d / 2) :
    s + ' '.repeat(d)
  }

  function h_plot(L){
    var lens = L.map(l =>
      Array.isArray(l) ?
      l.map(len =>
        typeof len === 'string' || typeof len === 'number' ? strD(len + '').l :
        Array.isArray(len) ? strD(h_plot(len)).l :
        '') :
      typeof l === 'string' ? [strD(l).l] :
      [0]
    );
    var maxs = lens[0]
    .map((i, p) => lens.map(m => m[p]))
    .map(len => len.reduce((a, b) => b > a ? + b : a, 0));

    var table = `${style.topLeft}${style.topBody}` + maxs.map(m => style.topBody.repeat(m)).join(`${style.topBody}${style.topJoin}${style.topBody}`) + `${style.topBody}${style.topRight}\n`;

    if(defaults.responsive) {
      if(strD(table).l > process.stdout.columns){
        var diff = strD(table).l - process.stdout.columns;
        var sumL = strD(table).l;
        var sumM = Math.ceil(maxs.reduce((a, b) => a + b, 0));
        do{
          maxs = maxs.map(m => Math.floor(m - (m * (diff / sumM))))
          maxs = maxs.map(m => m < 0 ? 0 : m);
        }while (maxs.find(m => m < 0))
        table = `${style.topLeft}${style.topBody}` + maxs.map(m => style.topBody.repeat(m)).join(`${style.topBody}${style.topJoin}${style.topBody}`) + `${style.topBody}${style.topRight}\n`;
      }
    }

    L.map((l, ix) => {
      l = lens[0].map((len, il) => l[il] ? l[il] : '');
      l = l.map(len =>
        typeof len === 'string' || typeof len === 'number' ? len + '' :
        Array.isArray(len) ? ( h_plot( /* */ len.map(ln => typeof ln === 'string' ? [ln] : ln )) /* */ ) : ''
      );
      var max_w = l.map(i => strD(i).w).reduce((a, b) => b > a ? + b : a, 0);
      for (var il = 0; il < max_w; il++)
        table += `${style.bodyLeft} ` + l.map((i, p) => just_pos(strCr(strD(i, il).ln, maxs[p]), maxs[p] - strD(strD(i, il).ln).l )  ).join(` ${style.bodyJoin} `) + ` ${style.bodyRight}\n`;
      table += (ix + 1) !== L.length ?
        `${style.joinLeft}${style.joinBody}` + maxs.map(m => style.joinBody.repeat(m)).join(`${style.joinBody}${style.joinJoin}${style.joinBody}`) + `${style.joinBody}${style.joinRight}\n`:
        `${style.bottomLeft}${style.bottomBody}` + maxs.map(m => style.bottomBody.repeat(m)).join(`${style.bottomBody}${style.bottomJoin}${style.bottomBody}`) + `${style.bottomBody}${style.bottomRight}`
    });
    return table;
  }
  function h_table(L) {
    L = Array.isArray(L) ? L : [L + ''];
    L = JSON.parse(JSON.stringify(L));
    L = L.map(l => typeof l === 'object' ? l : { [l + '']: l });
    var head = L.reduce((a, b) => a.concat(Object.keys(b)), []).filter((i, p, a) => a.indexOf(i) == p);
        head = head.map(h => h_style(h));
    var body = [ head ];
    L
    .map((l, i) => {
      // l = Array.isArray(l) ? l : [ { [l + '']: l + '' } ];
      var line = []
      head.map(h => l[cl_str(h)] ? line.push(l[cl_str(h)]) : line.push(''));
      return line;
    })
    .map((l, i) => {
      l = Array.isArray(l) ? l :
      typeof l === 'string' || typeof l === 'number' ? [ l + '' ] :
      typeof l === 'object' ? obj_list(l) : [];
      l = l.map(ln => !Array.isArray(ln) && typeof ln === 'object' ? h_table([ln]) : ln);
      body.push(l);
    });
    return body;
  }

  function v_plot(L){
    var lens = L.map(l =>
      Array.isArray(l) ?
      l.map(len =>
        typeof len === 'string' || typeof len === 'number' ? strD(len + '').l :
        Array.isArray(len) ? strD(v_plot(len)).l :
        '') :
      typeof l === 'string' ? [strD(l).l] :
      [0]
    );

    var max = lens.reduce((a, b) => b.length > (Array.isArray(a) ? a.length : 0) ? + b.length : a.length, 0);
    var maxs = [];
    for (var i = 0; i < max; i++)
      maxs.push(lens.map(m => m[i]))
    maxs = maxs.map(len => len.reduce((a, b) => b > a ? + b : a, 0));

    var table = `${style.topLeft}${style.topBody}` + maxs.map(m => style.topBody.repeat(m)).join(`${style.topBody}${style.topJoin}${style.topBody}`) + `${style.topBody}${style.topRight}\n`;
    L.map((l, ix) => {
      var n = [];
      for (var il = 0; il < max; il++)
        n.push(l[il] ? l[il] : '');
      l = n;
      l = l.map(len =>
        typeof len === 'string' || typeof len === 'number' ? len + '' :
        Array.isArray(len) ? ( v_plot( /* */ len.map(ln => typeof ln === 'string' ? [ln] : ln )) /* */ ) : ''
      );
      var max_w = l.map(i => strD(i).w).reduce((a, b) => b > a ? + b : a, 0);
      for (var il = 0; il < max_w; il++)
        table += `${style.bodyLeft} ` + l.map((i, p) => just_pos(strD(i, il).ln, maxs[p] - strD(strD(i, il).ln).l)).join(` ${style.bodyJoin} `) + ` ${style.bodyRight}\n`;
      table += (ix + 1) !== L.length ?
        `${style.joinLeft}${style.joinBody}` + maxs.map(m => style.joinBody.repeat(m)).join(`${style.joinBody}${style.joinJoin}${style.joinBody}`) + `${style.joinBody}${style.joinRight}\n`:
        `${style.bottomLeft}${style.bottomBody}` + maxs.map(m => style.bottomBody.repeat(m)).join(`${style.bottomBody}${style.bottomJoin}${style.bottomBody}`) + `${style.bottomBody}${style.bottomRight}`
    });
    return table;
  }
  function v_table(L){
    L = Array.isArray(L) ? L : [L + ''];
    L = JSON.parse(JSON.stringify(L));
    L = L.map(l => typeof l === 'object' ? l : { [l + '']: l });
    var head = L.reduce((a, b) => a.concat(Object.keys(b)), []).filter((i, p, a) => a.indexOf(i) == p);
        head = head.map(h => h_style(h));
        body = head.map(h => [h].concat(L.map(l => {
          l = l[cl_str(h)];
          l = l ? l : '';
          l = typeof l === 'string' || typeof l === 'number' ? l + '' :
              typeof l === 'object' ? obj_list(l) : '';
          l = Array.isArray(l) ?
              l.map(ln =>
                !Array.isArray(ln) && typeof ln === 'object' ?
                  v_table([ln]) :
                ln) : l;
          return l;
        })));
    return body;
  }

  if(defaults.orientation === 'horizontal'){
    var result = list.map(l => h_plot(h_table(l)));
  }else if(defaults.orientation === 'vertical'){
    var result = list.map(l => v_plot(v_table(l)));
  }else{
    var result = list.map(l => h_plot(h_table(l)));
  }

  if(defaults.title){
    result = result.map(table => {
      var side = (strD(table).l / 2) - (strD(defaults.title).l / 2);
      side = side < 0 ? 0 : side;
      table = ' '.repeat(side) + h_style(defaults.title) + ' '.repeat(side) + '\n' +
      '-'.repeat(strD(table).l) + '\n' + table;
      return table;
    })
  }

  // result = result.map(r => r + '\n');
  if(defaults.window_pos === 'center'){
    result = result.map(r => {
      var j = ' '.repeat((process.stdout.columns / 2) - (strD(r).l / 2))
      return (j + r).split('\n').join('\n' + j);
    })
  }else if(defaults.window_pos === 'left'){
    result = result.map(r => {
      var j = ' '.repeat((process.stdout.columns) - (strD(r).l))
      return (j + r).split('\n').join('\n' + j);
    })
  }

  if(typeof defaults.log === 'boolean' && defaults.log === true){
    // console.log(...result);
    result.map(r => console.log(r))
  }else if(typeof defaults.log === 'function'){
    defaults.log(...result);
  }

  return result;
};

exports = console.tablefy;
