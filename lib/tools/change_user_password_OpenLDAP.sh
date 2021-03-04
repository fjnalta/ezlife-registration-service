#!/usr/bin/env bash

# Author: Philipp Minges
# Purpose: Change password for existing LDAP user. Adjusted to ezlife architecture.

TOOLSDIR=$(pwd)/lib/tools

# Source functions
. $TOOLSDIR/global
. $TOOLSDIR/core

# -------------------------------------------------------------------
# -------------------------- LDAP Settings --------------------------
# -------------------------------------------------------------------
LDAP_SUFFIX="dc=example,dc=com"

BASE_DN="o=domains,${LDAP_SUFFIX}"

DOMAIN_NAME="example.com"
DOMAIN_DN="domainName=${DOMAIN_NAME}"
OU_USER_DN="ou=Users"

# Password scheme.
PASSWORD_SCHEME='SSHA'

change_password()
{
    USERNAME="$(echo $1 | tr [A-Z] [a-z])"
    OLDPASSWORD="$(echo $2)"
    NEWPASSWORD="$(echo $3)"

    # Generate user password.
    PASSWD="$(python2 $TOOLSDIR/generate_password_hash.py ${PASSWORD_SCHEME} ${NEWPASSWORD})"

    # Modify LDAP User
    ldapmodify -D "uid=${USERNAME},${OU_USER_DN},${DOMAIN_DN},${BASE_DN}" -w "${OLDPASSWORD}"<<EOF
dn: uid=${USERNAME},${OU_USER_DN},${DOMAIN_DN},${BASE_DN}
changetype: modify
replace: userPassword
userPassword: ${PASSWD}
EOF
}

#############
# Execution #
#############

# Get Input Parameters
USERNAME="$(echo $1 | tr [A-Z] [a-z])"
OLDPASSWORD="$(echo $2)"
NEWPASSWORD="$(echo $3)"

# Modify User in LDAP
change_password ${USERNAME} ${OLDPASSWORD} ${NEWPASSWORD}