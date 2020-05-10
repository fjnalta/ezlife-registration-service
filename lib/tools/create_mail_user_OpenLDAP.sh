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
    GIVENNAME="$( echo $4 | tr [A-Z] [a-z])"
    SN="$( echo $5 | tr [A-Z] [a-z])"
    UIDNUMBER="$(echo $6)"

    maildir="${DOMAIN_NAME}/$(hash_maildir ${USERNAME})"

    # Generate user password.
    PASSWD="$(python2 $TOOLSDIR/generate_password_hash.py ${PASSWORD_SCHEME} ${PASSWORD})"

    # create LDAP User
    ldapadd -x -D "${BINDDN}" -w "${BINDPW}"<<EOF
dn: uid=${USERNAME},${OU_USER_DN},${DOMAIN_DN},${BASE_DN}
objectClass: posixAccount
objectClass: inetOrgPerson
objectClass: shadowAccount
objectClass: amavisAccount
objectClass: mailUser
objectClass: top
gidNumber: 10000
uidNumber: ${UIDNUMBER}
accountStatus: active
storageBaseDirectory: ${STORAGE_BASE}
homeDirectory: ${STORAGE_BASE_DIRECTORY}/${maildir}
mailMessageStore: ${STORAGE_NODE}/${maildir}
mail: ${MAIL}
mailQuota: ${QUOTA}
maildrop: ${STORAGE_BASE_DIRECTORY}/${maildir}
userPassword: ${PASSWD}
givenName: ${GIVENNAME}
sn: ${SN}
cn: ${GIVENNAME} ${SN}
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
EOF
}

# ----------------------------------------
# ------------ Start Script --------------
# ----------------------------------------

# Get Parameters.
USERNAME="$(echo $1 | tr [A-Z] [a-z])"
PASSWORD="$(echo $2)"
MAIL="${USERNAME}@${DOMAIN_NAME}"
GIVENNAME="$( echo $3 | tr [A-Z] [a-z])"
SN="$( echo $4 | tr [A-Z] [a-z])"

# Get LDAP-uidNumber
if [ ! -f $TOOLSDIR/currentUser ]; then
    echo "10000" > $TOOLSDIR/currentUser
    UIDNUMBER=`cat $TOOLSDIR/currentUser`
else
    UIDNUMBER=`cat $TOOLSDIR/currentUser`
fi

# Add new user in LDAP.
add_new_user ${USERNAME} ${PASSWORD} ${MAIL} ${GIVENNAME} ${SN} ${UIDNUMBER}

# increment LDAP-uidNumber
UIDNUMBER=$((UIDNUMBER+1))
echo $UIDNUMBER > $TOOLSDIR/currentUser