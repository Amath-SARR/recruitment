@component('mail::message')
[![{{ config('app.name') }}]({{ asset('images/logo-recrutore.png') }})](https://recrutore.bambogroup.net/)

Bonjour **_{{$collaborateur->user->name}}_**,

Un nouveau dossier de candidature vient d'être déposé pour le compte de la campagne **{{$candidature->campagne->titre}}** pour l'entreprise **{{$candidature->campagne->entreprise->name}}**.

**_Candidat_**: _{{$candidature->user->name}}_

**_Cv_**:  [Voir le Cv]({{request()->getSchemeAndHttpHost() . '/uploads/candidatures/' . $candidature->cv }})

**_E-mail_**: {{$candidature->user->email}}

**_Téléphone_**: [{{$candidature->user->telephone}}](tel:{{Str::replace(' ', '', $candidature->user->telephone)}})

Vous recevez ce mail parce que vous faîtes partie des collaborateurs de l’entreprise **{{$candidature->campagne->entreprise->name}}**.

Vous pouvez donner suite à ce dossier en accédant à la plateforme **{{ config('app.name') }}** sur le lien suivant: [{{$candidature->campagne->titre}}]({{config('app.fronturl').'/campagne/'.$candidature->campagne->uid.'/details'}}).

Et voici le lien de visualisation du dossier du candidat: [{{$candidature->user->name}}]({{config('app.fronturl').'/candidature/'.$candidature->campagne->entreprise->id.'/'.$candidature->uid}}).

À très bientôt.

Cordialement, **{{ config('app.name') }}**.
@endcomponent



