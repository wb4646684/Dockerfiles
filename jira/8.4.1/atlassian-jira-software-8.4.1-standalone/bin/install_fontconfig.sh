#!/bin/sh

# font package for Ubuntu, Amazon Linux, CentOS, RedHat Enterprise, Debian, Fedora and Alpine
font_package="fontconfig"

# warning message for running root to install fontconfig
warning_message="Please run the installer as root/sudo to be able to install fontconfig!"

for flag in $@
do
if test "$flag" = '--install-fontconfig' ; then
  dont_you_ask_me_for_installing_fontconfig="y"
fi
done

ask_for_permission() {
  if [ -z $dont_you_ask_me_for_installing_fontconfig ] ; then
    echo "We couldn't find fontconfig, which is required to use OpenJDK. Press [y, Enter] to install it.
For more info, see https://confluence.atlassian.com/x/PRCEOQ"

    read user_input
    if test "$user_input" != 'Y' && test "$user_input" != 'y' ; then
     echo "fontconfig is necessary to continue installing Jira, aborting installation" >&2
     exit 1
    fi
  fi
}


# Install font for different Linux distributions and check if it is installed successfully
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$NAME

    case $OS in
        *"Alpine"*)
            if apk info ${font_package} >/dev/null 2>&1; then
                :
            else
                ask_for_permission
                if [ "$(id -u)" -gt 0 ]; then
                    echo "${warning_message}" >&2
                    exit 1
                else
                    echo "Installing fontconfig..."
                    apk add ${font_package}
                fi
            fi
            ;;
        *"Amazon"* | *"CentOS"* | *"Red Hat Enterprise"*)
            if yum list installed ${font_package} >/dev/null 2>&1; then
                :
            else
                ask_for_permission
                if [ "$(id -u)" -gt 0 ]; then
                    echo "${warning_message}" >&2
                    exit 1
                else
                    echo "Installing fontconfig..."
                    yum install -y ${font_package}
                fi
            fi
            ;;
        *"Debian"* | "Ubuntu")
            if dpkg -s ${font_package} >/dev/null 2>&1; then
                :
            else
                ask_for_permission
                if [ "$(id -u)" -gt 0 ]; then
                    echo "${warning_message}" >&2
                    exit 1
                else
                    echo "Installing fontconfig..."
                    apt update && apt install -y ${font_package}
                fi
            fi
            ;;
        *"Fedora"*)
            if dnf list installed ${font_package} >/dev/null 2>&1; then
                :
            else
                ask_for_permission
                if [ "$(id -u)" -gt 0 ]; then
                    echo "${warning_message}" >&2
                    exit 1
                else
                    echo "Installing fontconfig..."
                    dnf install -y ${font_package}
                fi
            fi
            ;;
        *)
            echo "WARNING: Please make sure fontconfig is installed in your Linux distribution for Jira installation.
            Visit KB article for more information. https://confluence.atlassian.com/x/PRCEOQ" >&2
            ;;
    esac
fi

# This part is to handle the special case of centos 6, and RHEL 6
# centos 6 and RHEL 6 does not conform the modern way of OS identification data in /etc/os-release
if [ -f /etc/redhat-release ] || [ -f /etc/centos-release ]; then
    if yum list installed ${font_package} >/dev/null 2>&1; then
        :
    else
        ask_for_permission
        if [ "$(id -u)" -gt 0 ]; then
            echo "${warning_message}" >&2
            exit 1
        else
            echo "Installing fontconfig and dejavu sans fonts..."
            yum install -y ${font_package} && yum install -y dejavu-sans-fonts
        fi
    fi
fi

