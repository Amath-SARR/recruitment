@component('mail::message')
# Rapport de dossier de candidature
[![{{ config('app.name') }}]({{ asset('images/logo-recrutore.png') }})](https://recrutore.bambogroup.net/)

Bonjour **{{ $candidature->user->name }}**,

Le rapport de votre dossier de candidature pour la campagne de recrutement " **{{ $candidature->campagne->titre }}** " à l'entreprise **{{ $candidature->campagne->entreprise->name }}** est établi comme suit:

|  |  |
| ------ | ------ |
| **_Date de dépôt_** | {{ $candidature->created_at }} |
| **_Etat de la candidature_** | {{ $candidature->currentState->nomState }} |
| **_CV_** | [Voir le Cv]({{request()->getSchemeAndHttpHost() . '/uploads/candidatures/' . $candidature->cv }})  |
| **_Source_** | {{ $candidature->source }} |
| **_Motivation_** | {!! $candidature->motivation !!} |

Merci de cliquer sur le bouton ci-dessous pour suivre le statut de votre dossier :
@component('mail::button', ['url' => config('app.fronturl').'/campagne/'.$candidature->campagne->uid.'/details'])
Suivre mon dossier
@endcomponent

Vous serez notifié de l’état d’avancement du dossier.

**{{ config('app.name') }}** vous remercie.

A très bientôt.
@endcomponent
