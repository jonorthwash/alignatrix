$(document).ready(function() {
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

	var slThisSent = slSents[curSent].split(' ');
	var tlThisSent = tlSents[curSent].split(' ');
	var alignmentThisSent = alignmentData[curSent].split(' ');

	$("#slSents").data("lines", slSents.length);
	$("#tlSents").data("lines", tlSents.length);
	$("#alignmentData").data("lines", alignmentData.length);

	$("#sl-row").empty();
	slThisSent.forEach(function(item, index) {
		item = makeTags(item);
		$("<div>"+item+"</div>").addClass("token").appendTo("#sl-row");
	});

	$("#tl-row").empty();
	tlThisSent.forEach(function(item, index) {
		item = makeTags(item);
		$("<div>"+item+"</div>").addClass("token").appendTo("#tl-row");
	});

}

function makeTags(item) {
	item = item.replace(/</g, "☭");
	item = item.replace(/>/g, "</tag>");
	item = item.replace(/☭/g, "<tag>");
	return item;
}
