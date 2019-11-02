define('jira/share/controllers/edit-shares-model', ['aui/message', 'jquery'], function (AuiMessages, jQuery) {
    'use strict';

    /**
     * Object that allows viewing and editing of current share permissions.
     */

    function EditSharesModel(mode) {
        this.mode = mode;
        this.counter = 0;
        this.displayDiv = this.getModeElementById('share_display_div');
        this.emptyDiv = this.getModeElementById('empty_share');
        this.shareDiv = this.getModeElementById('share_div');
    }

    EditSharesModel.prototype = {

        initialise: function initialise() {
            var busy = this.getModeElementById('share_busy');
            if (busy) {
                busy.style.display = 'none';
                if (busy.parentNode) {
                    busy.parentNode.removeChild(busy);
                }
            }
            this.shareDiv.style.display = '';
        },

        setupDefaultShareType: function setupDefaultShareType() {
            var selectList = this.getModeElementById('share_type_selector');
            var options = selectList.options;
            var selectedType = options[selectList.selectedIndex].value;
            this.getModeElementById('share_' + selectedType).style.display = '';
            return selectedType;
        },

        onFilterEdit: function onFilterEdit(chosen) {
            if (this.mode === 'viewers') {
                var editorsInput = document.getElementById('share_type_hidden_editors');
                if (editorsInput) {
                    try {
                        var viewersValue = JSON.parse(chosen.value);
                        viewersValue.forEach(function (permission) {
                            permission.rights = { value: 1 };
                        });

                        var editorsValue = JSON.parse(editorsInput.value);
                        editorsValue.forEach(function (permission) {
                            //todo map
                            permission.rights = { value: 3 };
                        });
                        chosen.value = JSON.stringify(viewersValue.concat(editorsValue));

                        editorsInput.parentNode.removeChild(editorsInput);
                    } catch (e) {
                        console.log("Error parsing JSON data: " + e);
                    }
                }

                this.removeEditorsSelect('group-share');
                this.removeEditorsSelect('project-share');
                this.removeEditorsSelect('role-share');
            }
        },

        setWarning: function setWarning(warning, title) {
            var warningDiv = document.getElementById('share_warning');
            if (warningDiv) {
                if (warning.length > 0) {
                    AuiMessages.warning('#share_warning', {
                        body: warning,
                        title: title,
                        closeable: false,
                        shadowed: false
                    });
                } else {
                    warningDiv.innerHTML = '';
                }
            }
        },

        getModeElementById: function getModeElementById(id) {
            return document.getElementById(id + '_' + this.mode);
        },

        removeEditorsSelect: function removeEditorsSelect(selectClass) {
            var editorsSelect = document.querySelector('.editors select.' + selectClass);
            if (editorsSelect) {
                editorsSelect.parentNode.removeChild(editorsSelect);
            }
        },

        animateShare: function animateShare(index) {
            var div = this.getModeElementById('share_div_' + index + '_inner');
            if (div) {
                var currentElement = div.parentNode;
                var bgColor = null;

                //find the current background colour of the element.
                while (!bgColor && currentElement && currentElement !== document.body.parentNode) {
                    if (currentElement.style) {
                        bgColor = currentElement.style.backgroundColor;
                    }
                    if (!bgColor && currentElement.bgColor) {
                        bgColor = currentElement.bgColor;
                    }

                    currentElement = currentElement.parentNode;
                }

                //unable to find the background colour. Lets use white.
                if (!bgColor) {
                    bgColor = '#FFFFFF';
                }

                // testing for "fading" flag in classname, prevents multiple tweens being initiated
                if (!jQuery(div).hasClass('fading')) {
                    jQuery(div).addClass('fading');
                    jQuery(div).css({ backgroundColor: '#FFCCCC' }).animate({ backgroundColor: '#FFFFFF' }, 2000, function () {
                        jQuery(div).removeClass('fading');
                    });
                }
            }
        },

        /**
         * Add and render the passed "Display" object.
         *
         * @param shareDisplay The "Display" object to render.
         * @param container The container to populate
         * @param removeCallback
         */
        addDisplay: function addDisplay(shareDisplay, container, removeCallback) {

            var newCount = this.counter++;

            container.className = 'shareItem';
            container.id = 'share_div_' + newCount + '_' + this.mode;

            //create the div that will render the share.
            var shareDiv = document.createElement('div');
            var id = 'share_div_' + newCount + '_inner_' + this.mode;
            shareDiv.id = id;
            shareDiv.title = shareDisplay.description;
            var filterIcon = this.cloneImage('share_icon');
            if (filterIcon) {
                shareDiv.appendChild(filterIcon);
            }

            var dataSpan = document.createElement('span');
            dataSpan.id = id + "_span";
            shareDisplay.dataSpanId = dataSpan.id;
            dataSpan.innerHTML = shareDisplay.display;
            shareDiv.appendChild(dataSpan);

            var newTrash = this.cloneImage('share_trash');
            if (newTrash) {
                jQuery(newTrash).click(function (e) {
                    removeCallback(e, newCount);
                });
                shareDiv.appendChild(newTrash);
            }

            container.appendChild(shareDiv);

            this.appendToDisplayDiv(container);

            if (shareDisplay.key) {
                shareDisplay.updateDisplayName();
            }

            return newCount;
        },

        remove: function remove(id, sharesLength) {
            var removeDiv = this.getModeElementById('share_div_' + id);
            if (sharesLength >= 1) {
                this.displayDiv.removeChild(removeDiv);
            } else {
                removeDiv.innerHTML = this.emptyDiv.innerHTML;
                removeDiv.className = this.emptyDiv.className;
                removeDiv.removeAttribute('id');
            }
        },

        clearDiv: function clearDiv() {
            while (this.displayDiv.firstChild) {
                if (this.displayDiv.firstChild.nodeName.toLowerCase() === 'div') {
                    var returnValue = this.displayDiv.firstChild;
                    while (returnValue.nextSibling) {
                        this.displayDiv.removeChild(returnValue.nextSibling);
                    }
                    return returnValue;
                } else {
                    this.displayDiv.removeChild(this.displayDiv.firstChild);
                }
            }
        },

        /**
         * Update the hidden field with the shares represented on the UI. This hidden field will contain a JSON
         * representation of all the shares the user has configured.
         */
        recalculateHiddenValue: function recalculateHiddenValue(shares) {
            var hidden = this.getModeElementById('share_type_hidden');
            if (hidden) {
                var valueArray = shares.map(function (share) {
                    return share.permission;
                });
                hidden.value = JSON.stringify(valueArray);
            }
        },

        appendToDisplayDiv: function appendToDisplayDiv(child) {
            this.displayDiv.appendChild(child);
        },

        displayEmptySharesTemplate: function displayEmptySharesTemplate() {
            var noShares = this.emptyDiv.cloneNode(true);
            noShares.removeAttribute('id');
            noShares.style.display = '';
            this.appendToDisplayDiv(noShares);
        },

        getSelectedType: function getSelectedType() {
            var selectList = this.getModeElementById('share_type_selector');
            var options = selectList.options;
            var selectedElement = void 0;
            for (var i = 0; i < options.length; i++) {
                var element = this.getModeElementById('share_' + options[i].value);
                if (element) {
                    if (i === selectList.selectedIndex) {
                        selectedElement = element;
                    } else {
                        element.style.display = 'none';
                    }
                }
            }
            selectedElement.style.display = '';
            return options[selectList.selectedIndex].value;
        },

        /**
         * Copy the passed image element.
         *
         * @param id the image element to copy.
         */
        cloneImage: function cloneImage(id) {
            var iconImage = this.getModeElementById(id);
            if (iconImage) {
                iconImage = iconImage.cloneNode(true);
                iconImage.removeAttribute('id');
                iconImage.style.display = '';
            }
            return iconImage;
        },

        getSelectList: function getSelectList() {
            return this.getModeElementById('share_type_selector');
        },

        getShareTypeSelector: function getShareTypeSelector() {
            return jQuery('#share_type_selector_' + this.mode);
        },

        getSubmitButton: function getSubmitButton() {
            return this.getForm().find('input[type=submit]');
        },

        getForm: function getForm() {
            return jQuery('#edit-entity');
        }
    };

    return EditSharesModel;
});