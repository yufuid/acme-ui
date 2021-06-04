(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{O5Mb:function(t,n,e){"use strict";e.r(n),e.d(n,"_frontmatter",(function(){return b})),e.d(n,"default",(function(){return s}));var o=e("IKa1"),d=e("ITlK"),a=(e("r0ML"),e("V0Ug")),i=e("sN0p"),u=e("EeHy"),l=e("8OwP"),b=(e("xH0s"),{});void 0!==b&&b&&b===Object(b)&&Object.isExtensible(b)&&!b.hasOwnProperty("__filemeta")&&Object.defineProperty(b,"__filemeta",{configurable:!0,value:{name:"_frontmatter",filename:"src/Button.mdx"}});var c={_frontmatter:b},p=i.a;function s(t){var n,e,s,m,y,r,B,j,f=t.components,O=Object(d.a)(t,["components"]);return Object(a.b)(p,Object(o.a)({},c,O,{components:f,mdxType:"MDXLayout"}),Object(a.b)("h1",{id:"button-按钮组件"},"Button 按钮组件"),Object(a.b)(u.d,{of:l.a,mdxType:"Props"}),Object(a.b)(u.d,{of:l.a.Group,mdxType:"Props"}),Object(a.b)("h2",{id:"主要按钮"},"主要按钮"),Object(a.b)("p",null,"(重点突出)：用于主行动点，一个操作区域只能有一个主按钮。"),Object(a.b)(u.c,{__position:2,__code:"<div\n  style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}\n>\n  <Button>主要按钮</Button>\n  <Button disabled>Disabled</Button>\n  <Button loading>Loading</Button>\n</div>",__scope:(n={props:O,DefaultLayout:i.a,Playground:u.c,Props:u.d,Button:l.a},n.DefaultLayout=i.a,n._frontmatter=b,n),mdxType:"Playground"},Object(a.b)("div",{style:{width:"100%",display:"flex",justifyContent:"space-between"}},Object(a.b)(l.a,{mdxType:"Button"},"主要按钮"),Object(a.b)(l.a,{disabled:!0,mdxType:"Button"},"Disabled"),Object(a.b)(l.a,{loading:!0,mdxType:"Button"},"Loading"))),Object(a.b)("h2",{id:"次要按钮"},"次要按钮"),Object(a.b)("p",null,"(中等强调)：用于没有主次之分的一组行动点。"),Object(a.b)(u.c,{__position:3,__code:"<div\n  style={{\n    width: '100%',\n    display: 'flex',\n    justifyContent: 'space-between',\n  }}\n>\n  <Button mode=\"outlined\">次要按钮</Button>\n  <Button mode=\"outlined\" disabled>\n    Disabled\n  </Button>\n  <Button mode=\"outlined\" loading>\n    Loading\n  </Button>\n</div>",__scope:(e={props:O,DefaultLayout:i.a,Playground:u.c,Props:u.d,Button:l.a},e.DefaultLayout=i.a,e._frontmatter=b,e),mdxType:"Playground"},Object(a.b)("div",{style:{width:"100%",display:"flex",justifyContent:"space-between"}},Object(a.b)(l.a,{mode:"outlined",mdxType:"Button"},"次要按钮"),Object(a.b)(l.a,{mode:"outlined",disabled:!0,mdxType:"Button"},"Disabled"),Object(a.b)(l.a,{mode:"outlined",loading:!0,mdxType:"Button"},"Loading"))),Object(a.b)("h2",{id:"文字按钮"},"文字按钮"),Object(a.b)("p",null,"(低强调)：文本按钮通常用于次要的操作。"),Object(a.b)(u.c,{__position:4,__code:"<div\n  style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}\n>\n  <Button mode=\"minimal\">文字按钮</Button>\n  <Button mode=\"minimal\" disabled>\n    Disabled\n  </Button>\n  <Button mode=\"minimal\" loading>\n    Loading\n  </Button>\n</div>",__scope:(s={props:O,DefaultLayout:i.a,Playground:u.c,Props:u.d,Button:l.a},s.DefaultLayout=i.a,s._frontmatter=b,s),mdxType:"Playground"},Object(a.b)("div",{style:{width:"100%",display:"flex",justifyContent:"space-between"}},Object(a.b)(l.a,{mode:"minimal",mdxType:"Button"},"文字按钮"),Object(a.b)(l.a,{mode:"minimal",disabled:!0,mdxType:"Button"},"Disabled"),Object(a.b)(l.a,{mode:"minimal",loading:!0,mdxType:"Button"},"Loading"))),Object(a.b)("h2",{id:"危险按钮"},"危险按钮"),Object(a.b)("p",null,"(红色警告)：删除/移动/修改权限等危险操作，一般需要二次确认。"),Object(a.b)(u.c,{__position:5,__code:"<div\n  style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}\n>\n  <Button color=\"danger\">危险按钮</Button>\n  <Button color=\"danger\" disabled>\n    Disabled\n  </Button>\n  <Button color=\"danger\" loading>\n    Loading\n  </Button>\n</div>",__scope:(m={props:O,DefaultLayout:i.a,Playground:u.c,Props:u.d,Button:l.a},m.DefaultLayout=i.a,m._frontmatter=b,m),mdxType:"Playground"},Object(a.b)("div",{style:{width:"100%",display:"flex",justifyContent:"space-between"}},Object(a.b)(l.a,{color:"danger",mdxType:"Button"},"危险按钮"),Object(a.b)(l.a,{color:"danger",disabled:!0,mdxType:"Button"},"Disabled"),Object(a.b)(l.a,{color:"danger",loading:!0,mdxType:"Button"},"Loading"))),Object(a.b)("h2",{id:"幽灵按钮"},"幽灵按钮"),Object(a.b)("p",null,"将其他按钮的内容反色，背景变为透明，常用在有色背景上。"),Object(a.b)(u.c,{__position:6,__code:"<div\n  style={{\n    backgroundColor: '#333333',\n    display: 'flex',\n    justifyContent: 'space-between',\n    padding: '32px 40px',\n  }}\n>\n  <Button mode=\"contained\" ghost>\n    幽灵按钮\n  </Button>\n  <Button mode=\"outlined\" ghost>\n    幽灵按钮\n  </Button>\n  <Button mode=\"minimal\" ghost>\n    幽灵按钮\n  </Button>\n</div>",__scope:(y={props:O,DefaultLayout:i.a,Playground:u.c,Props:u.d,Button:l.a},y.DefaultLayout=i.a,y._frontmatter=b,y),mdxType:"Playground"},Object(a.b)("div",{style:{backgroundColor:"#333333",display:"flex",justifyContent:"space-between",padding:"32px 40px"}},Object(a.b)(l.a,{mode:"contained",ghost:!0,mdxType:"Button"},"幽灵按钮"),Object(a.b)(l.a,{mode:"outlined",ghost:!0,mdxType:"Button"},"幽灵按钮"),Object(a.b)(l.a,{mode:"minimal",ghost:!0,mdxType:"Button"},"幽灵按钮"))),Object(a.b)("h2",{id:"按钮组"},"按钮组"),Object(a.b)("p",null,"常用于多项类似操作。"),Object(a.b)(u.c,{__position:7,__code:'<div style={{ display: \'flex\', justifyContent: \'center\' }}>\n  <Button.Group style={{ marginRight: \'80px\' }} mode="minimal">\n    <Button mode="outlined" size="large">\n      1\n    </Button>\n    <Button mode="outlined">2</Button>\n  </Button.Group>\n  <Button.Group>\n    <Button mode="contained">1</Button>\n    <Button mode="contained">2</Button>\n    <Button mode="contained">3</Button>\n  </Button.Group>\n</div>',__scope:(r={props:O,DefaultLayout:i.a,Playground:u.c,Props:u.d,Button:l.a},r.DefaultLayout=i.a,r._frontmatter=b,r),mdxType:"Playground"},Object(a.b)("div",{style:{display:"flex",justifyContent:"center"}},Object(a.b)(l.a.Group,{style:{marginRight:"80px"},mode:"minimal"},Object(a.b)(l.a,{mode:"outlined",size:"large",mdxType:"Button"},"1"),Object(a.b)(l.a,{mode:"outlined",mdxType:"Button"},"2")),Object(a.b)(l.a.Group,null,Object(a.b)(l.a,{mode:"contained",mdxType:"Button"},"1"),Object(a.b)(l.a,{mode:"contained",mdxType:"Button"},"2"),Object(a.b)(l.a,{mode:"contained",mdxType:"Button"},"3")))),Object(a.b)("h2",{id:"block-按钮"},"Block 按钮"),Object(a.b)("p",null,"将按钮宽度调整为其父宽度的选项。"),Object(a.b)(u.c,{__position:8,__code:'<div>\n  <Button style={{ marginBottom: \'16px\' }} mode="contained" fullWidth>\n    主要按钮\n  </Button>\n  <Button style={{ marginBottom: \'16px\' }} mode="outlined" fullWidth>\n    次要按钮\n  </Button>\n  <Button style={{ marginBottom: \'16px\' }} color="danger" fullWidth>\n    危险按钮\n  </Button>\n  <Button mode="minimal" fullWidth>\n    文字按钮\n  </Button>\n</div>',__scope:(B={props:O,DefaultLayout:i.a,Playground:u.c,Props:u.d,Button:l.a},B.DefaultLayout=i.a,B._frontmatter=b,B),mdxType:"Playground"},Object(a.b)("div",null,Object(a.b)(l.a,{style:{marginBottom:"16px"},mode:"contained",fullWidth:!0,mdxType:"Button"},"主要按钮"),Object(a.b)(l.a,{style:{marginBottom:"16px"},mode:"outlined",fullWidth:!0,mdxType:"Button"},"次要按钮"),Object(a.b)(l.a,{style:{marginBottom:"16px"},color:"danger",fullWidth:!0,mdxType:"Button"},"危险按钮"),Object(a.b)(l.a,{mode:"minimal",fullWidth:!0,mdxType:"Button"},"文字按钮"))),Object(a.b)("h2",{id:"按钮尺寸"},"按钮尺寸"),Object(a.b)("p",null,"按钮有大、标准、小三种尺寸。"),Object(a.b)(u.c,{__position:9,__code:"<div\n  style={{\n    width: '100%',\n    display: 'flex',\n    justifyContent: 'space-between',\n    alignItems: 'center',\n  }}\n>\n  <Button size=\"large\">大尺寸</Button>\n  <Button>标准尺寸</Button>\n  <Button size=\"small\">小尺寸</Button>\n</div>",__scope:(j={props:O,DefaultLayout:i.a,Playground:u.c,Props:u.d,Button:l.a},j.DefaultLayout=i.a,j._frontmatter=b,j),mdxType:"Playground"},Object(a.b)("div",{style:{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center"}},Object(a.b)(l.a,{size:"large",mdxType:"Button"},"大尺寸"),Object(a.b)(l.a,{mdxType:"Button"},"标准尺寸"),Object(a.b)(l.a,{size:"small",mdxType:"Button"},"小尺寸"))))}void 0!==s&&s&&s===Object(s)&&Object.isExtensible(s)&&!s.hasOwnProperty("__filemeta")&&Object.defineProperty(s,"__filemeta",{configurable:!0,value:{name:"MDXContent",filename:"src/Button.mdx"}}),s.isMDXComponent=!0}}]);
//# sourceMappingURL=component---src-button-mdx-2c9f989c113f90406ba3.js.map