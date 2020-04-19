#!/usr/bin/env bash

# Author:   Philipp Minges
# Purpose:  Add new OpenLDAP user for postfix mail server.

TOOLSDIR=$(pwd)/lib/tools

# Source functions
. $TOOLSDIR/global
. $TOOLSDIR/core

# -----------------------------------------------
# ------------ Global Settings ------------------
# -----------------------------------------------
# Storage base directory used to store users' mail.
# mailbox of LDAP user will be:
STORAGE_BASE_DIRECTORY="/var/vmail/vmail1"

# -------------------------------------------------------------------
# -------------------------- LDAP Settings --------------------------
# -------------------------------------------------------------------
LDAP_SUFFIX="dc=ezlife,dc=eu"

# Setting 'BASE_DN'.
BASE_DN="o=domains,${LDAP_SUFFIX}"

# Setting 'DOMAIN_NAME' and DOMAIN_DN':
#     * DOMAIN will be used in mail address: ${USERNAME}@${DOMAIN}
#     * DOMAIN_DN will be used in LDAP dn.
DOMAIN_NAME="ezlife.eu"
DOMAIN_DN="domainName=${DOMAIN_NAME}"
OU_USER_DN="ou=Users"

# ---------- rootdn of LDAP Server ----------
# Setting rootdn of LDAP.
BINDDN="cn=Manager,${LDAP_SUFFIX}"

# Setting rootpw of LDAP.
BINDPW='tERRUCJyzpNEH3wI5nY5SwkRXKyhEX'

# ---------- Virtual Domains & Users --------------
# Set default quota for LDAP users: 104857600 = 100M
QUOTA='104857600'

# Default MTA Transport (Defined in postfix master.cf).
TRANSPORT='dovecot'

# Password scheme.
PASSWORD_SCHEME='SSHA'   # MD5, SSHA. SSHA is recommended.

# ------------------------------------------------------------------
# -------------------- Pure-FTPd Integration -----------------------
# ------------------------------------------------------------------
# Add objectClass and attributes for pure-ftpd integration.
# Note: You must inlucde pureftpd.schema in OpenLDAP slapd.conf first.
PUREFTPD_INTEGRATION='NO'
FTP_BASE_DIRECTORY='/home/ftp'

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
    PASSWORD="$(echo $2)"
    MAIL="$( echo $3 | tr [A-Z] [a-z])"
    CN="$( echo $4 | tr [A-Z] [a-z])"
    SN="$( echo $5 | tr [A-Z] [a-z])"

    maildir="${DOMAIN_NAME}/$(hash_maildir ${USERNAME})"

    # Generate user password.
    PASSWD="$(python2 $TOOLSDIR/generate_password_hash.py ${PASSWORD_SCHEME} ${PASSWORD})"

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

# ----------------------------------------
# ------------ Start Script --------------
# ----------------------------------------

# Get Parameters.
USERNAME="$(echo $1 | tr [A-Z] [a-z])"
PASSWORD="$(echo $2)"
MAIL="${USERNAME}@${DOMAIN_NAME}"
CN="$( echo $3 | tr [A-Z] [a-z])"
SN="$( echo $4 | tr [A-Z] [a-z])"

# Add new user in LDAP.
add_new_user ${USERNAME} ${PASSWORD} ${MAIL} ${CN} ${SN}
