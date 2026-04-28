(function () {
      function pos(el, container) {
        var er = el.getBoundingClientRect();
        var cr = container.getBoundingClientRect();
        return {
          x:      er.left - cr.left,
          y:      er.top  - cr.top,
          w:      er.width,
          h:      er.height,
          cx:     er.left - cr.left + er.width  / 2,
          cy:     er.top  - cr.top  + er.height / 2,
          right:  er.left - cr.left + er.width,
          bottom: er.top  - cr.top  + er.height,
        };
      }
 
      function draw() {
        var canvas = document.getElementById('canvas');
        var svg    = document.getElementById('connectors');
        var root   = document.getElementById('root');
        var rowIds = ['row-top', 'row-mid', 'row-bottom'];
        var rows   = rowIds.map(function (id) { return document.getElementById(id); });
 
        /* Match canvas height to branches height */
        var bel    = document.getElementById('branches');
        var br     = bel.getBoundingClientRect();
        var cr     = canvas.getBoundingClientRect();
        var totalH = (br.bottom - cr.top) + 20;
        canvas.style.height = totalH + 'px';
        svg.setAttribute('viewBox', '0 0 ' + cr.width + ' ' + totalH);
        svg.setAttribute('width',  cr.width);
        svg.setAttribute('height', totalH);
 
        var R = pos(root, canvas);
        var lines = '';
 
        rows.forEach(function (row) {
          var firstNode = row.firstElementChild;
          var N     = pos(firstNode, canvas);
          var entryX = N.x;
          var rowCY  = N.cy;
          var startX = R.right;
          var midX   = startX + (entryX - startX) * 0.45;
 
          /* L-shaped path: root → elbow → row entry */
          var d = 'M ' + startX + ' ' + R.cy +
                  ' L ' + midX   + ' ' + R.cy +
                  ' L ' + midX   + ' ' + rowCY +
                  ' L ' + entryX + ' ' + rowCY;
 
          /* Dim shadow line */
          lines += '<path d="' + d + '" fill="none" stroke="#003322" stroke-width="4"'
                +  ' stroke-linecap="round" stroke-linejoin="round"/>';
          /* Glow line */
          lines += '<path d="' + d + '" class="line-glow" fill="none" stroke="#00ff99" stroke-width="2"'
                +  ' stroke-linecap="round" stroke-linejoin="round"/>';
          /* Animated pulse */
          lines += '<path d="' + d + '" class="line-glow pulse-line" fill="none" stroke="#00ffcc"'
                +  ' stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.7"/>';
 
          /* Sibling connectors within each row */
          var nodeEls = Array.from(row.children);
          for (var i = 0; i < nodeEls.length - 1; i++) {
            var A  = pos(nodeEls[i],     canvas);
            var B  = pos(nodeEls[i + 1], canvas);
            var x1 = A.right, x2 = B.x, y = A.cy;
            lines += '<line x1="' + x1 + '" y1="' + y + '" x2="' + x2 + '" y2="' + y + '"'
                  +  ' stroke="#003322" stroke-width="4"/>';
            lines += '<line class="line-glow" x1="' + x1 + '" y1="' + y + '" x2="' + x2 + '" y2="' + y + '"'
                  +  ' stroke="#00ff99" stroke-width="2"/>';
            lines += '<line class="line-glow pulse-line" x1="' + x1 + '" y1="' + y + '" x2="' + x2 + '" y2="' + y + '"'
                  +  ' stroke="#00ffcc" stroke-width="1.5" opacity="0.7"/>';
          }
        });
 
        svg.innerHTML = lines;
      }
 
      if (document.readyState === 'complete') {
        setTimeout(draw, 100);
      } else {
        window.addEventListener('load', function () { setTimeout(draw, 100); });
      }
    })();