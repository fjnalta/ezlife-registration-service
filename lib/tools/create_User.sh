#!/bin/bash

TOOLSDIR=$(pwd)
SCRIPT=create_mail_user_OpenLDAP.sh

sed -i "s/ezlife-password/$2/g" $TOOLSDIR/$SCRIPT
$TOOLSDIR/$SCRIPT ezlife.eu $1
sed -i "s/$2/ezlife-password/g" $TOOLSDIR/$SCRIPT