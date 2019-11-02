require(['jira/util/formatter', 'jquery', 'jira/dialog/form-dialog'], function (formatter, $, FormDialog) {
    "use strict";

    $(function () {
        $('.actions a.delete').each(function () {
            new FormDialog({
                trigger: '#' + this.id,
                autoClose: true
            });
        });
    });

    $(document).on("click", '.groups .actions .show-group-details', function () {
        var $this = $(this);
        var $rows = $('.group-details[data-group-id="' + $this.data('group-id') + '"]');

        if ($rows.length > 0) {
            if ($($rows[0]).hasClass('hidden')) {
                $rows.removeClass('hidden');
                $this.text(formatter.I18n.getText('common.words.show.less'));
            } else {
                $rows.addClass('hidden');
                $this.text(formatter.I18n.getText('common.words.show.more'));
            }
        }
    });

    $(document).on("click", '.job-details .actions .show-job-details', function () {
        var $this = $(this);
        var $rows = $('.job-details[data-job-id="' + $this.data('job-id') + '"]');

        if ($rows.length > 0) {
            if ($($rows[0]).hasClass('hidden')) {
                $rows.removeClass('hidden');
                $this.text(formatter.I18n.getText('common.words.show.less'));
            } else {
                $rows.addClass('hidden');
                $this.text(formatter.I18n.getText('common.words.show.more'));
            }
        }
    });
});