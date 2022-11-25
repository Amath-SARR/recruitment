@component('mail::message')
# Rénitialisation du mot de passe
[![{{ config('app.name') }}]({{ asset('images/logo-recrutore.png') }})](https://recrutore.bambogroup.net/) <br>
Bonjour **{{ $user->name }}**

Bienvenue sur {{config('app.name')}} <br>

Merci de cliquer sur le bouton ci-dessous pour changer votre mot de passe...<br>

@component('mail::button', ['url' => config('app.fronturl').'/change-password/'.$user->confirmationToken])
Changer le mot de passe
@endcomponent

Si le lien ne fonctionne pas, merci de copier et coller le lien suivant dans votre navigateur:  <br>
Lien : {{config('app.fronturl').'/change-password/'.$user->confirmationToken}} <br>

Merci !<br>
{{ config('app.name') }}
@endcomponent
