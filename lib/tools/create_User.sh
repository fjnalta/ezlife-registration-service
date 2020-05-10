#!/bin/bash

TOOLSDIR=$(pwd)/lib/tools
SCRIPT=create_mail_user_OpenLDAP.sh

CURRENT=`cat ./currentUser`

#sed -i "s/ezlife-password/$2/g" $TOOLSDIR/$SCRIPT
sed -i "/^DEFAULT_PASSWD=/c\DEFAULT_PASSWD=$2" $TOOLSDIR/$SCRIPT
bash $TOOLSDIR/$SCRIPT ezlife.eu $1 $3 $4 $CURRENT
#sed -i "s/$2/ezlife-password/g" $TOOLSDIR/$SCRIPT
sed -i "/^DEFAULT_PASSWD=/c\DEFAULT_PASSWD='ezlife-password'" $TOOLSDIR/$SCRIPT

# increment LDAP-uidNumber
CURRENT=$((CURRENT+1))
echo $CURRENT > ./currentUser