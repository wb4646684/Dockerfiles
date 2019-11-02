define('jira/share/controllers/select-single-share-type-controller', ['jquery'], function (jQuery) {
    'use strict';

    /**
     * Object that allows selection of of a single share types
     */

    function SelectSingleShareTypeController() {
        this.shares = new Array();
        this.shareTypes = {};
        this.singleton = false;
    }

    SelectSingleShareTypeController.prototype = {
        /**
         * Adds a particular "Share Type" to the object. This will allow this ShareType to be rendered
         * and selected.
         *
         * @param shareType the share type to register.
         */
        registerShareType: function registerShareType(shareType) {
            if (!shareType || !shareType.type) {
                return;
            }

            this.shareTypes[String(shareType.type)] = shareType;
        },

        /**
         * Initialise the screen and object state. The screen should have already been rendered before this function
         * is called.
         */
        initialise: function initialise() {
            var shareTypeName;
            var shareType;
            var that = this;
            for (shareTypeName in this.shareTypes) {
                shareType = this.shareTypes[shareTypeName];
                if (shareType.initialise) {
                    shareType.initialise();
                }
            }

            var dataSpan = document.getElementById('shares_data');
            var shares;

            try {
                var dataStr = dataSpan.firstChild.nodeValue;
                shares = JSON.parse(dataStr);
                if (!(shares instanceof Array)) {
                    shares = [];
                }
            } catch (ex) {
                shares = [];
            }

            var type = null;
            var sharePermission = null;
            if (shares.length === 0) {
                // init it with a default choice
                type = 'any';
                shareType = this.shareTypes[type];
                sharePermission = null;
            } else {
                // we have at least one.  Ask the first one to render its selection state
                type = shares[0].type;
                shareType = this.shareTypes[type];
                sharePermission = shares[0];
            }

            if (shareType.updateSelectionFromPermission) {
                // then ask the share type instance to reflect the current values
                shareType.updateSelectionFromPermission(sharePermission);
            }

            var selectList = document.getElementById('share_type_selector');
            if (selectList) {
                //
                // make the selector represent the current share type
                this.updateShareTypeSelectorList(selectList, type);

                jQuery(selectList).change(function (e) {
                    that.selectShareTypeCallback(e);
                });
            }

            var node = document.getElementById('share_busy');
            if (node) {
                node.style.display = 'none';
                if (node.parentNode) {
                    node.parentNode.removeChild(node);
                }
            }

            node = document.getElementById('share_div');
            if (node) {
                node.style.display = '';
            }
        },

        /**
         * Called to reflect the current shareType in the given select box
         */
        updateShareTypeSelectorList: function updateShareTypeSelectorList(selectBox, selectedShareType) {
            var options = selectBox.options;
            var selectedIndex = 0;
            for (var i = 0; i < options.length; i++) {
                var optVal = options[i].value;
                if (optVal === selectedShareType) {
                    selectedIndex = i;
                }
                // make child select fields invisible
                document.getElementById('share_' + optVal).style.display = 'none';
            }
            options[selectedIndex].selected = true;
            // make the selected child select field visible
            var childSelectBox = document.getElementById('share_' + options[selectedIndex].value);
            if (childSelectBox) {
                childSelectBox.style.display = '';
            }
        },

        /**
         * Create a callback for the "ShareType" selector component. This callback will select to correct editor
         * when the "ShareType" is changed.
         */
        selectShareTypeCallback: function selectShareTypeCallback() {
            var selectList = document.getElementById('share_type_selector');
            var options = selectList.options;
            var selectedElement;
            for (var i = 0; i < options.length; i++) {
                var element = document.getElementById('share_' + options[i].value);
                if (element) {
                    if (i === selectList.selectedIndex) {
                        selectedElement = element;
                    } else {
                        element.style.display = 'none';
                    }
                }
            }
            selectedElement.style.display = '';
        },

        setWarning: function setWarning(warning) {
            var warningDiv = document.getElementById('share_warning');
            if (warningDiv) {
                if (warning.length > 0) {
                    warningDiv.className = 'aui-message aui-message-warning';
                    warningDiv.innerHTML = warning;
                } else {
                    warningDiv.className = '';
                    warningDiv.innerHTML = '';
                }
            }
        }
    };

    return SelectSingleShareTypeController;
});