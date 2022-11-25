<?php
return [
    'client' => [
        'id' => env('ORANGE_CLIENT_ID'),
        'secret' => env('ORANGE_CLIENT_SECRET')
    ],
    'access_token'=>env('ORANGE_CLIENT_ACCESS_TOKEN'),
    'verify_ssl'=>env('ORANGE_VERIFY_SSL'),
    'from'=>env('ORANGE_SENDER_ADDRESS')
];
