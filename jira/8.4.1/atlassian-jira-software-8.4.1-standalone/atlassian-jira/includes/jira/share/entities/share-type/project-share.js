define('jira/share/entities/share-type/project-share', ['jira/share/entities/display', 'jira/share/entities/share-permission', 'jira/share/i18n', 'jquery'], function (Display, SharePermission, i18n, jQuery) {
    'use strict';

    /**
     * Object that represents the "Project" ShareType.
     */

    function ProjectShare(parentClass) {
        //TODO: These maps should be removed. Either send the relevant data in the JSON objects or use some kind of AJAX call.
        this.roleMap = {};
        this.projectMap = {};
        this.type = 'project';
        this.singleton = false;
        this.parentElement = document.querySelector('.' + parentClass);
        this.dirty = false;
    }

    ProjectShare.prototype = {
        initialise: function initialise() {
            var that = this;

            this.projectSelect = this.getSubElement('project-share');
            this.roleSelect = this.getSubElement('role-share');
            this.roleSelectGroup = this.getSubElement('role-group-share');

            if (!this.roleSelect || !this.projectSelect || !this.roleSelectGroup) {
                return;
            }

            var option;
            var i;

            //loop through the role "select" element to create a mapping between role.id -> role.name.
            for (i = 1; i < this.roleSelect.options.length; i++) {
                option = this.roleSelect.options[i];
                this.roleMap[option.value] = option.text;
            }

            //loop through the project "select" element to create a mapping between project.id -> project.name.
            for (i = 0; i < this.projectSelect.options.length; i++) {
                option = this.projectSelect.options[i];
                this.projectMap[option.value] = option.text;
            }

            this.setRoles();

            jQuery(this.projectSelect).change(function (e) {
                that.dirty = true;
                that.changeCallbackForProject(e);
            });
        },

        /**
         * Return the Display that needs to be rendered when the user configures a new project "ShareType" using
         * the GUI.
         */
        getDisplayFromUI: function getDisplayFromUI() {
            if (!this.projectSelect || !this.roleSelect) {
                return;
            }

            var selectedProjectOption = this.projectSelect.options[this.projectSelect.selectedIndex];
            var projectValue = selectedProjectOption.value;
            var projectDisplay = selectedProjectOption.text;

            var selectedRoleOption = this.roleSelect.options[this.roleSelect.selectedIndex];
            var roleValue = selectedRoleOption.value;
            var roleDisplay = selectedRoleOption.text;

            var inner;
            if (roleValue === '') {
                inner = i18n.getMessage('share_project_display_all');
                inner = i18n.formatMessage(inner, projectDisplay);
            } else {
                inner = i18n.getMessage('share_project_display');
                inner = i18n.formatMessage(inner, projectDisplay, roleDisplay);
            }

            var newPermission = new SharePermission(this.type, projectValue, roleValue);
            return new Display(inner, this.getDescriptionString(projectDisplay, roleValue, roleDisplay, true), this.singleton, newPermission);
        },

        /**
         * Returns a boolean indicating whether the value has changed
         */
        inputChangesExist: function inputChangesExist() {
            return this.dirty;
        },

        /**
         * Return a simple description that can be used as a title for a PROJECT "ShareType".
         * This is based off currenlty selected drop downs.
         * This should be more descriptive that than the display but not too verbose
         */
        getDisplayDescriptionFromUI: function getDisplayDescriptionFromUI() {
            if (!this.projectSelect || !this.roleSelect) {
                return '';
            }

            var selectedProjectOption = this.projectSelect.options[this.projectSelect.selectedIndex];
            var projectDisplay = selectedProjectOption.text;

            var selectedRoleOption = this.roleSelect.options[this.roleSelect.selectedIndex];
            var roleValue = selectedRoleOption.value;
            var roleDisplay = selectedRoleOption.text;

            return this.getDescriptionString(projectDisplay, roleValue, roleDisplay, false);
        },

        /**
         * Returns a simple description based off passed in project and role.
         *
         * @param project       Project name to display
         * @param roleValue     Role value to determine whether or not to use role part of permission.
         * @param roleDisplay   The Role name to display.
         * @param unescaped     Whether or not params will be escaped when substituted.
         */
        getDescriptionString: function getDescriptionString(project, roleValue, roleDisplay, unescaped) {
            var inner;
            if (!roleValue || roleValue === '') {
                roleValue = null;
                inner = i18n.getMessage('share_project_description');
                if (unescaped) {
                    inner = i18n.formatMessageUnescaped(inner, project);
                } else {
                    inner = i18n.formatMessage(inner, project);
                }
            } else {
                inner = i18n.getMessage('share_role_description');
                if (unescaped) {
                    inner = i18n.formatMessageUnescaped(inner, roleDisplay, project);
                } else {
                    inner = i18n.formatMessage(inner, roleDisplay, project);
                }
            }

            return inner;
        },

        /**
         * Return the Display that that should be rendered for the passed permission.
         *
         * @param permission the permission to get the Display for.
         */
        getDisplayFromPermission: function getDisplayFromPermission(permission) {
            var inner;
            var newPermission;
            var description;
            var projectName;
            var roleName;

            if (!permission || permission.type !== this.type || !permission.param1) {
                return null;
            }

            if (permission.param2) {
                projectName = this.getProject(permission.param1);
                roleName = this.getRole(permission.param2);
                inner = i18n.getMessage('share_project_display');
                inner = i18n.formatMessage(inner, projectName, roleName);
                newPermission = new SharePermission(this.type, permission.param1, permission.param2);
                description = this.getDescriptionString(projectName, permission.param2, roleName, true);
            } else {

                projectName = this.getProject(permission.param1);
                inner = i18n.getMessage('share_project_display_all');
                inner = i18n.formatMessage(inner, projectName);
                newPermission = new SharePermission(this.type, permission.param1, null);
                description = this.getDescriptionString(projectName, null, null, true);
            }

            return new Display(inner, description, this.singleton, newPermission);
        },

        getDisplayWarning: function getDisplayWarning() {
            return '';
        },
        /**
         * Create a callback that changes the state of the project select element based on the projects the user
         * is a member of.
         */
        changeCallbackForProject: function changeCallbackForProject() {
            this.setRoles();
        },

        setProject: function setProject(selectedProjectId) {
            if (!this.projectSelect) {
                return;
            }

            var options = this.projectSelect.options;
            for (var i = 0; i < options.length; i++) {
                if (options[i].value === selectedProjectId) {
                    options[i].selected = true;
                }
            }
        },

        /**
         * Set the roles "select" element for the currently selected project. Only the roles that the user is a member
         * of for the passed project should be displayed.
         */
        setRoles: function setRoles(selectedRoleId) {
            if (!this.projectSelect || !this.roleSelect || !this.roleSelectGroup) {
                return;
            }

            var option = this.projectSelect.options[this.projectSelect.selectedIndex];
            var roles = option.getAttribute('roles');
            var rolesArray;
            if (roles) {
                try {
                    rolesArray = JSON.parse(roles);
                    if (!rolesArray) {
                        rolesArray = [];
                    }
                } catch (ex) {
                    rolesArray = [];
                }
            } else {
                rolesArray = [];
            }

            if (this.roleSelectGroup.parentNode) {
                this.roleSelect.removeChild(this.roleSelectGroup);
                this.roleSelectGroup = this.roleSelectGroup.cloneNode(false);
            }

            var selOpt = null;
            if (rolesArray.length > 0) {
                for (var i = 0; i < rolesArray.length; i++) {
                    var newOption = document.createElement('OPTION');
                    newOption.appendChild(document.createTextNode(this.roleMap[rolesArray[i]]));
                    var roleId = rolesArray[i];
                    newOption.value = roleId;
                    if (roleId === selectedRoleId) {
                        selOpt = newOption;
                    }
                    this.roleSelectGroup.appendChild(newOption);
                }
                this.roleSelect.appendChild(this.roleSelectGroup);
            }
            //we have to select the option after it has been added to the DOM to keep Opera happy.
            if (selOpt) {
                selOpt.selected = true;
            }
        },

        /**
         * Return the project display for the passed id.
         *
         * @param id the id of the project to return.
         */
        getProject: function getProject(id) {
            var project = this.projectMap[id];
            if (!project) {
                project = i18n.getMessage('share_invalid_project');
                if (!project) {
                    project = '[Invalid Project]';
                }
            }
            return project;
        },

        /**
         * Return the role display for the passed id.
         *
         * @param id the id of the role to return.
         */
        getRole: function getRole(id) {
            var role = this.roleMap[id];
            if (!role) {
                role = i18n.getMessage('share_invalid_role');
                if (!role) {
                    role = '[Invalid Role]';
                }
            }
            return role;
        },

        updateSelectionFromPermission: function updateSelectionFromPermission(sharePermission) {
            this.setProject(sharePermission.param1);
            this.setRoles(sharePermission.param2);
        },

        getSubElement: function getSubElement(className) {
            return this.parentElement.querySelector('.' + className);
        }
    };

    return ProjectShare;
});