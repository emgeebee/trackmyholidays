(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{27:function(e,t,a){e.exports=a(47)},36:function(e,t,a){},39:function(e,t,a){},41:function(e,t,a){},42:function(e,t,a){},43:function(e,t,a){},44:function(e,t,a){},45:function(e,t,a){},46:function(e,t,a){},47:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),c=a(16),o=a.n(c),u=a(1),l=(a(36),a(24)),i=a(2),s=a(4),d=a(15);d().format();var f=Object(s.a)(function(e){return e.dates},function(e){return e.loading}),m=Object(s.a)(function(e){return e.dates.startMonth},function(e){return e.dates.currentYear},function(e,t){for(var a=[],n=function(n){var r=d([t,e,1]).add(n,"M"),c=Array.from({length:d(r).daysInMonth()},function(e,t){return d(r).startOf("month").add(t,"days")});a.push(c)},r=0;r<12;r++)n(r);return a}),b=Object(s.a)(function(e){return e.dates.bankHolidays},function(e){return e.reduce(function(e,t){return e[t.start]={hol:Object(i.a)({},t,{isBHoliday:!0})},e},{})}),O=Object(s.a)(function(e){return e.dates.holidays},b,function(e,t){var a=e.reduce(function(e){return function(t,a){var n=Object.keys(e),r=d(a.start,"YY-MM-DD"),c=d(a.end,"YY-MM-DD");c.isBefore(r,"day")&&(r=c,c=d(a.start,"YY-MM-DD"));for(var o=0,u=r.clone();r.isSameOrBefore(c,"day");)0===r.day()||6===r.day()||n.includes(r.format("YY-MM-DD"))||o++,r.add(1,"d");for(r=u;r.isSameOrBefore(c,"day");)0!==r.day()&&6!==r.day()&&(t[r.format("YY-MM-DD")]={hol:a,length:o}),r.add(1,"d");return t}}(t),{});return Object(i.a)({},a,t)}),E=function(e,t){return function(a){var n=d(a.start,"YY-MM-DD"),r=d("".concat(e,"-").concat(t+1,"-01"),"YYYY-MM-DD"),c=d("".concat(e+1,"-").concat(t+1,"-01"),"YYYY-MM-DD");return r<=n&&n<c&&a}},y=function(e){return function(t){var a=Object.keys(e),n=d(t.start,"YY-MM-DD"),r=d(t.end,"YY-MM-DD");r.isBefore(n,"day")&&(n=r,r=d(t.start,"YY-MM-DD"));for(var c=[];n.isSameOrBefore(r,"day");)0===n.day()||6===n.day()||a.includes(n.format("YY-MM-DD"))||c.push(n.format("YY-MM-DD")),n.add(1,"d");return c}},j=Object(s.a)(function(e){return e.dates.startDay},function(e){return e.dates.endOfCurrent},b,function(e,t,a){return[{start:e,end:t}].map(y(a)).flat()}),p=Object(s.a)(function(e){return e.dates.holidays},function(e){return e.dates.currentYear},function(e){return e.dates.startMonth},b,function(e,t,a,n){return e.filter(E(t,a)).map(y(n)).flat()}),h=Object(s.a)(function(e){return e.dates.bankHolidays},function(e){return e.dates.currentYear},function(e){return e.dates.startMonth},function(e,t,a){return e.filter(E(t,a)).map(function(e){return e.start})}),D=Object(s.a)(function(e){return e.dates.carriedOver},function(e){return e.dates.currentYear},function(e){return e.dates.daysPerYear},p,j,function(e,t,a,n,r){return(e[t]||0)+a-n.length-r.length}),v=Object(s.a)(function(e){return e.dates.selected},O,function(e,t){return!!e&&t[e.formattedDay]}),Y=Object(s.a)(function(e){return e.dates.currentYear},function(e,t){return e.dates.carriedOver},function(e,t){return t[e]||0}),k=Object(s.a)(function(e){return e.dates.currentYear},function(e){return e||0}),C=Object(s.a)(function(e){return e.dates.startDay},function(e){return""!==e}),_=Object(s.a)(function(e){return e.dates.startDay},function(e){return e||""}),M=function(e){return e.auth.ww},A=Object(s.a)(M,function(e){return!!(console.log("ww",e)||e&&e.tokenObj)}),g=Object(s.a)(M,function(e){return e&&e.Qt?e.Qt.Bd:""}),N=Object(s.a)(M,function(e){return e&&e.tokenObj?e.tokenObj.id_token:""}),T=a(8),S=a.n(T),w=a(13),H=a(49),R=a(11),L=Object(H.a)("DATES_DESELECT"),I=Object(H.a)("FETCH_DATES_FROM_SERVER"),F=Object(H.a)("LOAD_DATES_FROM_SERVER"),x=Object(H.a)("ADD_NEW_BANK_HOLIDAY"),B=Object(H.a)("UPDATE_BANK_HOLIDAYS"),G=Object(H.a)("DATES_SELECT_HOLIDAY"),P=function(e){return function(){var t=Object(w.a)(S.a.mark(function t(a,n){var r,c,o,u,l;return S.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return r=n(),""===(c=r.dates).startDay?(u=e,o=c.holidays):(u="",o=[].concat(Object(R.a)(c.holidays),[{start:c.startDay,end:e}])),l=Object(i.a)({},c,{startDay:u,holidays:Object(R.a)(o),endOfCurrent:""}),t.next=6,a({type:"DATES_SELECT_DAY",payload:l});case 6:""!==c.startDay&&a(U(JSON.stringify(Object(i.a)({},l,{selected:""})),r));case 7:case"end":return t.stop()}},t)}));return function(e,a){return t.apply(this,arguments)}}()},U=function(e,t){return function(a){console.log(t);var n=N(t);return fetch("https://78b76ebpsj.execute-api.us-west-2.amazonaws.com/dev/holidays",{method:"POST",body:e,headers:{Authorization:"Bearer ".concat(n),"Content-Type":"application/json"}})}},z=Object(H.a)("LOGIN_AND_LOAD_DATA",function(){var e=Object(w.a)(S.a.mark(function e(t){return S.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,he.dispatch({type:"LOGIN",payload:t});case 2:he.dispatch((t.tokenObj.id_token,function(e,t){var a=N(t());return e(I()),fetch("https://78b76ebpsj.execute-api.us-west-2.amazonaws.com/dev/holidays",{method:"GET",headers:{Authorization:"Bearer ".concat(a),"Content-Type":"application/json"}}).then(function(e){return e.json()}).then(function(t){return e(F(t))})}));case 3:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}()),J=(a(39),function(){var e=Object(u.c)(m),t=Object(u.c)(A),a=Object(u.c)(f),c=Object(u.b)(),o=Object(n.useCallback)(function(e){return c(z(e))},[c]);return r.a.createElement(r.a.Fragment,null,r.a.createElement(ae,null),r.a.createElement("div",{className:"container"},a?r.a.createElement("div",{className:"loader"}):t?e.map(function(e){return r.a.createElement(re,{key:e,month:e})}):r.a.createElement(l.GoogleLogin,{clientId:"195751140228-9tkaoajmqv2ghuh0p1gs0a974aufffuo.apps.googleusercontent.com",render:function(e){return r.a.createElement("button",{onClick:e.onClick,disabled:e.disabled},"Login with Google")},buttonText:"Login",onSuccess:o,onFailure:o,cookiePolicy:"single_host_origin"})),r.a.createElement(X,null))}),V=a(3),K=a(7),W={uk:{display:"UK",dates:[{date:""}]},usa:{display:"USA"}},Q=function(e){return!!e&&e.config.configIsOpen},q=(a(40),a(41),a(15));q().format();var $=function(){var e=Object(u.c)(Q),t=Object(u.c)(Y),a=Object(u.c)(h),c=Object(u.c)(O),o=a.reduce(function(e,t,a){return Object(i.a)({},e,Object(V.a)({},a,{key:a,name:c[t].hol.name,start:c[t].hol.start}))},{}),l=Object(u.b)(),s=Object(n.useCallback)(function(){return l({type:"CHANGE_CONFIG"})},[l]),d=Object(n.useCallback)(function(e){return l({type:"DATES_SELECT_START_MONTH",payload:e})},[l]),f=Object(n.useCallback)(function(e){return l({type:"DATES_UPDATE_CARRIED_OVER",payload:e})},[l]),m=Object(n.useCallback)(function(e){var t=e.target,a=t.name,n=t.value;e.persist();var r=Object(i.a)({},o[a],{start:"text"===t.type?o[a].start:n,name:"text"===t.type?n:o[a].name});l(B(Object.values(Object(i.a)({},o,Object(V.a)({},a,r))).map(function(e){return{name:e.name,start:10===e.start.length?e.start.slice(2):e.start}})))},[l,o]),b=Object(n.useCallback)(function(e){var t=e.target;t.name,t.value;e.persist(),l(x())},[l]);return e?r.a.createElement("div",{className:"modal"},r.a.createElement("div",{className:"controls"},r.a.createElement(K.d,null,r.a.createElement(K.b,null,r.a.createElement(K.a,null,"Dates"),r.a.createElement(K.a,null,"Bank Holidays"),r.a.createElement(K.a,{onClick:s},"Close")),r.a.createElement(K.c,null,r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"control"},r.a.createElement("h4",null,"Choose your holiday year start month:"),r.a.createElement("button",{onClick:function(){return d(0)}},"Jan"),r.a.createElement("button",{onClick:function(){return d(1)}},"Feb"),r.a.createElement("button",{onClick:function(){return d(2)}},"Mar"),r.a.createElement("button",{onClick:function(){return d(3)}},"Apr"),r.a.createElement("button",{onClick:function(){return d(4)}},"May"),r.a.createElement("button",{onClick:function(){return d(5)}},"Jun"),r.a.createElement("button",{onClick:function(){return d(6)}},"Jul"),r.a.createElement("button",{onClick:function(){return d(7)}},"Aug"),r.a.createElement("button",{onClick:function(){return d(8)}},"Sept"),r.a.createElement("button",{onClick:function(){return d(9)}},"Oct"),r.a.createElement("button",{onClick:function(){return d(10)}},"Nov"),r.a.createElement("button",{onClick:function(){return d(11)}},"Dec")),r.a.createElement("div",{className:"control"},r.a.createElement("label",{for:"co"},"Carried Over: "),r.a.createElement("input",{id:"co",type:"number",onChange:function(e){return f(e.target.value)},value:t})))),r.a.createElement(K.c,null,(console.log("rrender"),r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"control"},r.a.createElement("label",{for:"reset-dates"},"Reset bank holiday dates to country:"),r.a.createElement("select",{id:"reset-dates",value:"uk",onChange:function(){}},Object.keys(W).map(function(e){return{key:e,display:W[e].display}}).map(function(e){return r.a.createElement("option",{key:e.key,value:e.key},e.display)})),r.a.createElement("button",{onClick:s},"Reset")),Object.values(o).map(function(e){return r.a.createElement("div",{key:e.key,className:"control"},r.a.createElement("input",{type:"date",name:e.key,value:q(e.start,"YY-MM-DD").format("YYYY-MM-DD"),onChange:m}),r.a.createElement("input",{type:"text",name:e.key,value:e.name,onChange:m}))}),r.a.createElement("div",{className:"control"},r.a.createElement("button",{onClick:b},"Add new date"))))),r.a.createElement(K.c,null)))):null},X=(a(42),function(){var e=Object(u.c)(v),t=Object(u.b)(),a=Object(n.useCallback)(function(e){return t((a=e,function(){var e=Object(w.a)(S.a.mark(function e(t,n){var r;return S.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t(L(a));case 2:r=n(),t(U(JSON.stringify(Object(i.a)({},r.dates,{selected:""})),r));case 4:case"end":return e.stop()}},e)}));return function(t,a){return e.apply(this,arguments)}}()));var a},[t]);return e?r.a.createElement("footer",null,e.hol.isBHoliday?r.a.createElement(r.a.Fragment,null,r.a.createElement("span",{className:"from"},e.hol.name,": ",e.hol.start)):r.a.createElement(r.a.Fragment,null,r.a.createElement("span",{className:"from"},"From: ",e.hol.start),r.a.createElement("span",{className:"to"},"To: ",e.hol.end),r.a.createElement("span",{className:"length"},"(",e.length," days)"),r.a.createElement("button",{onClick:a.bind(null,e)},"Deselect"))):null}),Z=(a(43),a(15)),ee=function(e){var t=e.day,a=Z(t),c=a.format("YY-MM-DD"),o="0"===a.format("d")||"6"===a.format("d"),l=Object(u.b)(),i=Object(u.c)(p),s=Object(u.c)(h),d=i.indexOf(c)>-1,f=d?"hol":"",m=s.indexOf(c)>-1,b=m?"bhol":"",O=Object(u.c)(j).indexOf(c)>-1?"provhol":"",E=Object(u.c)(C),y=E&&!o?"select-mode":"",D=Object(u.c)(_)===c?"start-of-hol":"",v=P,Y=c;(d||m)&&(v=G,Y={formattedDay:c,isBHoliday:m}),o&&(v=!1);var k=Object(n.useCallback)(function(){return v?l(v(Y)):null},[l,v]),M=!1;E&&(M={type:"DATES_SELECT_END_OF_CURRENT",payload:c});var A=Object(n.useCallback)(function(){return M?l(M):null},[l,M]);return r.a.createElement("button",{className:"day day-".concat(a.format("d")," ").concat(D," ").concat(y," ").concat(O," ").concat(f," ").concat(b),onClick:k,onMouseOver:A},a.format("DD"))},te=a(17),ae=(a(44),function(){var e=Object(u.c)(D),t=Object(u.c)(k),a=Object(u.c)(g),c=Object(u.c)(A),o=Object(u.b)(),l=Object(n.useCallback)(function(e){return o({type:"DATES_CHANGE_YEAR",payload:e})},[o]),i=Object(n.useCallback)(function(){return o({type:"CHANGE_CONFIG"})},[o]);return r.a.createElement("header",null,r.a.createElement("span",{className:"header-controls"},r.a.createElement("span",{className:"settings"},r.a.createElement("span",null,"Trackmyholidays",a?", ":""),r.a.createElement("span",null,a),c?r.a.createElement("button",{onClick:i},r.a.createElement(te.c,{color:"white",size:"2em"})):null),c?r.a.createElement("span",{className:"year"},r.a.createElement("button",{label:"previous year",onClick:l.bind(null,-1)},r.a.createElement(te.a,{color:"white",size:"2em"})),r.a.createElement("span",{className:"currentYear"},t," - ",t+1),r.a.createElement("button",{label:"next year",onClick:l.bind(null,1)},r.a.createElement(te.b,{color:"white",size:"2em"}))):null,c?r.a.createElement("span",{className:"stats"},"Days left to plan: ",e):null))}),ne=(a(45),a(15)),re=function(e){var t=e.month;return r.a.createElement("div",{className:"month"},r.a.createElement("h3",null,ne(t[0]).format("MMMM YYYY")),r.a.createElement("span",{className:"dow"},"M"),r.a.createElement("span",{className:"dow"},"T"),r.a.createElement("span",{className:"dow"},"W"),r.a.createElement("span",{className:"dow"},"T"),r.a.createElement("span",{className:"dow"},"F"),r.a.createElement("span",{className:"dow"},"S"),r.a.createElement("span",{className:"dow"},"S"),t.map(function(e){return r.a.createElement(ee,{key:e,day:e})}))};a(46);var ce=function(){return r.a.createElement("div",{className:"App"},r.a.createElement(J,null),r.a.createElement($,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var oe,ue=a(9),le=a(25),ie=a(26),se=a.n(ie),de=a(48),fe={ww:{}},me=Object(de.a)(Object(V.a)({},"LOGIN",function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:fe,t=(arguments.length>1?arguments[1]:void 0).payload;return Object(i.a)({},e,{ww:t})}),fe),be={configIsOpen:!1},Oe=Object(de.a)(Object(V.a)({},"CHANGE_CONFIG",function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:be;(arguments.length>1?arguments[1]:void 0).payload;return Object(i.a)({},e,{configIsOpen:!e.configIsOpen})}),be),Ee={loading:!1,startMonth:9,currentYear:2019,daysPerYear:30,carriedOver:{2019:5},startDay:"",endOfCurrent:"",selected:null,holidays:[],bankHolidays:[{start:"20-12-25",name:"xmas"}],bankHolidayCountry:"uk"};if("number"===typeof Ee.carriedOver){var ye=Ee.carriedOver;Ee.carriedOver={},Ee[Ee.currentYear]=ye}var je=Object(de.a)((oe={},Object(V.a)(oe,"FETCH_DATES_FROM_SERVER",function(e,t){t.payload;return Object(i.a)({},e,{loading:!0})}),Object(V.a)(oe,"ADD_NEW_BANK_HOLIDAY",function(e){return Object(i.a)({},e,{bankHolidays:[].concat(Object(R.a)(e.bankHolidays),[{start:"".concat(String(e.currentYear).slice(2,4),"-").concat(e.startMonth+1,"-01"),name:"a"}])})}),Object(V.a)(oe,"UPDATE_BANK_HOLIDAYS",function(e,t){var a,n,r=t.payload,c=e.bankHolidays.filter((a=e.currentYear,n=e.startMonth,function(e){var t=d(e.start,"YY-MM-DD"),r=d("".concat(a,"-").concat(n+1,"-01"),"YYYY-MM-DD"),c=d("".concat(a+1,"-").concat(n+1,"-01"),"YYYY-MM-DD");return!(r<=t&&t<c)&&e}));return Object(i.a)({},e,{bankHolidays:[].concat(Object(R.a)(c),Object(R.a)(r))})}),Object(V.a)(oe,"LOAD_DATES_FROM_SERVER",function(e,t){var a=t.payload.text;return Object(i.a)({},e,{startMonth:a.startMonth,currentYear:a.currentYear,daysPerYear:a.daysPerYear,carriedOver:a.carriedOver,holidays:a.holidays,bankHolidays:a.bankHolidays,loading:!1})}),Object(V.a)(oe,"DATES_SELECT_DAY",function(){arguments.length>0&&void 0!==arguments[0]&&arguments[0];return(arguments.length>1?arguments[1]:void 0).payload}),Object(V.a)(oe,"DATES_SELECT_END_OF_CURRENT",function(e,t){var a=t.payload;return Object(i.a)({},e,{endOfCurrent:a})}),Object(V.a)(oe,"DATES_UPDATE_CARRIED_OVER",function(e,t){var a=t.payload;return Object(i.a)({},e,{carriedOver:Object(i.a)({},e.carriedOver,Object(V.a)({},e.currentYear,parseInt(a)))})}),Object(V.a)(oe,"DATES_SELECT_START_MONTH",function(e,t){var a=t.payload;return Object(i.a)({},e,{startMonth:a})}),Object(V.a)(oe,"DATES_SELECT_HOLIDAY",function(e,t){var a=t.payload;return Object(i.a)({},e,{selected:a})}),Object(V.a)(oe,"DATES_CHANGE_YEAR",function(e,t){var a=t.payload;return Object(i.a)({},e,{currentYear:e.currentYear+a,startDay:""})}),Object(V.a)(oe,"DATES_DESELECT",function(e,t){var a=t.payload;return Object(i.a)({},e,{holidays:e.holidays.filter(function(e){return e.start!==a.hol.start})})}),oe),Ee),pe=Object(ue.c)({auth:me,config:Oe,dates:je});a.d(t,"storeInstance",function(){return he});var he=Object(ue.d)(pe,Object(ue.a)(le.a,se.a));o.a.render(r.a.createElement(u.a,{store:he},r.a.createElement(ce,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[27,1,2]]]);
//# sourceMappingURL=main.cb3f1497.chunk.js.map