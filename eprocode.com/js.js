var ETProDone=ETProDone||{},ETProCurrentURL=document.URL.replace(location.hash,"");
function ETProtrackercode(){var a=0;"undefined"!==typeof stopeXTReMeTracking&&1===stopeXTReMeTracking&&(a=1);if(!a){a=document;var f=a.getElementsByTagName("script");ETProPageID=ETProSection=ETProServer=ETProLogin=null;for(var d=0;d<f.length;d++)if(f[d].src&&(-1<f[d].src.indexOf("eprocode.com/js.js")||-1<f[d].id.indexOf("eX-exipapi-"))){var b=f[d].id.split("-");var e=b[1];var c=b[2];b=b[3];if(e&&!ETProDone[e]){ETProDone[e]=1;ETProLogin=e;"2"===c?ETProServer=2:"3"===c?ETProServer=2:"4"===c&&(ETProServer=
3);ETProPageID=b;ETProSection=c;c=escape(a.URL);b="";b=ETProPageID?"&auto=y&pid="+escape(ETProPageID):"&url="+c;var g=a.referrer;try{g=top.document.referrer}catch(h){}c="login="+e+b+"&d="+screen.width+"x"+screen.height+"&jv="+navigator.javaEnabled()+"&c="+screen.colorDepth+"&l="+escape(g)+"&cb="+(new Date).getTime();(new Image).src="//eprocode.com/n"+ETProSection+".g?"+c;setTimeout(function(){for(var a=document.getElementsByTagName("a"),b=0;b<a.length;b++)a[b].href.match(/\.pdf|\.zip$/i)&&
a[b].addEventListener&&a[b].addEventListener("click",function(){var a="login="+e+"&url="+escape(this.href)+"&d="+screen.width+"x"+screen.height+"&jv="+navigator.javaEnabled()+"&c="+screen.colorDepth+"&l="+escape(g);(new Image).src="//eprocode.com/n"+ETProSection+".g?"+a},!1)},1500)}}}}ETProtrackercode();
function ETCheckLocChange(){"undefined"===typeof stopeXTReMeLocHistoryCheck&&setTimeout(function(){var a=document.URL.replace(location.hash,"");"undefined"!==ETProCurrentURL&&a!==ETProCurrentURL&&(ETProCurrentURL=a,ETProDone={},ETProtrackercode());ETCheckLocChange()},700)}ETCheckLocChange();function ETProTrack(a){}window.ETProTrack=ETProTrack;
