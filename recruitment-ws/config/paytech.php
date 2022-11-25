<?php

return [
    'api'=>[
        'key'=>env('PAYTECH_API_KEY'),
        'secret'=>env('PAYTECH_API_SECRET')
    ],
    'base'=>[
        'url'=>env('PAYTECH_BASE_URL')
    ],
    'mode'=>env('PAYTECH_TEST_ENABLED')
];
