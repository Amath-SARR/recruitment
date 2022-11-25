@component('mail::message')
# confirmation de compte
[![{{ config('app.name') }}]({{ asset('images/logo-recrutore.png') }})](https://recrutore.bambogroup.net/) <br>
Bonjour **{{ $user->name }}**

Bienvenue sur {{config('app.name')}} <br>

Votre compte est créé avec succès. Merci de ciquer sur le bouton ci-dessous pour confirmer votre adresse email...<br>

@component('mail::button', ['url' => config('app.fronturl').'/confirm-account/'.$user->confirmationToken])
Confirmer le compte
@endcomponent

Si le lien ne fonctionne pas, merci de copier et coller le lien suivant dans votre navigateur:  <br>
Lien : {{config('app.fronturl').'/confirm-account/'.$user->confirmationToken}} <br>

Merci,<br>
{{ config('app.name') }}
@endcomponent
