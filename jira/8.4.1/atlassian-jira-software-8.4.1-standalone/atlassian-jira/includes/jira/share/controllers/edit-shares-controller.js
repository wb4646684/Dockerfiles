define('jira/share/controllers/edit-shares-controller', ['jira/share/i18n', 'jira/util/formatter', 'jira/jquery/plugins/isdirty', 'jira/share/controllers/edit-shares-model', 'jquery'], function (i18n, formatter, DirtyForm, EditSharesModel, jQuery) {
    'use strict';

    var shareWarningTitle = formatter.I18n.getText('common.sharing.with.anyone.security.warning.title');

    /**
     * Object that allows viewing and editing of current share permissions.
     */
    function EditSharesController(mode, duplicateFinder, preventSaveHandler) {
        this.findDuplicatesInOtherModes = duplicateFinder;
        this.preventSave = preventSaveHandler;
        this.view = new EditSharesModel(mode);
        this.shares = [];
        this.mode = mode;
        this.shareTypes = {};
        this.singleton = false;
        this.selectedShareTypeChanged = false;
        this.defaultShareType = null;
    }

    EditSharesController.prototype = {
        /**
         * Adds a particular "Share Type" to the object. This will allow this ShareType to be rendered
         * and edited.
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
            this.view.initialise();
            this.initShares();
            this.view.recalculateHiddenValue(this.shares);

            this.defaultShareType = this.view.setupDefaultShareType();
            var currentShareType = this.shareTypes[this.defaultShareType];
            this.view.setWarning(currentShareType.getDisplayWarning(), shareWarningTitle);

            this.initEvents();
        },

        initShares: function initShares() {
            var _this = this;

            var that = this;
            for (var shareTypeName in this.shareTypes) {
                var shareType = this.shareTypes[shareTypeName];
                jQuery('#share_add_' + shareType.type + '_' + this.mode).click(function (shareTypeRef) {
                    return function (e) {
                        that.addShareCallback(e, shareTypeRef);
                    };
                }(shareType));
                if (shareType.initialise) {
                    shareType.initialise();
                }
            }
            var shares = void 0;

            var dataSpan = this.view.getModeElementById('shares_data');
            try {
                shares = JSON.parse(dataSpan.firstChild.nodeValue);
                if (!(shares instanceof Array)) {
                    shares = [];
                }
            } catch (ignored) {
                shares = [];
            }

            if (this.mode === 'viewers') {
                shares = shares.filter(function (share) {
                    return share.rights.value === 1;
                });
            } else {
                shares = shares.filter(function (share) {
                    return share.rights.value === 3;
                });
            }

            shares.forEach(function (share) {
                if (share.type !== undefined) {
                    var _shareType = _this.shareTypes[share.type];
                    if (_shareType) {
                        var display = _shareType.getDisplayFromPermission(share);
                        if (display) {
                            _this.addShare(display);
                        }
                    }
                }
            });

            if (this.shares.length === 0) {
                this.view.displayEmptySharesTemplate();
            }
        },

        initEvents: function initEvents() {
            var that = this;
            this.view.getShareTypeSelector().change(function (e) {
                that.selectShareTypeCallback(e);
            });

            var chosen = this.view.getModeElementById('share_type_hidden');
            chosen.defaultValue = chosen.value;
            jQuery(chosen).addClass(DirtyForm.ClassNames.SANCTIONED);

            if (this.view.getSubmitButton()) {
                this.view.getSubmitButton().click(function (e) {
                    that.saveCallback(e);
                });

                this.view.getForm().on('submit', function () {
                    that.view.onFilterEdit(chosen);
                });
            }
        },

        addShare: function addShare(shareDisplay) {
            if (!shareDisplay) {
                return;
            }

            var index = this.findShareIndex(shareDisplay.permission);
            if (index >= 0) {
                this.animateShare(index);
                return;
            }

            if (this.findDuplicatesInOtherModes(shareDisplay.permission, this.mode)) {
                return;
            }
            var newDiv = this.getNewContainer(shareDisplay);
            if (!newDiv) {
                return;
            }
            var shareId = this.view.addDisplay(shareDisplay, newDiv, this.removeCallback.bind(this));
            this.singleton = shareDisplay.singleton;
            this.shares.push({ id: shareId, permission: shareDisplay.permission });
            this.view.recalculateHiddenValue(this.shares);
        },

        getNewContainer: function getNewContainer(shareDisplay) {
            if (shareDisplay.singleton) {
                //we are going to add a singleton, then ask the user if they want to delete the other shares.
                if (this.shares.length !== 0) {
                    var msg = i18n.getMessage('common.sharing.remove.shares.public');
                    if (shareDisplay === 'loggedin') {
                        msg = i18n.getMessage('common.sharing.remove.shares.authenticated');
                    }
                    var isOk = confirm(msg);
                    if (!isOk) {
                        return;
                    }
                }
                return this.getClearedContainer();
            } else if (this.singleton) {
                //if there is currently a singleton clear the display ready for the new share.
                if (!this.shares[0] || !this.shares[0].permission) {
                    return;
                }
                var _msg = this.shares[0].permission.type === 'loggedin' ? 'common.sharing.remove.singleton.loggedin' : 'common.sharing.remove.singleton.public';
                if (confirm(i18n.getMessage(_msg))) {
                    return this.getClearedContainer();
                }
            } else if (this.shares.length === 0) {
                //if we currently have no shares, we have to remove the "not shared" message
                return this.getClearedContainer();
            } else {
                return document.createElement('div');
            }
        },

        getClearedContainer: function getClearedContainer() {
            var newDiv = this.clearShares() || document.createElement('div');
            while (newDiv && newDiv.firstChild) {
                newDiv.removeChild(newDiv.firstChild);
            }
            return newDiv;
        },

        /**
         * Search the current shares to see if the passed share already exists. The identifier of the passed
         * share is returned.
         *
         * @param sharePermission the permission to search for.
         */
        findShareIndex: function findShareIndex(sharePermission) {
            var share = this.shares.find(function (_share) {
                return sharePermission.equals(_share.permission);
            });
            return share ? share.id : -1;
        },

        /**
         * Create a callback for the "ShareType" selector component. This callback will select to correct editor
         * when the "ShareType" is changed.
         */
        selectShareTypeCallback: function selectShareTypeCallback() {
            var selectedType = this.view.getSelectedType();
            var currentShareType = this.shareTypes[selectedType];
            this.view.setWarning(currentShareType.getDisplayWarning(), shareWarningTitle);
            this.selectedShareTypeChanged = true;
        },

        saveCallback: function saveCallback(e) {
            if (this.preventSave()) {
                return;
            }
            var currentShareType = this.getCurrentShareType();
            if (this.anyChangesExist(currentShareType)) {
                if (this.findCurrentlySelectedShare() < 0) {
                    this.confirmSave(e);
                }
            }
        },

        confirmSave: function confirmSave(e) {
            if (!confirm(this.getMessage())) {
                e.preventDefault();
            }
            if (this.mode === 'viewers') {
                this.preventSave(true);
            }
        },

        anyChangesExist: function anyChangesExist(currentShareType) {
            if (this.selectedShareTypeChanged) {
                return true;
            }
            if (currentShareType.type === this.defaultShareType) {
                return currentShareType.inputChangesExist();
            }
            return false;
        },

        getMessage: function getMessage() {
            return i18n.getMessage('common.sharing.dirty.warning');
        },

        addShareCallback: function addShareCallback(ignoredEvent, shareType) {
            this.addShare(shareType.getDisplayFromUI());
        },

        /**
         * Create a callback to delete a share that has been rendered.
         *
         * @param id the registration id of the share to delete.
         */
        removeCallback: function removeCallback(event, id) {
            this.remove(id);
        },

        /**
         * Remove the passed share registration.
         *
         * @param id the share registration to remove.
         */
        remove: function remove(id) {
            //if we added and immediately deleted a share, don't show dirty warning
            if (this.findCurrentlySelectedShare() === id) {
                this.defaultShareType = this.getCurrentShareType().type;
                this.selectedShareTypeChanged = false;
                this.getCurrentShareType().dirty = false;
            }
            this.shares = this.shares.filter(function (share) {
                return share.id !== id;
            });
            this.view.remove(id, this.shares.length);
            this.view.recalculateHiddenValue(this.shares);
        },

        findCurrentlySelectedShare: function findCurrentlySelectedShare() {
            var preventClear = true;
            var display = this.getCurrentShareType().getDisplayFromUI(preventClear);
            if (display && display.permission) {
                return this.findShareIndex(display.permission);
            }
        },

        /**
         * Clear the area that displays the shares. This method will return the DIV of the first rendered
         * share or null if it does not exist. This returned share can then be reused to render the GUI
         * after the clear. We do this to stop flickering that sometimes occurs when the display is cleared
         * and a new share is subsequently added.
         */
        clearShares: function clearShares() {
            this.shares = [];
            return this.view.clearDiv();
        },

        animateShare: function animateShare(index) {
            this.view.animateShare(index);
        },

        getCurrentShareType: function getCurrentShareType() {
            var selectList = this.view.getSelectList();
            if (selectList) {
                return this.shareTypes[selectList.options[selectList.selectedIndex].value];
            } else {
                return null;
            }
        }
    };

    return EditSharesController;
});