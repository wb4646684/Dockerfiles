define('jira/share/util', [], function () {
    'use strict';
    /**
     * Display the element 'idShow' and hide the element 'idHide'.
     *
     * @param idShow the id of the element to show.
     * @param idHide the id of the element to hide.
     */

    function toggleElements(idShow, idHide) {
        var elementHide = document.getElementById(idHide);
        var elementShow = document.getElementById(idShow);
        if (elementHide && elementShow) {
            elementHide.style.display = 'none';
            elementShow.style.display = '';
        }
    }

    return {
        toggleElements: toggleElements
    };
});