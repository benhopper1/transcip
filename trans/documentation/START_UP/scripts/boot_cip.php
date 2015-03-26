<?php


echo exec("bash /home/wally/transcip/cip/cip_forever.sh > /dev/null 2>&1 &");
echo exec("ls &");

//$execSring = "node app.js &";

//echo exec($execSring);
