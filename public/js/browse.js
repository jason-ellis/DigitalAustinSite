function expandAll(s){s.html("Collapse all").attr("data-state","expanded"),$("#browse-results").find(".collapse").each(function(){$(this).collapse("show"),$("#browse-results").find(".glyphicon-plus").addClass("glyphicon-minus").removeClass("glyphicon-plus")})}function collapseAll(s){s.html("Expand all").attr("data-state","collapsed"),$("#browse-results").find(".collapse").each(function(){$(this).collapse("hide"),$("#browse-results").find(".glyphicon-minus").addClass("glyphicon-plus").removeClass("glyphicon-minus")})}function updatePage(s,t,a){var l=t.slice(a[0],a[1]);collapseAll($("#collapse-expand-all")),s.empty(),s.append(l)}$("#collapse-expand-all").on("click",function(s){"collapsed"==$(this).attr("data-state")?expandAll($(this)):"expanded"==$(this).attr("data-state")&&collapseAll($(this))}),$(document).on("click",".browse-list__category-header > a",function(){$(this).find(".glyphicon").hasClass("glyphicon-plus")?$(this).find(".glyphicon").addClass("glyphicon-minus").removeClass("glyphicon-plus"):$(this).find(".glyphicon").hasClass("glyphicon-minus")&&$(this).find(".glyphicon").addClass("glyphicon-plus").removeClass("glyphicon-minus")});var jumpMap={},count=0,prev,curr;$(".browse-list__category").each(function(){curr=$(this).attr("data-sort-letter"),count+=1,curr!=prev&&(jumpMap[curr]=count),prev=curr}),$(".jumplist__item").each(function(){$(this).attr("data-sort-letter")in jumpMap||$(this).css("display","none")}).on("click",function(){return paging.setPage(Math.ceil(jumpMap[$(this).attr("data-sort-letter")]/$(".browse-list__category").length)),$(".jumplist").find(".active").removeClass("active"),$(this).addClass("active"),!1}),$(".jumplist").removeClass("hidden");var listId=$("#browse-results"),categorizedResults=listId.find("> li");pagingOpts.onSelect=function(s){updatePage(listId,categorizedResults,this.slice),showPager(this.pages)};var paging=$(".pagination").paging(totalHeadings,pagingOpts);paging.setOptions({onSelect:function(s){updatePage(listId,categorizedResults,this.slice),showPager(this.pages)}});