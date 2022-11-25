@component('mail::message')
# Invitation à collaborer
[![{{ config('app.name') }}]({{ asset('images/logo-recrutore.png') }})](https://recrutore.bambogroup.net/) <br>
Bonjour **{{ $invitation->prenoms }}** <br>

Pour faciliter la gestion des campagnes de recrutement,
**{{$invitation->user->name}}** vous invite à venir collaborer
sur la gestion des recrutements de **Teranga**. <br>

Merci de cliquer sur le bouton ci-dessous pour accepter l'inivitation :

@component('mail::button', ['url' => config('app.fronturl').'/invitation/'.$invitation->uid.'/confirm'])
Accepter l'invitation
@endcomponent

Si vous ne parvenez pas à cliquer sur le bouton, merci de copier et de coller le lien suivant dans votre navigateur : {{config('app.fronturl').'/confirm-invitation/'.$invitation->uid}} <br>

Merci,<br>
{{ config('app.name') }}
@endcomponent
