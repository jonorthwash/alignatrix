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
		updateCurrentSentence();
	}
);
$(document).on("click", "#prevSent",
	function(event) {
		//updateCurrentSentence();
		var prevVal = Number($("#currentSent").val());
		$("#currentSent").val(prevVal-1);
		updateCurrentSentence();
	}
);
$(document).on("click", "#nextSent",
	function(event) {
		//updateCurrentSentence();
		var prevVal = Number($("#currentSent").val());
		if (prevVal+1>maxNumLines()) {
			$("#currentSent").val(prevVal+1);
			updateCurrentSentence();
		}
	}
);

function maxNumLines() {
	return Math.max($("#slSents").data("lines"), $("#tlSents").data("lines"), $("#alignmentData").data("lines"));
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
		$("<div>"+item+"</div>").addClass("token").appendTo("#sl-row");
	});

	$("#tl-row").empty();
	tlThisSent.forEach(function(item, index) {
		$("<div>"+item+"</div>").addClass("token").appendTo("#tl-row");
	});

}
