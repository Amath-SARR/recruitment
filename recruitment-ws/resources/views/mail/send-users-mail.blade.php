@component('mail::message')
# {!! $message->objet !!}
[![{{ config('app.name') }}]({{ asset('images/logo-recrutore.png') }})](https://recrutore.bambogroup.net/) <br>

{!! $message->description !!}

@component('mail::button', ['url' => config('app.fronturl')])
Accéder à la plateforme
@endcomponent

Merci,<br>
{{ config('app.name') }}
@endcomponent
