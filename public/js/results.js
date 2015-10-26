function queryChanged(){return basicData=null,chartData=null,cityData=null,resultsListItems=null,requestData(),$(".search-results").removeClass("hidden"),!1}function stringifyUrlQuery(){var t="?query=";return t+=encodeURIComponent(document.getElementById("query").value),encodeURIComponent(document.getElementById("fromYear").value)&&(t+="&fromYear=",t+=encodeURIComponent(document.getElementById("fromYear").value)),encodeURIComponent(document.getElementById("toYear").value)&&(t+="&toYear=",t+=encodeURIComponent(document.getElementById("toYear").value)),encodeURIComponent(document.getElementById("fromPersonId").value)&&(t+="&fromPersonId=",t+=encodeURIComponent(document.getElementById("fromPersonId").value)),encodeURIComponent(document.getElementById("toPersonId").value)&&(t+="&toPersonId=",t+=encodeURIComponent(document.getElementById("toPersonId").value)),encodeURIComponent(document.getElementById("fromPlaceId").value)&&(t+="&fromPlaceId=",t+=encodeURIComponent(document.getElementById("fromPlaceId").value)),encodeURIComponent(document.getElementById("toPlaceId").value)&&(t+="&toPlaceId=",t+=encodeURIComponent(document.getElementById("toPlaceId").value)),encodeURIComponent(document.getElementById("sentiment").value)&&(t+="&sentiment=",t+=encodeURIComponent(document.getElementById("sentiment").value)),t+="&sort=",t+=encodeURIComponent(sortKey)}function requestData(){var t=stringifyUrlQuery(),e="";if(console.log("RequestData called"),history.pushState&&window.history.pushState({path:t},"",t),ga("send","event","search","submit",t),ga("jasonTracker.send","event","search","submit",t),document.getElementById("query").value&&(e="text: <b>"+document.getElementById("query").value+"</b>"),document.getElementById("fromYear").value&&(e+=" starting: <b>"+document.getElementById("fromYear").value+"</b>"),document.getElementById("toYear").value&&(e+=" ending: <b>"+document.getElementById("toYear").value+"</b>"),document.getElementById("fromPersonId").value){var a=document.getElementById("fromPersonId").value;e+=" sender: <b>"+personIdToNames[a]+"</b>"}if(document.getElementById("toPersonId").value){var a=document.getElementById("toPersonId").value;e+=" recipient: <b>"+personIdToNames[a]+"</b>"}if(document.getElementById("fromPlaceId").value){var r=document.getElementById("fromPlaceId").value;e+=" sent from: <b>"+placeIdToNames[r]+"</b>"}if(document.getElementById("toPlaceId").value){var r=document.getElementById("toPlaceId").value;e+=" sent to: <b>"+placeIdToNames[r]+"</b>"}document.getElementById("sentiment").value&&(""==e?$("#resultsFor").hide():$("#resultsFor").show(),e+=" with <b>"+document.getElementById("sentiment").value+"</b> sentiment scores"),""==e&&(e="all results."),document.getElementById("humanQuery").innerHTML=e,$.getJSON("search_results.php"+t,function(t){$(document).trigger("basicDataLoaded",[t])}),$.getJSON("data/cloud.php"+t,function(t){$(document).trigger("chartDataLoaded",[t])}),$.getJSON("data/cities.php"+t,function(t){$(document).trigger("cityDataLoaded",[t])}),$.getJSON("data/network.php"+t,function(t){$(document).trigger("networkDataLoaded",[t])})}function updateDocuments(){var t=$("search-results-list"),e=$(".documents-tab .searching-progress"),a=$(".documents-tab__description");$sorter=$(".documents-tab .search-results__sort"),$resultsSummary=$(".search-results__results-summary"),resultsCount=basicData.json.length,t.hide(),e.show(),$sorter.hide(),$("#resultsCount").text(addCommas(resultsCount)),$("#totalDocsCount").text(addCommas(totalDocsCount)),$resultsSummary.slideDown(),1===resultsCount&&(document.getElementById("resultsPlural").innerHTML="result"),$resultsSummary.addClass("search-results__results-summary--changed").delay(2e3).queue(function(){$(this).removeClass("search-results__results-summary--changed").dequeue()}),$paging.setNumber(resultsCount).setPage(),$("#sort_"+sortKey).prop("checked",!0),e.hide(),t.show(),$sorter.show(),a.show(),$(function(){$(".documents-tab").find(".fa-info-circle, .fa-question-circle").tooltip({container:"body",placement:"auto right",html:!0,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'})})}function updateSentiment(){for(var t,e=Number.POSITIVE_INFINITY,a=Number.NEGATIVE_INFINITY,r=basicData.json.length-1;r>=0;r--)t=parseFloat(basicData.json[r].sentimentScore),e>t&&(e=t),t>a&&(a=t);$(".search-results-list__item-sentiment").each(function(){$(this).find(".search-result-list__item-sentiment-score--min").text(e),$(this).find(".search-result-list__item-sentiment-score--max").text(a);var t=$(this),r=t.attr("data-sentiment");negativeThreshold>r?t.find(".search-result-list__item-sentiment-score").addClass("sentiment-negative").text("Negative"):r>positiveThreshold?t.find(".search-result-list__item-sentiment-score").addClass("sentiment-positive").text("Positive"):t.find(".search-result-list__item-sentiment-score").addClass("sentiment-neutral").text("Neutral")})}function updatePage(t){var e=$("#documentsList"),a=basicData.html.slice(t[0],t[1]);e.empty().append(a).first().attr("start",t[0]+1)}function setupMap(){$(".geographic-chart-tab .searching-progress").show();var t={center:new google.maps.LatLng(34,-94),zoom:4,mapTypeId:google.maps.MapTypeId.TERRAIN};map=new google.maps.Map(document.getElementById("map"),t),null!=map.getProjection()?redrawAllCurves():google.maps.event.addListener(map,"projection_changed",redrawAllCurves),redrawMarkers(),google.maps.event.addListener(map,"zoom_changed",redrawMarkers),$(".geographic-chart-tab .searching-progress").hide(),$(".geographic-chart-tab__description").show()}function cityClicked(t){for(var e=0;e<infoWindows.length;e++)infoWindows[e].close();infoWindows[t].open(map,markers[t])}function searchCity(t,e){var a=stringifyUrlQuery();"from"===e?a.includes("&fromPlaceId")?a=a.replace(/fromPlaceId=[0-9]*/,"fromPlaceId="+t):a+="&fromPlaceId="+t:"to"===e&&(a.includes("&toPlaceId")?a=a.replace(/toPlaceId=[0-9]*/,"toPlaceId="+t):a+="&toPlaceId="+t),window.location="search"+a}function rgbToHtml(t,e,a){for(var r=t+256*e+65536*a,n=r.toString(16);n.length<6;)n="0"+n;return"#"+n}function drawCurve(t,e,a,r){var n=t.getProjection(),o=n.fromLatLngToPoint(e),s=n.fromLatLngToPoint(a),i=s.x-o.x,l=s.y-o.y,c=Math.sqrt(Math.pow(i,2)+Math.pow(l,2));c*=r;for(var d,u,m=Math.atan2(l,i)+Math.PI/2,p=new google.maps.Point((o.x+s.x)/2,(o.y+s.y)/2),h=new google.maps.Point(p.x+c*Math.cos(m),p.y+c*Math.sin(m)),g=10,f=!0,y=0;g>=y;y+=1){var v=y/g,b=Math.pow(1-v,2)*o.x+2*(1-v)*v*h.x+Math.pow(v,2)*s.x,I=Math.pow(1-v,2)*o.y+2*(1-v)*v*h.y+Math.pow(v,2)*s.y;if(u=n.fromPointToLatLng(new google.maps.Point(b,I)),!f){var w=Math.floor(255*v);color=rgbToHtml(w,0,255-w),coords=[d,u],line=new google.maps.Polyline({path:coords,strokeColor:color,strokeOpacity:.1+.4*Math.abs(v-.5),strokeWeight:5}),line.setMap(t),lines.push(line)}d=u,f=!1}}function redrawAllCurves(){for(var t=0;t<lines.length;t++)lines[t].setMap(null);lines=[];for(var t=0;t<basicData.json.length;t++)if(doc=basicData.json[t],null!=doc.srcLat&&null!=doc.dstLat){var e=.1+.2*Math.random();drawCurve(map,new google.maps.LatLng(doc.srcLat,doc.srcLng),new google.maps.LatLng(doc.dstLat,doc.dstLng),e)}}function redrawMarkers(){if(console.log("RedrawMarkers called."),null==cityData)return console.log("Aborting."),void console.log(cityData);for(var t=0;t<markers.length;t++)markers[t].setMap(null);markers=[],infoWindows=[];var e;for(e=map.getZoom()>7?cityData.length:Math.min(cityData.length,Math.ceil(Math.pow(map.getZoom(),1.2))),t=0;e>t;t++){var a=cityData[t],r=new google.maps.Marker({position:new google.maps.LatLng(a.lat,a.lng),map:map,title:a.name}),n=function(){cityClicked(arguments.callee.markerIndex)};n.markerIndex=t,google.maps.event.addListener(r,"click",n),markers.push(r);var o="<span class='geography__city-name'>"+a.name+"</span><br /><b>"+(parseInt(a.incoming)+parseInt(a.outgoing))+" Letters</b><br /><a class='geography__city-link' id='to-city-"+a.id+"' onClick='searchCity("+a.id+", &apos;to&apos;)'>"+a.incoming+" Incoming Letters</a><br /><a class='geography__city-link' id='from-city-"+a.id+"' onClick='searchCity("+a.id+", &apos;from&apos;)'>"+a.outgoing+" Outgoing Letters</a>",s=new google.maps.InfoWindow({content:o});infoWindows.push(s)}mapNeedsRerender=!1}function updateWordCharts(){$(".word-chart-tab .searching-progress").show(),$(".word-chart").removeClass("hidden"),$(".word-chart__outer-svg").remove(),wordChart(chartData[2],"#personChart"),wordChart(chartData[1],"#placeChart"),wordChart(chartData[0],"#wordChart"),$(".word-chart-tab .searching-progress").hide(),$(".word-chart-tab__description").show(),chartsNeedRerender=!1}function wordChart(t,e){var a=t,r={top:0,right:0,bottom:0,left:0},n=d3.select(e),o=parseInt(n.style("width"))-parseInt(n.style("padding-left"))-parseInt(n.style("padding-right")),o=o-r.left-r.right,s=20,i=5,l=150,c=20,d=(s+i)*a.length-r.top-r.bottom,u=d3.scale.linear().domain([0,d3.max(a,function(t){return parseInt(t.weight,10)})]),m=(d3.scale.ordinal().domain(a.map(function(t){return t.text})).rangeBands([d,0],.1),d3.select(e).append("svg").attr("class","word-chart__outer-svg").attr("width",o+r.left+r.right).attr("height",d+r.top+r.bottom).append("g").attr("class","word-chart__inner-g").attr("width",o).attr("transform","translate("+[r.left,r.top]+")")),p=m.append("g").attr("class","word-chart__label-container").attr("width",l);p.selectAll("text").data(a).enter().append("a").attr("class","word-chart__label-link").attr("xlink:href",function(t){return t.link}).attr("data-toggle",function(t){return t.text.length>c?"tooltip":void 0}).attr("data-placement",function(t){return t.text.length>c?"right":void 0}).attr("title",function(t){return t.text}).attr("data-ga-event",function(t){return t.text}).append("text").attr("class","word-chart__label-text").attr("transform",function(t,e){return"translate(0,"+e*(s+i)+")"}).attr("dy","1em").text(function(t){return t.text.length<=c?t.text:t.text.slice(0,c)+"..."}),l=d3.select(e).select(".word-chart__label-container").node().getBBox().width,u.range([25,o-l]);var h=m.append("g").attr("class","word-chart__bar-container"),g=h.selectAll("g").data(a).enter().append("g").attr("transform",function(t,e){return"translate("+l+","+e*(s+i)+")"});d3.select(m.node().parentNode).style("height",d+r.top+r.bottom+"px"),g.append("rect").attr("class","word-chart__bar").attr("width",function(t){return u(t.weight)}).attr("height",s-1),g.append("text").attr("class","word-chart__item-weight").attr("y",s/2).attr("dy",".35em").text(function(t){return addCommas(t.weight)}).attr("x",function(t){return u(t.weight)-this.getBBox().width-2}),$(function(){$(".word-chart-tab").find('[data-toggle="tooltip"]').tooltip({container:"body",html:!0,template:'<div class="tooltip timechart__tooltip" role="tooltip"><div class="tooltip-arrow timechart__tooltip-arrow"></div><div class="tooltip-inner timechart__tooltip-inner"></div></div>'})})}function timelineData(t){if(null!=basicData){for(var e={},a={},r={},n={},o=0;o<basicData.json.length;o++){var s=basicData.json[o].date.substring(0,4);void 0===e[s]?e[s]=1:e[s]++,void 0===a[s]&&(a[s]=0,r[s]=0,n[s]=0),basicData.json[o].sentimentScore<negativeThreshold?n[s]++:basicData.json[o].sentimentScore>positiveThreshold?a[s]++:r[s]++}var i=2e3,l=1e3;for(var c in totalDocDistribution)if(parseInt(totalDocDistribution[c])>=15){var d=parseInt(c);i>d&&(i=d),parseInt(c)>l&&(l=d)}for(var u=[["Year","Negative","Neutral","Positive"]],o=i;l>=o;o++){var m=o.toString(),p=0;void 0!==e[m]&&(p=e[m]);var h=0;t?h=basicData.json.length:void 0!==totalDocDistribution[m]&&(h=parseInt(totalDocDistribution[m])),u.push([m,Math.floor(n[m]/h*1e3)/10,Math.floor(r[m]/h*1e3)/10,Math.floor(a[m]/h*1e3)/10])}}return u}function updateTimeChart(t){$(".time-chart__outer-svg").attr("class","time-chart__outer-svg--hidden"),$(".time-chart-tab .searching-progress").show();var e=timelineData(t),a=e.shift(),r=e.map(function(t){var e={};return e[a[0]]=t[0],e[a[1]]=t[1],e[a[2]]=t[2],e[a[3]]=t[3],e}),n=$(window).width()<768,o={top:60,right:100,bottom:100,left:50},s=d3.select(".time-chart"),i=parseInt(s.style("width"))-parseInt(s.style("padding-left"))-parseInt(s.style("padding-right")),l=n?750:500;if(n&&(o.bottom=125,o.right=50),i=i-o.left-o.right,l=l-o.top-o.bottom,n)var c=d3.scale.linear().range([0,i]),d=d3.scale.ordinal().rangeRoundBands([0,l],.1);else var c=d3.scale.ordinal().rangeRoundBands([0,i],.1),d=d3.scale.linear().range([l,0]);var u=d3.scale.ordinal().range(["#d9534f","#727272","#5cb85c"]);if(n)var m=d3.svg.axis().scale(c).orient("bottom").outerTickSize(0).innerTickSize(-l+5).tickValues([0,25,50,75,100]),p=d3.svg.axis().scale(d).outerTickSize(0).orient("left");else var m=d3.svg.axis().scale(c).outerTickSize(0).orient("bottom"),p=d3.svg.axis().scale(d).orient("left").outerTickSize(0).innerTickSize(-i+5).ticks(5);var h=d3.select(".time-chart").append("svg").attr("class","time-chart__outer-svg").attr("width",i+o.left+o.right).attr("height",l+o.top+o.bottom).append("g").attr("class","time-chart__inner-g").attr("transform","translate("+o.left+","+o.top+")");n?(c.domain([0,d3.max(r,function(t){return t.Positive+t.Neutral+t.Negative})]),d.domain(r.map(function(t){return t.Year}))):(c.domain(r.map(function(t){return t.Year})),d.domain([0,d3.max(r,function(t){return t.Positive+t.Neutral+t.Negative})])),u.domain(a.filter(function(t){return"Year"!==t})),r.forEach(function(t){var e=0;t.sentiment=u.domain().map(function(a){return{name:a,year:t.Year,xy0:e,xy1:e+=+t[a]}}),t.total=t.sentiment[t.sentiment.length-1].xy1}),n?(h.append("g").attr("class","x axis").attr("transform","translate(0,"+l+")").call(m),h.append("text").attr("class","x label").attr("text-anchor","middle").attr("x",i/2).attr("y",l+o.bottom-90).attr("dy",".71em").text(function(){return t?"% out of search results":"% out of all documents"}),h.append("g").attr("class","y axis").call(p).selectAll("text").filter(function(t){return"string"==typeof t}).style("cursor","pointer").on("click",function(t){document.location.href="search?query=&fromYear="+t+"&toYear="+t})):(h.append("g").attr("class","x axis").attr("transform","translate(0,"+l+")").call(m).selectAll("text").filter(function(t){return"string"==typeof t}).style("cursor","pointer").on("click",function(t){document.location.href="search?query=&fromYear="+t+"&toYear="+t}).style("text-anchor","end").attr("dx","-.8em").attr("dy",".15em").attr("transform","rotate(-65)").attr("data-toggle","tooltip").attr("title",function(t){return t+"</br>"+totalDocDistribution[t]+" letters"}),h.append("text").attr("class","x label").attr("text-anchor","end").attr("x",i/2).attr("y",l+o.bottom-30).attr("dy",".71em").text("Year"),h.append("g").attr("class","y axis").call(p),h.append("text").attr("class","y label").attr("transform","rotate(-90)").attr("y","-50").attr("x",function(){return-l/2}).attr("dy",".71em").style("text-anchor","middle").text(function(){return t?"% out of search results":"% out of all documents"})),h.append("text").attr("class","time-chart__domain-title").attr("text-anchor","middle").attr("x",i/2).attr("y",-50).attr("dy",".71em").text(function(){return t?"Viewing search results distribution over time":"Viewing percentage out of all documents"}),h.append("text").attr("class","time-chart__domain-toggle").attr("text-anchor","middle").attr("x",i/2).attr("y",-30).attr("dy",".71em").text(function(){return t?"(See percentage out of all documents)":"(See search results distribution over time)"}).style("cursor","pointer").on("click",function(){return updateTimeChart(t?!1:!0)});var g=h.selectAll(".year").data(r).enter().append("g").attr("class",function(t){return"time-chart__year "+t.Year}).attr("transform",function(t){return n?"translate(0,"+d(t.Year)+")":"translate("+c(t.Year)+",0)"});g.selectAll("rect").data(function(t){return t.sentiment}).enter().append("a").attr("class",function(t){return"time-chart__bar--"+t.name.toLowerCase()}).attr("id",function(t){return t.name.toLowerCase()+"-"+t.year}).attr("xlink:href",function(t){return"search?query=&fromYear="+t.year+"&toYear="+t.year+"&sentiment="+t.name.toLowerCase()}).attr("data-toggle","tooltip").attr("title",function(t){var e=parseFloat(t.xy1-t.xy0).toFixed(1);return t.year+"</br>"+t.name+": "+(e%1===0?parseInt(e):e)}).append("rect").attr("class",function(t){return"time-chart__bar--"+t.name.toLowerCase()}).attr("width",function(t){return n?isNaN(t.xy1)?null:c(t.xy1)-c(t.xy0):c.rangeBand()}).attr("y",function(t){return n?null:isNaN(t.xy1)?null:d(t.xy1)}).attr("height",function(t){return n?d.rangeBand():isNaN(t.xy1)?null:d(t.xy0)-d(t.xy1)}).attr("x",function(t){return n?isNaN(t.xy0)?null:c(t.xy0):null}).style("fill",function(t){return u(t.name)});var f=h.selectAll(".legend").data(u.domain().slice().reverse()).enter().append("a").attr("xlink:href",function(t){return"search?query=&sentiment="+t.toLowerCase()}).append("g").attr("class","legend").attr("transform",function(t,e){return n?"translate(-50,"+(l+60+20*e)+")":"translate(0,"+20*e+")"});f.append("rect").attr("x",i+2).attr("width",18).attr("height",18).style("fill",u),f.append("text").attr("x",i+22).attr("y",9).attr("dy",".35em").style("text-anchor","start").text(function(t){return t}),timeChartNeedsUpdate=!1,$(".time-chart-tab .searching-progress").hide(),$(".time-chart-tab__description").show(),$(".time-chart__outer-svg--hidden").remove(),$(function(){$("a[class^=time-chart__bar]").tooltip({container:"body",placement:"auto right",html:!0,template:'<div class="tooltip timechart__tooltip" role="tooltip"><div class="tooltip-arrow timechart__tooltip-arrow"></div><div class="tooltip-inner timechart__tooltip-inner"></div></div>'})}),$(function(){$(".x.axis").find("text").tooltip({container:"body",placement:"auto top",html:!0,template:'<div class="tooltip timechart__tooltip" role="tooltip"><div class="tooltip-arrow timechart__tooltip-arrow"></div><div class="tooltip-inner timechart__tooltip-inner"></div></div>'})})}function addCommas(t){t+="",x=t.split("."),x1=x[0],x2=x.length>1?"."+x[1]:"";for(var e=/(\d+)(\d{3})/;e.test(x1);)x1=x1.replace(e,"$1,$2");return x1+x2}var basicData=null,chartData=null,cityData=null,sortKey="date",positiveThreshold=2,negativeThreshold=-2,resultsListItems=null,$paging=$(".pagination").paging(0,pagingOpts);$paging.setOptions({onSelect:function(t){updatePage(this.slice),updateSentiment(),showPager(this.pages)}}),$(document).on("basicDataLoaded",function(t,e){null!=e&&e!=basicData?(basicData=e,updateDocuments()):alert("?")}),$("input:radio[name=sort]").on("click",function(t){sortKey=$("input:radio[name=sort]:checked").val(),queryChanged()});var mapIsSetup=!1,map,markers=[],lines=[],infoWindows=[];google.load("maps","3",{other_params:"sensor=false"}),$(document).on("cityDataLoaded",function(t,e){null!=e&&e!=cityData&&(cityData=e,mapNeedRerender=!0,"none"!=$("#tab-geographic")[0].style.display&&(redrawAllCurves(),redrawMarkers()))});var chartsNeedRerender=!1;$(document).on("chartDataLoaded",function(t,e){null!=e&&e!=chartData&&(chartData=e,chartsNeedRerender=!0,"none"!=$("#tab-charts").css("display")&&updateWordCharts())});var timeChart,timeChartNeedsUpdate=!0;$(document).on("basicDataLoaded",function(t,e){null!=e&&(timeChartNeedsUpdate=!0,"none"!=$("#tab-timeline").css("display")&&updateTimeChart("results"))}),$('a[data-toggle="tab"]').on("shown.bs.tab",function(t){switch(newTabId=$(t.target).attr("href"),newTabId){case"#tab-content":break;case"#tab-timeline":timeChartNeedsUpdate&&updateTimeChart("results");break;case"#tab-geographic":mapIsSetup!==!0?setupMap():mapNeedsRerender&&(redrawAllCurves(),redrawMarkers());break;case"#tab-charts":chartsNeedRerender&&updateWordCharts()}}),$("#tab-timeline").on("click",".time-chart-tab__toggle-domain",function(t){timeChartNeedsUpdate=!0,$(this).hasClass("time-chart-tab__toggle-domain--results")?($(this).addClass("time-chart-tab__toggle-domain--all").removeClass("time-chart-tab__toggle-domain--results").html("View percentage out of all documents"),updateTimeChart(!0)):$(this).hasClass("time-chart-tab__toggle-domain--all")&&($(this).addClass("time-chart-tab__toggle-domain--results").removeClass("time-chart-tab__toggle-domain--all").html("View percentage out of search results"),updateTimeChart(!1))});