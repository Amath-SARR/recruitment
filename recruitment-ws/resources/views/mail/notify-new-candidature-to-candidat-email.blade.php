@component('mail::message')
# Notification relative au dépôt de candidature
[![{{ config('app.name') }}]({{ asset('images/logo-recrutore.png') }})](https://recrutore.bambogroup.net/)

Bonjour **{{ $candidature->user->name }}**,

Votre dossier de candidature a bien été soumise à l’entreprise **{{$candidature->campagne->entreprise->name}}** pour la campagne de recrutement : **{{$candidature->campagne->titre}}**.

Vous serez notifié de l’état d’avancement du dossier.

Merci de cliquer sur le bouton ci-dessous pour suivre le statut de votre dossier :
@component('mail::button', ['url' => config('app.fronturl').'/campagne/'.$candidature->campagne->uid.'/details'])
Suivre mon dossier
@endcomponent

Si le boutton ne fonctionne pas, merci de copier et coller le lien suivant dans votre navigateur:  <br>
Lien : {{config('app.fronturl').'/campagne/'.$candidature->campagne->uid .'/details/'}}

**{{ config('app.name') }}** vous remercie. <br>

A très bientôt.
@endcomponent
