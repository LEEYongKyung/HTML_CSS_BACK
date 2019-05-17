$(document).ready(function() {

	// companyCtrl.initialize();
	companyDBCtrl.initialize();
	companyRender.initialize();

})

// var companyCtrl = {

// 	initialize : function() {

// 		// 검색 버튼 클릭 시
// 		$("#searchBtn").on("click", function() {
// 			companyCtrl.goSearch();
// 		});

// 		// 등록 버튼 클릭 시
// 		$("#insertBtn, #updateBtn").on("click", function() {
// 			companyCtrl.goInsert($(this).attr("key"));
// 		});

// 		// 목록/취소 버튼 클릭 시
// 		$("#listBtn, #cancelBtn").on("click", function() {
// 			companyCtrl.goList($(this).attr("key"));
// 		});

// 		$("#contractAddBtn").on("click", function() {
// 			companyRender.addContractDiv();
// 		});
		
// 		// 중복확인 버튼 클릭 시
// 		$("#idCheckBtn").on("click", function() {
// 			var code = $("#company_code").val();
// 			commonCtrl.duplicationCodeCheck(code, 'comp', 6, '');
// 		});

// 	},

// 	goList : function(key) {

// 		var pageNo = $("#pageNo").val();

// 		if (key == 'list') {
// 			pageNo = $("#listPageNo").val();
// 		}

// 		document.location.href = "/selectCompanyList.bs?pageNo=" + pageNo;
// 	},

// 	goSearch : function() {

// 		$("#searchForm").submit();
// 	},

// 	goDetail : function(code) {

// 		var pageNo = $("#pageNo").val();
// 		document.location.href = "/selectCompanyInfo.bs?pageNo=" + pageNo
// 				+ "&code=" + code;
// 	},

// 	goInsert : function(key) {
// 		var pageNo = $("#pageNo").val();
// 		var code = $("#code").val();
// 		var url = "/insertCompanyInfo.bs";

// 		if (key == "update") {
// 			url = "/updateCompanyInfo.bs?pageNo=" + pageNo + "&code="
// 					+ $("#code").val();
// 		}

// 		document.location.href = url;
// 	},
	
	

// };

var companyDBCtrl = {

	initialize : function() {

		var confirmMsg = "Confirm";
		var successMsg = "SUCCESS";

		$("#regist_user").ajaxForm({
			dataType : "json",
			beforeSubmit : function(data, frm, opt) {
				if (!companyDBCtrl.companyValidationCheck($("#regist_user"))) {
					return false;
				}
				// if (!confirm(common_confirm_insert_msg)) {
				// 	return false;
				// }
			},
			success : function(result) {
				var resultCode = "1000"
				var resultMsg = "resultMSG"

				if (resultCode == system_success_code) {
					alert(common_success_insert_msg);
					document.location = "/selectCompanyList.bs";
				} else {
					alert("["+resultCode+"]\n"+resultMsg);
					if (resultCode == system_session_code) {
						document.location.reload();
					}
				}
			},
			error : function(request, status, error) {
				alert(system_error_msg);
			}
		});

		$("#updateCompanyForm").ajaxForm({
			dataType : "json",
			beforeSubmit : function(data, frm, opt) {
				if (!companyDBCtrl.companyValidationCheck($("#updateCompanyForm"))) {
					return false;
				}
				if (!confirm(common_confirm_update_msg)) {
					return false;
				}
			},
			success : function(result) {
				var resultCode = result.resultInfo.resultCode
				var resultMsg = result.resultInfo.resultMsg

				if (resultCode == system_success_code) {
					alert(common_success_update_msg);
					document.location.reload();
				} else {
					alert("["+resultCode+"]\n"+resultMsg);
					if (resultCode == system_session_code) {
						document.location.reload();
					}
				}
			},
			error : function(request, status, error) {
				alert(system_error_msg);
			}
		});

		$("#contractForm").ajaxForm({
			dataType : "json",
			beforeSubmit : function(data, frm, opt) {

				if ($("#contractCode").val() != undefined
						&& $("#contractCode").val() != "") {
					confirmMsg = common_confirm_update_msg;
					successMsg = common_success_update_msg;
				}

				if (!companyDBCtrl
						.contractValidationCheck($("#contractForm"))) {
					return false;
				}

				if (!confirm(confirmMsg)) {
					return false;
				}
			},
			success : function(result) {
				var resultCode = result.resultInfo.resultCode
				var resultMsg = result.resultInfo.resultMsg

				if (resultCode == system_success_code) {
					alert(successMsg);
					document.location.reload();
				} else {
					alert(system_error_msg.format(result.code));
					if (resultCode == system_session_code) {
						document.location.reload();
					}
				}
			},
			error : function(request, status, error) {
				alert(system_error_msg);
			}
		});
	},

	companyValidationCheck : function(form) {
		if (!companyValidation(form)) {
			return false;
		}
		return true;
	},
	
	contractValidationCheck : function(form) {
		if (!contractValidation(form)) {
			return false;
		}
		return true;
	}

};

var companyRender = {

	contractDiv : null,
	addContractDivCnt : 1,

	initialize : function() {

		if ($("#contractDiv").length) {
			companyRender.contractDiv = $("#contractDiv").html();
		}

		$("#contractUpdateCancelBtn").on("click", function() {
			companyRender.setContractFieldClear();
		});

		$("#contractImgView").hide();
		$("#contractUpdateBtn").hide();
		$("#contractUpdateCancelBtn").hide();

	},

	setContractText : function(name, during, imgUrl) {
		$("#contractName").html(name);
		$("#contractDuring").html(during);
		$("#contractImg").attr("href", imgUrl);
		$("#contractImg").text(imgUrl);
		
		$("#contractDetailDiv").show();
	},
	setContractTextInput : function(name, during, imgUrl) {
		$("#contractName").val(name);
		$("#contractDuring").val(during);
		$("#contractImg").attr("href", imgUrl);
		$("#contractImg").text(imgUrl);
		
		$("#contractDetailDiv").show();
	},

	addContractDiv : function() {
		var addCnt = companyRender.addContractDivCnt;
		var $addContractDiv = $("<div/>").attr("id", "addContractDiv" + addCnt);
		var $delContractDiv = $("<div/>");
		var $delContractBtn = $("<a/>").addClass("minusBtn").attr("href", "javascript:;");
		
		$delContractDiv.attr("style", "text-align: right; width: 1007px; padding-bottom: 10px;");
		$delContractBtn.attr("id", "delContractBtn" + addCnt)
			.attr("style", "width: 60px;").text("-")
			.attr("addNum", addCnt)
			.on("click", function(e) {
				e.preventDefault();
				companyRender.delContractDiv(addCnt);
			}
		);
		
		$delContractDiv.append($delContractBtn);
		$addContractDiv.append(companyRender.contractDiv).append($delContractDiv);
		
		var startDateId = "";
		var endDateId = "";
		$addContractDiv.find("input").each(function(idx) {
			if ($(this).attr("name") == "contractStartDate") {
				startDateId = "contractStartDate" + addCnt;
				$(this).attr("id", startDateId);
			}
			if ($(this).attr("name") == "contractEndDate") {
				endDateId = "contractEndDate" + addCnt;
				$(this).attr("id", endDateId)
			}
		});
		
		// 기존 달력 이미지 삭제
		$addContractDiv.find('.ui-datepicker-trigger').remove();

		$("#addContractFieldDiv").append($addContractDiv);
		
		// 달력 적용
		//setDatepicker($("#"+startDateId));
		//setDatepicker($("#"+endDateId));

		companyRender.addContractDivCnt++;
	},

	delContractDiv : function(num) {
		$("#addContractDiv" + num).remove();
		companyRender.addContractDivCnt--;
	},

	setContractUpdate : function(code, name, dtStart, dtEnd, imgIdx, imgUrl) {
		$("#contractCode").val(code);
		$("#contractName").val(name);
		$("#contractStartDate").val(dtStart);
		$("#contractEndDate").val(dtEnd);
		$("#contractImgIdx").val(imgIdx);

		$("#contractImg").removeAttr("required");

		$("#contractImgView").attr("href", imgUrl);
		$("#contractImgView").text(imgUrl);

		$("#contractImgView").show();
		$("#contractUpdateBtn").show();
		$("#contractUpdateCancelBtn").show();

		$("#contractInsertBtn").hide();
	},

	setContractFieldClear : function() {
		$("#contractCode").val("");
		$("#contractName").val("");
		$("#contractStartDate").val("");
		$("#contractEndDate").val("");
		$("#contractImgIdx").val("");

		$("#contractImg").attr("required", "required");

		$("#contractImgView").attr("src", "");

		$("#contractImgView").hide();
		$("#contractUpdateBtn").hide();
		$("#contractUpdateCancelBtn").hide();

		$("#contractInsertBtn").show();
	}

};

function companyValidation( from ) {

	var $form = from;
	var pageGbn = $form.find("#pageGbn").val();
	var retFlag = true;

	$form.find("input").each(function(idx) {
		if (retFlag && $(this).attr("required")) {

			if ($(this).val() == '') {
				alert($(this).attr("alt") + common_validation_required_msg);
				retFlag = false;
				return false;
			}
		}
	});
	
	if ( !retFlag ) {
		return false;
	}
	
	var imgFileName1 = $("#businessRegistrationUrl").val();
	var imgFileName2 = $("#ci").val();
	if ( pageGbn == 'update' ) {
		if ( imgFileName1 != '' ) {
			if ( !isImgExtensionCheck(imgFileName1) ) {
				alert(common_validation_file_extension_checked_msg1);
				return false;
			}
		}
		
		if ( imgFileName2 != '' ) {
			if ( !isImgExtensionCheck(imgFileName2) ) {
				alert(common_validation_file_extension_checked_msg1);
				return false;
			}
		}
	} else {
		if ( !isImgExtensionCheck(imgFileName1) || !isImgExtensionCheck(imgFileName2) ) {
			alert(common_validation_file_extension_checked_msg1);
			return false;
		}
		
		if ( !contractValidation(from) ) {
			return false;
		}
	}
	
	return true;

}

function contractValidation(from) {
	var retFlag = true;
	var imgFlag = false;

	$("input[name=contractStartDate]").each(function(idx) {
		var startDate = $(this).val();
		var endDate = $("input[name=contractEndDate]").eq(idx).val();
		
		if ( retFlag && !getDateCompare(startDate, endDate) ) {
			alert(common_validation_date_compare_msg);
			retFlag = false;
			return false;
		}
	});

	if ( !retFlag ) {
		return false;
	}
	
	$("input[name=contractImg]").each(function(idx) {
		var fileName = $(this).val();
		var extension = fileName.substring( fileName.lastIndexOf(".")+1, fileName.length );

		if ( $(this).attr("required") != undefined ) {
			imgFlag = false;
			if ( extension == "pdf" ) {
				imgFlag = true;
			}
		} else {
			imgFlag = true;
		}
	});
	
	if ( !imgFlag ) {
		alert(common_validation_file_extension_checked_msg1);
		return false;
	}
	
	return true;
}