$(document).ready(function() {
	updateCurrentSentence();
});

$(window).on('resize', function(){
	updateCurrentSentence();
});

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

	$("#slSents").data("lines", slSents.length);
	$("#tlSents").data("lines", tlSents.length);
	$("#alignmentData").data("lines", alignmentData.length);

	$("#sl-row").empty();
	slThisSent.forEach(function(item, index) {
		var item = makeTags(item);
		$("<div>"+item+"</div>").addClass("token").appendTo("#sl-row");
	});

	$("#tl-row").empty();
	tlThisSent.forEach(function(item, index) {
		var item = makeTags(item);
		$("<div>"+item+"</div>").addClass("token").appendTo("#tl-row");
	});
	$("#align-row").empty();
	alignmentThisSent.forEach(function(item, index) {
		var slIdx = item.replace(/-.*/g, "");
		var tlIdx = item.replace(/.*-/g, "");
		var slEl = $("#sl-row").children().eq(slIdx);
		var tlEl = $("#tl-row").children().eq(tlIdx);
		//connect(document.getElementById("sl-row"), document.getElementById("tl-row"), "#00AAAA", 2);
		htmlLine = makeConnectLine(slEl, tlEl, "#00AAAA", 2);
		$("#align-row").append(htmlLine);
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
		return htmlLine;
	} else {
		return "";
	}
}
