#!/usr/bin/env bash

# Author: Philipp Minges
# Purpose: Delete existing LDAP user. Adjusted to ezlife architecture.

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

# ---------- rootdn of LDAP Server ----------
# Setting rootdn of LDAP.
BINDDN="cn=Manager,${LDAP_SUFFIX}"

# Setting rootpw of LDAP.
BINDPW='rootpw'

# -------------------------------------------
# -------------- End Settings ---------------
# -------------------------------------------

delete_user() {
    USERNAME="$(echo $1 | tr [A-Z] [a-z])"

    # Delete LDAP User
    ldapmodify -D "${BINDDN}" -w "${BINDPW}"<<EOF
dn: uid=${USERNAME},${OU_USER_DN},${DOMAIN_DN},${BASE_DN}
changetype: delete
EOF
}

#############
# Execution #
#############

# Get Input Parameters
USERNAME="$(echo $1 | tr [A-Z] [a-z])"

# Delete User from LDAP
delete_user ${USERNAME}