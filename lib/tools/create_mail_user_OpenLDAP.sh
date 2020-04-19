#!/usr/bin/env bash

# Author:   Philipp Minges
# Purpose:  Add new OpenLDAP user for postfix mail server.
# Description: Original iRedMail addUser Script modded for ezlife.eu

# --------------------------- USAGE --------------------------------
# 1) Change variables below to fit your env:
#
#   - In 'Global Setting' section:
#       * STORAGE_BASE_DIRECTORY
#
#   - In 'LDAP Setting' section:
#       * LDAP_SUFFIX
#       * BINDDN
#       * BINDPW
#       * QUOTA
#

TOOLSDIR=$(pwd)/lib/tools

# Source functions.
. $TOOLSDIR/global
. $TOOLSDIR/core

# ----------------------------------------------
# ------------ Global Setting ------------------
# ----------------------------------------------
# Storage base directory used to store users' mail.
# mailbox of LDAP user will be:
#    ${STORAGE_BASE_DIRECTORY}/${DOMAIN_NAME}/${USERNAME}/
# Such as:
#    /var/vmail/vmail1/iredmail.org/zhb/
#   -------------------|===========|-----|
#   STORAGE_BASE_DIRECTORY|DOMAIN_NAME|USERNAME
#
STORAGE_BASE_DIRECTORY="/var/vmail/vmail1"

# ------------------------------------------------------------------
# -------------------------- LDAP Setting --------------------------
# ------------------------------------------------------------------
LDAP_SUFFIX="dc=ezlife,dc=eu"

# Setting 'BASE_DN'.
BASE_DN="o=domains,${LDAP_SUFFIX}"

# Setting 'DOMAIN_NAME' and DOMAIN_DN':
#     * DOMAIN will be used in mail address: ${USERNAME}@${DOMAIN}
#    * DOMAIN_DN will be used in LDAP dn.
DOMAIN_NAME="$1"
DOMAIN_DN="domainName=${DOMAIN_NAME}"
OU_USER_DN="ou=Users"

# ---------- rootdn of LDAP Server ----------
# Setting rootdn of LDAP.
BINDDN="cn=Manager,${LDAP_SUFFIX}"

# Setting rootpw of LDAP.
BINDPW='tERRUCJyzpNEH3wI5nY5SwkRXKyhEX'

# ---------- Virtual Domains & Users --------------
# Set default quota for LDAP users: 104857600 = 100M
QUOTA='1048576000'

# Default MTA Transport (Defined in postfix master.cf).
TRANSPORT='dovecot'

# Password setting.
PASSWORD_SCHEME='SSHA'   # MD5, SSHA. SSHA is recommended.
DEFAULT_PASSWD='ezlife-password'
USE_DEFAULT_PASSWD='YES'

# ------------------------------------------------------------------
# -------------------- Pure-FTPd Integration -----------------------
# ------------------------------------------------------------------
# Add objectClass and attributes for pure-ftpd integration.
# Note: You must inlucde pureftpd.schema in OpenLDAP slapd.conf first.
PUREFTPD_INTEGRATION='NO'
FTP_BASE_DIRECTORY='/home/ftp'

# ------------------------------------------------------------------
# ------------------------- Welcome Msg ----------------------------
# ------------------------------------------------------------------
# Send a welcome mail after user created.
SEND_WELCOME_MSG='NO'

# Set welcome mail info.
WELCOME_MSG_SUBJECT="Welcome!"
WELCOME_MSG_BODY="Welcome, new user."

# -------------------------------------------
# ----------- End Global Setting ------------
# -------------------------------------------

# Time stamp, will be appended in maildir.
DATE="$(date +%Y.%m.%d.%H.%M.%S)"

STORAGE_BASE="$(dirname ${STORAGE_BASE_DIRECTORY})"
STORAGE_NODE="$(basename ${STORAGE_BASE_DIRECTORY})"

# Get days since 1970-01-01
EPOCH_SECONDS="$(date +%s)"
DAYS_SINCE_EPOCH="$((EPOCH_SECONDS / 24 / 60 / 60))"

add_new_user()
{
    USERNAME="$(echo $1 | tr [A-Z] [a-z])"
    MAIL="$( echo $2 | tr [A-Z] [a-z])"
    CN="$( echo $3 | tr [A-Z] [a-z])"
    SN="$( echo $4 | tr [A-Z] [a-z])"

    maildir="${DOMAIN_NAME}/$(hash_maildir ${USERNAME})"

    # Generate user password.
    if [ X"${USE_DEFAULT_PASSWD}" == X'YES' ]; then
        PASSWD="$(python2 $TOOLSDIR/generate_password_hash.py ${PASSWORD_SCHEME} ${DEFAULT_PASSWD})"
    else
        PASSWD="$(python2 $TOOLSDIR/generate_password_hash.py ${PASSWORD_SCHEME} ${USERNAME})"
    fi

    if [ X"${PUREFTPD_INTEGRATION}" == X'YES' ]; then
        LDIF_PUREFTPD_USER="objectClass: PureFTPdUser
FTPStatus: enabled
FTPQuotaFiles: 50
FTPQuotaMBytes: 10
FTPDownloadBandwidth: 50
FTPUploadBandwidth: 50
FTPDownloadRatio: 5
FTPUploadRatio: 1
FTPHomeDir: ${FTP_BASE_DIRECTORY}/${DOMAIN_NAME}/${USERNAME}/
"
    else
        LDIF_PUREFTPD_USER=''
    fi

    ldapadd -x -D "${BINDDN}" -w "${BINDPW}" <<EOF
dn: mail=${MAIL},${OU_USER_DN},${DOMAIN_DN},${BASE_DN}
objectClass: inetOrgPerson
objectClass: shadowAccount
objectClass: amavisAccount
objectClass: mailUser
objectClass: top
accountStatus: active
storageBaseDirectory: ${STORAGE_BASE}
homeDirectory: ${STORAGE_BASE_DIRECTORY}/${maildir}
mailMessageStore: ${STORAGE_NODE}/${maildir}
mail: ${MAIL}
mailQuota: ${QUOTA}
userPassword: ${PASSWD}
cn: ${CN}
sn: ${SN}
givenName: ${USERNAME}
uid: ${USERNAME}
shadowLastChange: ${DAYS_SINCE_EPOCH}
amavisLocal: TRUE
enabledService: internal
enabledService: doveadm
enabledService: lib-storage
enabledService: quota-status
enabledService: indexer-worker
enabledService: dsync
enabledService: mail
enabledService: pop3
enabledService: pop3secured
enabledService: pop3tls
enabledService: imap
enabledService: imapsecured
enabledService: imaptls
enabledService: smtp
enabledService: smtpsecured
enabledService: smtptls
enabledService: managesieve
enabledService: managesievesecured
enabledService: sieve
enabledService: sievesecured
enabledService: deliver
enabledService: lda
enabledService: lmtp
enabledService: forward
enabledService: senderbcc
enabledService: recipientbcc
enabledService: shadowaddress
enabledService: displayedInGlobalAddressBook
enabledService: sogo
${LDIF_PUREFTPD_USER}
EOF
}

send_welcome_mail()
{
    MAIL="$1"
    echo "Send a welcome mail to new user: ${MAIL}"

    echo "${WELCOME_MSG_BODY}" | mail -s "${WELCOME_MSG_SUBJECT}" ${MAIL}
}

usage()
{
    echo "Usage:"
    echo -e "\t$0 DOMAIN USERNAME UID CN SN"
}

if [ $# -lt 4 ]; then
    usage
else
    # Promopt to check settings.
    [ X"${LDAP_SUFFIX}" == X"dc=example,dc=com" ] && echo "You should change 'LDAP_SUFFIX' in $0."

    # Get Parameters.
    DOMAIN_NAME="$(echo $1 | tr '[A-Z]' '[a-z]')"
    USERNAME="$(echo $2 | tr [A-Z] [a-z])"
    MAIL="${USERNAME}@${DOMAIN_NAME}"
    CN="$( echo $3 | tr [A-Z] [a-z])"
    SN="$( echo $4 | tr [A-Z] [a-z])"

    # Add new user in LDAP.
    add_new_user ${USERNAME} ${MAIL} ${CN} ${SN}

    # Send welcome msg to new user.
    [ X"${SEND_WELCOME_MSG}" == X'YES' ] && send_welcome_mail ${MAIL}
fi
