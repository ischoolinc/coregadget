// 自傳
$(function() {
    LessonPlanManager.ControlMemoir = function(target) {
        var _myInfo;
        target = $(target);
        var showMemoir = function(myInfo) {
            _myInfo = myInfo || {};
            target.find('[name=Memoir]').val(_myInfo.Memoir);
        };
        var setMemoir = function(req) {
            req = req || {};
            _myInfo.Autobiography = req.Autobiography;

            target.find('[data-action=save]').text('儲存變更').removeClass("disabled");
            $('#mainMsg').html('<div class="alert alert-success">\n  儲存成功！\n</div>');
            setTimeout("$('#mainMsg').html('')", 1500);
        };

        target.find('[data-action=save]').click(function() {
                    if ($(this).hasClass('disabled')) return;
            $(this).text('儲存中...').addClass('disabled');
            var tmp_req = target.find('form').serializeObject();
            LessonPlanManager.StartUp.profileSave({Request: { TeacherExt : tmp_req }} , setMemoir);
        });

        LessonPlanManager.StartUp.profileReady(showMemoir);
    }('#memoir');
});