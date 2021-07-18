<?php

$secret = bin2hex(random_bytes(20));
echo "Secret:\n";
echo $secret;
echo "\nCopy this key to the .env file like this:\n";
echo "SECRET=" . $secret . "\n";
