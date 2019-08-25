﻿$(window).on('load', function () {
    getListHocKy();

    changeDropHocKy($(".HocKy #HocKy").val());

   
});

//Thay doi dropdown cua thuc tap
function changeDropThucTap(IDTT, search = "") {
    var IDHK = $(".HocKy #HocKy").val();
    var i = 1;
    $.ajax({
        async: false,
        url: "/TopicStudent/GetByKHvaLoaiTT?IDHK=" + IDHK + "&IDTT=" + IDTT + "&search=" + search ,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            var html = '';

            if (result == "") {
                html += '<tr>';
                html += '<td colspan="6">Không có dữ liệu</td>';

                html += '</tr>';
                $('.tbody').html(html);
            }
            else {
                $.each(result, function (key, item) {
                    html += '<tr>';
                    html += '<td align="center">' + (i++) + '</td>';
                    html += '<td>' + item.MaSV + '</td>';
                    html += '<td>' + item.FirstName + " " + item.LastName + '</td>';
                    html += '<td>' + item.TopicName + '</td>';
                    if (item.Progress == 0) {

                        html += '<td align="center"><label style="background-color:cornflowerblue;padding:5px;color:white">Nhận đề tài</label ></td >';
                        
                    }
                    else if (item.Progress == 1) {
                        html += '<td align="center"><label style="background-color:cornflowerblue;padding:5px;color:white">BCTD lần 1</label ></td >';
                    }
                    else if (item.Progress == 2) {
                        html += '<td align="center"><label style="background-color:cornflowerblue;padding:5px;color:white">BCTD lần 2</label ></td >';
                    }
                    else if (item.Progress == 3) {
                        html += '<td align="center"><label style="background-color:cornflowerblue;padding:5px;color:white">Đạt</label ></td >';
                    }

                    html += ' <td align="center"><a onclick="return getbyID(' + item.ID + ')"><i style="color:#009933" class="fa fa-edit"></i></a> </td>';

                    html += '</tr>';
                });
                $('.tbody').html(html);

            }
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

var id, progress;

//Function for getting the Data Based upon ID  
function getbyID(ID) {
    $('#SuaTenDeTai').css('border-color', 'lightgrey');
    $('#SuaMoTa').css('border-color', 'lightgrey');
    $.ajax({
        url: "/TopicStudent/GetbyID?id=" + ID,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            if (result.Progress == 0) {
                id = ID;
                progress = result.Progress;
                $('#giamsattd').modal('show');
            }
            else if (result.Progress == 1){
                $('#step1').attr("disabled");
                $('#step1').removeClass('btn-success').addClass('btn-default');
                $('#step-1').hide();
                $('#step2').removeAttr("disabled");
                $('#step2').addClass('btn-success');
                $('#step-2').show();
                $('#step3').attr("disabled");
                id = ID;
                progress = result.Progress;
                $('#giamsattd').modal('show');
            }
            else if (result.Progress == 2) {
                $('#step1').attr("disabled");
                $('#step1').removeClass('btn-success').addClass('btn-default');
                $('#step-1').hide();
                $('#step3').removeAttr("disabled");
                $('#step3').addClass('btn-success');
                $('#step-3').show();
                $('#step2').attr("disabled");
                id = ID;
                progress = result.Progress;
                $('#giamsattd').modal('show');
            }
            else {
                $('#notification').addClass('alert-success');
                $('#notification').text('Đã xét duyệt đạt cho sinh viên này');
                myFunction();
            }
            

        },
        error: function (errormessage) {
            $('#notification').addClass('alert-success');
            $('#notification').text('Đã xảy ra lỗi khi xét duyệt');
            myFunction();
        }
    });
            



}

$(document).ready(function () {

    var navListItems = $('div.setup-panel div a'),
        allWells = $('.setup-content'),
        allNextBtn = $('.nextBtn');

    allWells.hide();

    navListItems.click(function (e) {
        e.preventDefault();
        var $target = $($(this).attr('href')),
            $item = $(this);

        if (!$item.hasClass('disabled')) {
            navListItems.removeClass('btn-success').addClass('btn-default');
            $item.addClass('btn-success');
            allWells.hide();
            $target.show();
            $target.find('input:eq(0)').focus();
            
        }
    });

    allNextBtn.click(function () {
        var curStep = $(this).closest(".setup-content"),
            curStepBtn = curStep.attr("id"),
            nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
            curInputs = curStep.find("input[type='text'],input[type='url']"),
            isValid = true;

        $(".form-group").removeClass("has-error");
        for (var i = 0; i < curInputs.length; i++) {
            if (!curInputs[i].validity.valid) {
                isValid = false;
                $(curInputs[i]).closest(".form-group").addClass("has-error");
            }
        }

        if (isValid) nextStepWizard.removeAttr('disabled').trigger('click');
        plus(id, ++progress);
        changeDropHocKy($(".HocKy #HocKy").val());
    });

    $('div.setup-panel div a.btn-success').trigger('click');
});

function plus(id,progress) {
    $.ajax({
        url: "/TopicStudent/Plus?id=" + id + "&progress=" + progress,
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {

        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}