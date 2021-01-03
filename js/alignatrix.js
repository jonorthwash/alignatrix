$(document).ready(function() {
	updateCurrentSentence();
});

$(window).on('resize', function(){
	updateCurrentSentence();
});

$('html').keyup(function(e){
	if(e.keyCode == 46) {
		//$(".highlightedline").remove();
		$(".highlightedline").each(function() {
			//console.log($(this), $(this).data("pair"));
			removeFromPairs($("#currentSent").val(), $(this).data("pair"));
		});
		updateCurrentSentence();
	}
});

$(document).on("click", ".line",
	function(event) {
		var classList = $(this).attr("class").split(/\s+/);
		if ($.inArray("highlightedline", classList) !== -1) {
			//console.log("highlightedline");
			$(this).removeClass("highlightedline");
		} else {
			$(this).addClass("highlightedline");
		}
	}
);

// update current sentence on textarea changes
$(document).on("input", "textarea",
	function(event) {
		// $(this)
		updateCurrentSentence();
	}
);
$(document).on("input", "#currentSent",
	function(event) {
		checkCurrentVal();
		updateCurrentSentence();
	}
);
$(document).on("click", "#prevSent",
	function(event) {
		var prevVal = Number($("#currentSent").val());
		$("#currentSent").val(prevVal-1);
		checkCurrentVal();
		updateCurrentSentence();
	}
);
$(document).on("click", "#nextSent",
	function(event) {
		var prevVal = Number($("#currentSent").val());
		$("#currentSent").val(prevVal+1);
		checkCurrentVal();
		updateCurrentSentence();
	}
);

$(document).on("click", "#tl-row div, #sl-row div",
	function(event) {
		var selected = $(this).parent().data("selected");
		var curIdx = $(this).index();
		var tlORsl = ($(this).parent().attr("id").includes("tl") ? "tl" : "sl");
		//console.log(selected);
		// tests for whether a box can be clicked
		if ((typeof selected == 'undefined') || selected < 0 || selected == curIdx) {
			// if it's already selected, unselect it
			if ($(this).data("selected")) {
				$(this).data("selected", false);
				$(this).parent().data("selected", -1);
				$(this).removeClass("highlighted");
				showConnectedNodes(curIdx, tlORsl, false);
			// if it's not selected, select it
			} else {
				//console.log(curIdx);
				$(this).data("selected", true);
				$(this).parent().data("selected", curIdx);
				$(this).addClass("highlighted");
				showConnectedNodes(curIdx, tlORsl, true);
			}
		}
		//console.log("end", $(this).parent().data("selected"));
		updateConnections();
	}
);

function showConnectedNodes(idx, tlORsl, highlightORunhighlight) {
	//console.log(idx, tlORsl, highlightORunhighlight);
	if (tlORsl=='sl') {
		getConnectionsSl(idx).forEach(function(tlIdx, index){
			if (highlightORunhighlight)
				$($("#tl-row").children()[tlIdx]).addClass("halfhighlighted");
			else
				$($("#tl-row").children()[tlIdx]).removeClass("halfhighlighted");
		});
	} else {
		getConnectionsTl(idx).forEach(function(slIdx, index){
			if (highlightORunhighlight)
				$($("#sl-row").children()[slIdx]).addClass("halfhighlighted");
			else
				$($("#sl-row").children()[slIdx]).removeClass("halfhighlighted");
		});
	}
	//console.log(connections);
}

function getConnectionsSl(idx) {
	var matched = Array();
	$("#alignmentData").data("pairs").forEach(function(pair, index) {
		var slIdx = pair.replace(/-.*/g, "");
		var tlIdx = pair.replace(/.*-/g, "");
		if (slIdx==idx)
			matched.push(tlIdx);
	});
	return matched;
}

function getConnectionsTl(idx) {
	var matched = Array();
	$("#alignmentData").data("pairs").forEach(function(pair, index) {
		var slIdx = pair.replace(/-.*/g, "");
		var tlIdx = pair.replace(/.*-/g, "");
		if (tlIdx==idx)
			matched.push(slIdx);
	});
	return matched;
}

function hoverHighlight(node) {
	var curIdx = node.index();
	var tlORsl = (node.parent().attr("id").includes("tl") ? "tl" : "sl");
	showConnectedNodes(curIdx, tlORsl, true);
}

function hoverUnhighlight(node) {
	var curIdx = node.index();
	var tlORsl = (node.parent().attr("id").includes("tl") ? "tl" : "sl");
	showConnectedNodes(curIdx, tlORsl, false);
}

function updateConnections() {
	var slSelected = $("#sl-row").data("selected");
	var tlSelected = $("#tl-row").data("selected");
	if (slSelected >= 0 && tlSelected >= 0) {
		//console.log(slSelected, tlSelected);
		alignmentPairs = $("#alignmentData").data("pairs");
		alignmentPair = slSelected+"-"+tlSelected;
		//console.log(alignmentPairs, alignmentPair, $.inArray(alignmentPair, alignmentPairs));
		// this is already linked, don't link again
		if ($.inArray(alignmentPair, alignmentPairs)<0) {
			// new pair
			addToPairs($("#currentSent").val(), alignmentPair);
			$("#sl-row").data("selected", -1);
			$("#tl-row").data("selected", -1);
			updateCurrentSentence();
		}
	}
}

function removeFromPairs(lineNum, alignmentPair) {
	var allLines = "";
	var lines = $("#alignmentData").val().split('\n')
	var thisLinePairs = lines[lineNum].split(' ');
	//console.log(thisLinePairs);
	//from https://stackoverflow.com/a/59250151/5181692
	//thisLinePairs.splice($.inArray(alignmentPair, thisLinePairs), $.inArray(alignmentPair, thisLinePairs));
	thisLinePairs = thisLinePairs.filter(function(elem){return elem != alignmentPair});
	//console.log(thisLinePairs, alignmentPair);
	//console.log(thisLinePairs);
	var newLine = thisLinePairs.join(" ");
	lines.forEach(function(line, index) {
		if (lineNum == index) {
			//console.log(line, '\n', newLine);
			allLines += newLine;
		} else {
			allLines += line;
		}
		if (index<lines.length-1)
			allLines += '\n';
	});
	$("#alignmentData").val(allLines);
}

function addToPairs(lineNum, alignmentPair) {
	var allLines = "";
	var lines = $("#alignmentData").val().split('\n')
	var thisLinePairs = lines[lineNum].split(' ');
	//console.log(thisLinePairs);
	thisLinePairs.push(alignmentPair);
	//console.log(thisLinePairs);
	var newLine = thisLinePairs.join(" ");
	lines.forEach(function(line, index) {
		if (lineNum == index) {
			//console.log(line, '\n', newLine);
			allLines += newLine;
		} else {
			allLines += line;
		}
		if (index<lines.length-1)
			allLines += '\n';
	});
	$("#alignmentData").val(allLines);
}

function checkCurrentVal() {
	var newVal = Number($("#currentSent").val());
	if (newVal<0)
		newVal = 0;
	if (newVal>maxNumLines()-1)
		newVal = maxNumLines()-1;
	//console.log(newVal);
	$("#currentSent").val(newVal);
}

function maxNumLines() {
	return Math.min($("#slSents").data("lines"), $("#tlSents").data("lines"), $("#alignmentData").data("lines"));
}

function updateCurrentSentence() {
	var curSent = $("#currentSent").val();
	var slSents = $("#slSents").val().split('\n');
	var tlSents = $("#tlSents").val().split('\n');
	var alignmentData = $("#alignmentData").val().split('\n');

	var slThisSent = apStreamTokenise(slSents[curSent]);
	var tlThisSent = apStreamTokenise(tlSents[curSent]);
	var alignmentThisSent = alignmentData[curSent].split(' ');

	$("#alignmentData").data("pairs", alignmentThisSent);

	$("#slSents").data("lines", slSents.length);
	$("#tlSents").data("lines", tlSents.length);
	$("#alignmentData").data("lines", alignmentData.length);

	$("#sl-row").empty();
	slThisSent.forEach(function(item, index) {
		var item = makeTags(item);
		$("<div>"+item+"</div>").addClass("token").hover(function(){hoverHighlight($(this))},function(){hoverUnhighlight($(this))}).appendTo("#sl-row");
	});

	$("#tl-row").empty();
	tlThisSent.forEach(function(item, index) {
		var item = makeTags(item);
		$("<div>"+item+"</div>").addClass("token").hover(function(){hoverHighlight($(this))},function(){hoverUnhighlight($(this))}).appendTo("#tl-row");
	});
	$("#align-row").empty();
	alignmentThisSent.forEach(function(pair, index) {
		var slIdx = pair.replace(/-.*/g, "");
		var tlIdx = pair.replace(/.*-/g, "");
		var slEl = $("#sl-row").children().eq(slIdx);
		var tlEl = $("#tl-row").children().eq(tlIdx);
		//connect(document.getElementById("sl-row"), document.getElementById("tl-row"), "#00AAAA", 2);
		var lineObject = makeConnectLine(slEl, tlEl, "#00AAAA", 2).data("pair", pair);
		//console.log(lineObject, pair, lineObject.data("pair"));
		$("#align-row").append(lineObject);
	});

}

// Apertium stream format tokenisation by Daniel Swanson
var apStreamTokenise = function(s) {
	var ls = [];
	var last = 0;
	for (var i = 0; i < s.length; i++) {
		if (s[i] == "^") {
			last = i;
		} else if (s[i] == "$") {
			ls.push(s.slice(last, i+1))
		}
	}
	return ls;
};

function makeTags(item) {
	item = item.replace(/</g, "☭");
	item = item.replace(/>/g, "</tag>");
	item = item.replace(/☭/g, "<tag>");
	return item;
}


// getOffset() and connect() from
// https://stackoverflow.com/questions/8672369/how-to-draw-a-line-between-two-divs
function getOffset( el ) {
	var rect = el[0].getBoundingClientRect();
	return {
		left: rect.left + window.pageXOffset,
		top: rect.top + window.pageYOffset,
		width: rect.width || el.offsetWidth,
		height: rect.height || el.offsetHeight
	};
}

function makeConnectLine(div1, div2, color, thickness) { // draw a line connecting elements
	if (typeof div1[0] !== 'undefined' || typeof div2[0] !== 'undefined') {
		var off1 = getOffset(div1);
		var off2 = getOffset(div2);
		// bottom right
		var x1 = off1.left + off1.width/2;
		var y1 = off1.top + off1.height;
		// top right
		var x2 = off2.left + off2.width/2;
		var y2 = off2.top;
		// distance
		var length = Math.sqrt(((x2-x1) * (x2-x1)) + ((y2-y1) * (y2-y1)));
		// center
		var cx = ((x1 + x2) / 2) - (length / 2);
		var cy = ((y1 + y2) / 2) - (thickness / 2);
		// angle
		var angle = Math.atan2((y1-y2),(x1-x2))*(180/Math.PI);
		// make hr
		var htmlLine = "<div style='padding:0px; margin:0px; height:" + thickness + "px; background-color:" + color + "; line-height:1px; position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);' />";
		//
		// alert(htmlLine);
		//document.body.innerHTML += htmlLine;
		return $(htmlLine).addClass('line');
	} else {
		return "";
	}
}
