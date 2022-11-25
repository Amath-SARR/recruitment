@component('mail::message')
# Résumé des candidatures
[![{{ config('app.name') }}]({{ asset('images/logo-recrutore.png') }})](https://recrutore.bambogroup.net/)

Bonjour **{{ $candidature->user->name }}**,

Le résumé des candidatures pour la campagne de recrutement " **{{ $activeCampagne->titre }}** " à l'entreprise **{{ $candidature->campagne->entreprise->name }}** est établi comme suit:

Le nombre de candidats qui sont postulés suite au lancement de votre campagne sont au nombre de $candidatures\n
Parmis eux $candidaturesDuJours est(sont) postulé(s) aujourd'hui \n
$candidaturesInteressant  candidatures marquées comme étant intéressantes et\n
$candidaturesEnAttente candidature(s) est(sont) en attente

Le rapport des candidatures pour la campagne de recrutement " **{{ $candidature->campagne->titre }}** " à l'entreprise **{{ $candidature->campagne->entreprise->name }}** :

|  |  |
| ------ | ------ |
| **_Le totale des candidatures_** | {{ $candidatures }} |
| **_Les candidatures du jour_** | {{ $candidaturesDuJours }} |
| **_Les candidatures en anttente_** | {{ $candidaturesInteressant }} |
| **_Les candidatures en attente** | {!! $candidaturesEnAttente !!} |
@component('mail::button', ['url' => ''])
Button Text
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
